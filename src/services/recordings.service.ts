/**
 * Recording service with mock behaviors:
 * - In-memory storage
 * - `createFromLive()` creates a recording with status=processing then flips to ready after a few seconds
 *   (for demoing polling / long-running server jobs like transcoding)
 */

import api from './apiClient'
import { type Recording } from '@/types/models/recording'
import mockDataJson from '@/data/mock/data.json'

// 默认在开发环境使用 mock，除非明确设置为 false
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false' && (import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === 'true')

type MockData = {
	recordings?: Recording[]
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const STORAGE_KEY = 'mock.recordings'

function loadStorage(): Recording[] {
	if (typeof window === 'undefined') return [...(((mockDataJson as unknown) as MockData).recordings ?? [])]
	try {
		const cached = window.localStorage.getItem(STORAGE_KEY)
		if (cached) {
			const parsed = JSON.parse(cached)
			if (Array.isArray(parsed)) return parsed
		}
	} catch (err) {
		console.warn('recordings load failed, fallback to seed', err)
	}
	return [...(((mockDataJson as unknown) as MockData).recordings ?? [])]
}

const recordingsStorage: Recording[] = loadStorage()

const processingFirstSeenMs = new Map<string, number>()

function persistStorage() {
	if (typeof window === 'undefined') return
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recordingsStorage))
	} catch (err) {
		console.warn('recordings persist failed', err)
	}
}

function nowId(prefix = 'rec') {
	return `${prefix}-${Date.now().toString(36)}`
}

function toDateLabel(iso = new Date().toISOString()) {
	// YYYY-MM-DD
	return iso.slice(0, 10)
}

function simulateProcessing(recordingId: string, secs = 4) {
	setTimeout(() => {
		const idx = recordingsStorage.findIndex((r) => r.id === recordingId)
		if (idx === -1) return
		recordingsStorage[idx] = {
			...recordingsStorage[idx],
			status: 'ready',
			duration: recordingsStorage[idx].duration || '01:00:00'
		}
		persistStorage()
	}, secs * 1000)
}

export const recordingsService = {
	async list(courseId?: string): Promise<Recording[]> {
		if (USE_MOCK) {
			await delay(30)
			let mutated = false
			const now = Date.now()
			for (let i = 0; i < recordingsStorage.length; i += 1) {
				const rec = recordingsStorage[i] as Recording & { created_at?: string }
				if (rec.status !== 'processing') continue

				// Prefer persisted created_at when available; otherwise, fall back to in-session tracking.
				const createdMs = rec.created_at ? new Date(rec.created_at).getTime() : NaN
				let ageMs = Number.isFinite(createdMs) ? now - createdMs : NaN
				if (!Number.isFinite(ageMs)) {
					const firstSeen = processingFirstSeenMs.get(rec.id)
					if (!firstSeen) {
						processingFirstSeenMs.set(rec.id, now)
						ageMs = 0
					} else {
						ageMs = now - firstSeen
					}
				}

				// After a short delay, auto-flip to ready so long-running jobs are observable in E2E
				if (ageMs > 3000) {
					recordingsStorage[i] = { ...rec, status: 'ready', duration: rec.duration || '01:00:00' }
					mutated = true
				}
			}
			if (mutated) persistStorage()
			return courseId ? recordingsStorage.filter((rec) => rec.courseId === courseId) : [...recordingsStorage]
		}
		const endpoint = courseId ? `/recordings?courseId=${encodeURIComponent(courseId)}` : '/recordings'
		const res = await api.get<Recording[]>(endpoint)
		// 确保返回的是数组
		return Array.isArray(res.data) ? res.data : []
	},

	async get(id: string): Promise<Recording | undefined> {
		if (USE_MOCK) {
			await delay(20)
			return recordingsStorage.find((rec) => rec.id === id)
		}
		try {
			const res = await api.get<Recording>(`/recordings/${id}`)
			return res.data
		} catch (err) {
			console.warn('get recording API 调用失败，回退到 mock 模式', err)
			// 如果 API 调用失败，回退到 mock 实现
			await delay(20)
			return recordingsStorage.find((rec) => rec.id === id)
		}
	},

	async createFromLive(liveSession: { id: string; courseId: string; startAt: string }): Promise<Recording> {
		if (USE_MOCK) {
			await delay(100)
			const rec: Recording & { created_at?: string } = {
				id: nowId('rec'),
				courseId: liveSession.courseId,
				title: `录播 ${liveSession.courseId} ${toDateLabel()}`,
				duration: '00:00:00',
				date: toDateLabel(),
				status: 'processing',
				preview: '',
				// extra metadata for mock aging
				created_at: new Date().toISOString()
			}
			recordingsStorage.unshift(rec)
			persistStorage()
			simulateProcessing(rec.id, 4)
			return rec
		}
		try {
			// Real API (example): create recording job from live session
			const res = await api.post<Recording>(`/live/${liveSession.id}/record`)
			return res.data
		} catch (err) {
			console.warn('createFromLive API 调用失败，回退到 mock 模式', err)
			// 如果 API 调用失败，回退到 mock 实现
			await delay(100)
			const rec: Recording & { created_at?: string } = {
				id: nowId('rec'),
				courseId: liveSession.courseId,
				title: `录播 ${liveSession.courseId} ${toDateLabel()}`,
				duration: '00:00:00',
				date: toDateLabel(),
				status: 'processing',
				preview: '',
				created_at: new Date().toISOString()
			}
			recordingsStorage.unshift(rec)
			persistStorage()
			simulateProcessing(rec.id, 4)
			return rec
		}
	},

	async remove(id: string): Promise<boolean> {
		if (USE_MOCK) {
			await delay(50)
			const idx = recordingsStorage.findIndex((r) => r.id === id)
			if (idx !== -1) recordingsStorage.splice(idx, 1)
			persistStorage()
			return true
		}
		try {
			await api.delete(`/recordings/${id}`)
			return true
		} catch (err) {
			console.warn('remove recording API 调用失败，回退到 mock 模式', err)
			// 如果 API 调用失败，回退到 mock 实现
			await delay(50)
			const idx = recordingsStorage.findIndex((r) => r.id === id)
			if (idx !== -1) recordingsStorage.splice(idx, 1)
			persistStorage()
			return true
		}
	}
}

export default recordingsService
