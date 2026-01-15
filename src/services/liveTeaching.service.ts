import api from './apiClient'

// 默认在开发环境使用 mock，除非明确设置为 false
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false' && (import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === 'true')

const STORAGE_KEY = 'mock.liveTeaching.events'

type LiveTeachingEventType = 'share_screen' | 'insert_question' | 'open_chat' | 'toggle_recording'

export type LiveTeachingEvent = {
	id: string
	type: LiveTeachingEventType
	ts: string
	courseId: string
	sessionId: string
	payload?: Record<string, unknown>
}

function nowId(prefix = 'evt') {
	return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function loadEvents(): LiveTeachingEvent[] {
	if (typeof window === 'undefined') return []
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY)
		if (!raw) return []
		const parsed = JSON.parse(raw)
		return Array.isArray(parsed) ? (parsed as LiveTeachingEvent[]) : []
	} catch {
		return []
	}
}

function persistEvents(events: LiveTeachingEvent[]) {
	if (typeof window === 'undefined') return
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
	} catch {
		// ignore
	}
}

async function recordMockEvent(event: Omit<LiveTeachingEvent, 'id' | 'ts'>) {
	const events = loadEvents()
	events.unshift({ ...event, id: nowId(), ts: new Date().toISOString() })
	persistEvents(events)
}

export const liveTeachingService = {
	async shareScreen(input: { courseId: string; sessionId: string }) {
		if (USE_MOCK) {
			await recordMockEvent({ type: 'share_screen', ...input })
			return
		}
		try {
			await api.post(`/live/${encodeURIComponent(input.sessionId)}/share-screen`, { courseId: input.courseId })
		} catch (err) {
			console.warn('shareScreen API 调用失败，回退到 mock 模式', err)
			await recordMockEvent({ type: 'share_screen', ...input })
		}
	},

	async insertQuestion(input: { courseId: string; sessionId: string }) {
		if (USE_MOCK) {
			await recordMockEvent({ type: 'insert_question', ...input })
			return
		}
		try {
			await api.post(`/live/${encodeURIComponent(input.sessionId)}/insert-question`, { courseId: input.courseId })
		} catch (err) {
			console.warn('insertQuestion API 调用失败，回退到 mock 模式', err)
			await recordMockEvent({ type: 'insert_question', ...input })
		}
	},

	async openChat(input: { courseId: string; sessionId: string }) {
		if (USE_MOCK) {
			await recordMockEvent({ type: 'open_chat', ...input })
			return
		}
		try {
			await api.post(`/live/${encodeURIComponent(input.sessionId)}/open-chat`, { courseId: input.courseId })
		} catch (err) {
			console.warn('openChat API 调用失败，回退到 mock 模式', err)
			await recordMockEvent({ type: 'open_chat', ...input })
		}
	},

	async toggleRecording(input: { courseId: string; sessionId: string; active: boolean }) {
		if (USE_MOCK) {
			await recordMockEvent({ type: 'toggle_recording', ...input, payload: { active: input.active } })
			return
		}
		try {
			await api.post(`/live/${encodeURIComponent(input.sessionId)}/recording`, { courseId: input.courseId, active: input.active })
		} catch (err) {
			console.warn('toggleRecording API 调用失败，回退到 mock 模式', err)
			await recordMockEvent({ type: 'toggle_recording', ...input, payload: { active: input.active } })
		}
	}
}

export default liveTeachingService
