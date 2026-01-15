/**
 * useLiveSocket
 *
 * Transport-level hook:
 * - connect / disconnect
 * - reconnect with exponential backoff
 * - heartbeat ping/pong
 * - seq/ack and pending resend
 *
 * Business handling should be implemented in `onEvent`.
 */

import { useCallback, useEffect, useRef, useState } from 'react'

export type LiveSocketRole = 'teacher' | 'student' | 'observer'

export type LiveSocketStatus = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed'

export type LiveSocketEvent =
	| { type: 'joined'; payload: any; ack_seq?: number }
	| { type: 'participant:update'; payload: any }
	| { type: 'whiteboard:patch'; payload: any }
	| { type: 'question:open'; payload: any }
	| { type: 'recording:status'; payload: any }
	| { type: 'pong' }
	| { type: 'error'; code?: number; message?: string; payload?: any }
	| { type: string; payload?: any; [k: string]: any }

export interface UseLiveSocketOptions {
	liveId: string
	token: string
	userId: string
	role: LiveSocketRole
	displayName?: string
	onEvent?: (evt: LiveSocketEvent) => void
	autoConnect?: boolean
	wsUrlBase?: string // e.g. wss://example.com
	heartbeatMs?: number
	maxReconnectAttempts?: number
}

const DEFAULT_BACKOFF_MS = [2000, 5000, 10000, 20000, 40000]

function buildWsUrl(liveId: string, token: string, wsUrlBase?: string) {
	if (wsUrlBase) {
		return `${wsUrlBase.replace(/\/$/, '')}/live/${liveId}/ws?token=${encodeURIComponent(token)}`
	}
	return `${window.location.origin.replace(/^http/, 'ws')}/live/${liveId}/ws?token=${encodeURIComponent(token)}`
}

export function useLiveSocket(opts: UseLiveSocketOptions) {
	const {
		liveId,
		token,
		userId,
		role,
		displayName,
		onEvent,
		autoConnect = true,
		wsUrlBase,
		heartbeatMs = 15000,
		maxReconnectAttempts = 6
	} = opts

	const socketRef = useRef<WebSocket | null>(null)
	const seqRef = useRef<number>(0)
	const pendingRef = useRef<Map<number, any>>(new Map())
	const reconnectAttemptsRef = useRef<number>(0)
	const pingTimerRef = useRef<number | null>(null)
	const reconnectTimerRef = useRef<number | null>(null)

	const onEventRef = useRef(onEvent)
	useEffect(() => {
		onEventRef.current = onEvent
	}, [onEvent])

	const [status, setStatus] = useState<LiveSocketStatus>('idle')
	const [lastMessage, setLastMessage] = useState<LiveSocketEvent | null>(null)

	const stopHeartbeat = useCallback(() => {
		if (pingTimerRef.current) {
			clearInterval(pingTimerRef.current)
			pingTimerRef.current = null
		}
	}, [])

	const sendRaw = useCallback((obj: any) => {
		const ws = socketRef.current
		if (!ws || ws.readyState !== WebSocket.OPEN) return false
		try {
			ws.send(JSON.stringify(obj))
			return true
		} catch {
			return false
		}
	}, [])

	const nextSeq = useCallback(() => {
		seqRef.current += 1
		return seqRef.current
	}, [])

	const sendEvent = useCallback(
		(type: string, payload?: any) => {
			const seq = nextSeq()
			const obj = { type, seq, payload, ts: new Date().toISOString() }
			pendingRef.current.set(seq, obj)
			sendRaw(obj)
			return seq
		},
		[nextSeq, sendRaw]
	)

	const handleServerMessage = useCallback(
		(msg: any) => {
			if (msg?.ack_seq) {
				const ack = Number(msg.ack_seq)
				for (const s of Array.from(pendingRef.current.keys())) {
					if (s <= ack) pendingRef.current.delete(s)
				}
			}

			const evt: LiveSocketEvent = {
				type: msg?.type || 'unknown',
				payload: msg?.payload,
				code: msg?.code,
				message: msg?.message,
				ack_seq: msg?.ack_seq
			}

			setLastMessage(evt)
			onEventRef.current?.(evt)
		},
		[]
	)

	const startHeartbeat = useCallback(() => {
		stopHeartbeat()
		pingTimerRef.current = window.setInterval(() => {
			sendRaw({ type: 'ping', ts: new Date().toISOString() })
		}, heartbeatMs)
	}, [heartbeatMs, sendRaw, stopHeartbeat])

	const disconnect = useCallback(() => {
		stopHeartbeat()
		if (reconnectTimerRef.current) {
			clearTimeout(reconnectTimerRef.current)
			reconnectTimerRef.current = null
		}
		if (socketRef.current) {
			try {
				socketRef.current.close()
			} catch {
				// ignore
			}
			socketRef.current = null
		}
		setStatus('closed')
	}, [stopHeartbeat])

	const scheduleReconnect = useCallback(() => {
		reconnectAttemptsRef.current += 1
		if (reconnectAttemptsRef.current > maxReconnectAttempts) {
			setStatus('closed')
			return
		}
		const idx = reconnectAttemptsRef.current - 1
		const backoff = Math.min(60000, DEFAULT_BACKOFF_MS[idx] ?? 60000)
		setStatus('reconnecting')
		reconnectTimerRef.current = window.setTimeout(() => {
			connect()
		}, backoff)
	}, [maxReconnectAttempts])

	const connect = useCallback(() => {
		if (!liveId || !token) return
		const existing = socketRef.current
		if (existing && existing.readyState === WebSocket.OPEN) return

		setStatus('connecting')
		const url = buildWsUrl(liveId, token, wsUrlBase)
		const ws = new WebSocket(url)
		socketRef.current = ws

		ws.onopen = () => {
			reconnectAttemptsRef.current = 0
			setStatus('open')

			const joinSeq = nextSeq()
			sendRaw({
				type: 'join',
				seq: joinSeq,
				payload: { liveId, userId, role, displayName },
				ts: new Date().toISOString()
			})

			startHeartbeat()
		}

		ws.onmessage = (ev) => {
			try {
				const data = JSON.parse(String(ev.data))
				handleServerMessage(data)
			} catch {
				// ignore invalid frames
			}
		}

		ws.onclose = () => {
			stopHeartbeat()
			socketRef.current = null
			if (status !== 'closed') scheduleReconnect()
		}

		ws.onerror = () => {
			// onclose handles reconnect
		}
	}, [displayName, handleServerMessage, liveId, nextSeq, role, scheduleReconnect, sendRaw, startHeartbeat, status, stopHeartbeat, token, userId, wsUrlBase])

	// resend pending messages after reconnect
	useEffect(() => {
		if (status !== 'open') return
		const pending = Array.from(pendingRef.current.entries()).sort((a, b) => a[0] - b[0])
		for (const [, obj] of pending) {
			sendRaw(obj)
		}
	}, [sendRaw, status])

	useEffect(() => {
		if (!autoConnect) return
		connect()
		return () => disconnect()
	}, [autoConnect, connect, disconnect])

	return {
		connect,
		disconnect,
		sendEvent,
		status,
		lastMessage,
		pendingCount: () => pendingRef.current.size
	}
}

export default useLiveSocket
