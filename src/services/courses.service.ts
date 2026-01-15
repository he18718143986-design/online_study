/**
 * Course service with mock behaviors:
 * - list/get from mock JSON
 * - startLive/endLive manage an in-memory live session list
 * - endLive creates a recording via recordingsService (processing -> ready after delay)
 */

import api from './apiClient'
import { type Course } from '@/types/models/course'
import mockDataJson from '@/data/mock/data.json'
import recordingsService from '@/services/recordings.service'

// 默认在开发环境使用 mock，除非明确设置为 false
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false' && (import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === 'true')

type LiveStatus = 'prepare' | 'live' | 'ended'

export type LiveSession = {
	id: string
	courseId: string
	startAt: string
	endAt?: string
	status: LiveStatus
}

type MockData = {
	courses?: Course[]
	// optional seed
	live_sessions?: LiveSession[]
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const dataset = (mockDataJson as unknown) as MockData
const coursesStorage: Course[] = [...(dataset.courses ?? [])]
const liveSessions: LiveSession[] = [...(dataset.live_sessions ?? [])]

function nowId(prefix = 'live') {
	return `${prefix}-${Date.now().toString(36)}`
}

export const coursesService = {
	async list(params?: { status?: Course['status'] }): Promise<Course[]> {
		if (USE_MOCK) {
			await delay(50)
			if (params?.status) return coursesStorage.filter((c) => c.status === params.status)
			return [...coursesStorage]
		}
		const res = await api.get<Course[]>('/courses', { params })
		// 确保返回的是数组
		return Array.isArray(res.data) ? res.data : []
	},

	async get(id: string): Promise<Course | undefined> {
		if (USE_MOCK) {
			await delay(50)
			return coursesStorage.find((c) => c.id === id)
		}
		const res = await api.get<Course>(`/courses/${id}`)
		return res.data
	},

	async startLive(courseId: string): Promise<LiveSession> {
		if (USE_MOCK) {
			await delay(100)
			const session: LiveSession = {
				id: nowId('live'),
				courseId,
				startAt: new Date().toISOString(),
				status: 'live'
			}
			liveSessions.push(session)
			return session
		}
		try {
			const res = await api.post<LiveSession>(`/courses/${courseId}/live/start`)
			return res.data
		} catch (err) {
			console.warn('startLive API 调用失败，回退到 mock 模式', err)
			// 如果 API 调用失败，回退到 mock 实现
			await delay(100)
			const session: LiveSession = {
				id: nowId('live'),
				courseId,
				startAt: new Date().toISOString(),
				status: 'live'
			}
			liveSessions.push(session)
			return session
		}
	},

	async endLive(liveId: string): Promise<{ session: LiveSession; recording: Awaited<ReturnType<typeof recordingsService.createFromLive>> }> {
		if (USE_MOCK) {
			await delay(100)
			const idx = liveSessions.findIndex((s) => s.id === liveId)
			if (idx === -1) throw new Error('live session not found')
			const session = liveSessions[idx]
			session.status = 'ended'
			session.endAt = new Date().toISOString()
			const recording = await recordingsService.createFromLive(session)
			return { session, recording }
		}
		try {
			const res = await api.post<{ session: LiveSession; recording: any }>(`/live/${liveId}/stop`)
			return res.data
		} catch (err) {
			console.warn('endLive API 调用失败，回退到 mock 模式', err)
			// 如果 API 调用失败，回退到 mock 实现
			await delay(100)
			const idx = liveSessions.findIndex((s) => s.id === liveId)
			if (idx === -1) throw new Error('live session not found')
			const session = liveSessions[idx]
			session.status = 'ended'
			session.endAt = new Date().toISOString()
			const recording = await recordingsService.createFromLive(session)
			return { session, recording }
		}
	},

	async getLive(liveId: string): Promise<LiveSession | undefined> {
		if (USE_MOCK) {
			await delay(50)
			return liveSessions.find((s) => s.id === liveId)
		}
		try {
			const res = await api.get<LiveSession>(`/live/${liveId}`)
			return res.data
		} catch (err) {
			console.warn('getLive API 调用失败，回退到 mock 模式', err)
			// 如果 API 调用失败，回退到 mock 实现
			await delay(50)
			return liveSessions.find((s) => s.id === liveId)
		}
	}
}

export default coursesService
