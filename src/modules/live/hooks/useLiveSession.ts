// 来源 HTML: screen_id: live_teaching_room
import React from 'react'
import coursesService, { type LiveSession as ServiceLiveSession } from '@/services/courses.service'

export type LiveStatus = 'idle' | 'live' | 'ended'

export interface LiveSession {
	id: string
	courseId: string
	status: LiveStatus
	startedAt?: string
	recordingId?: string
}

export interface UseLiveSessionResult {
	session: LiveSession
	status: LiveStatus
	start: (courseId: string) => Promise<LiveSession>
	end: (sessionId: string) => Promise<string>
}

// TODO: integrate real WebRTC / RTMP SDK session start
// TODO: upload recording to media service after end
export function useLiveSession(initialCourseId?: string): UseLiveSessionResult {
	const [session, setSession] = React.useState<LiveSession>({
		id: '',
		courseId: initialCourseId || '',
		status: 'idle'
	})

	const status = session.status

	const start = React.useCallback(async (courseId: string): Promise<LiveSession> => {
		try {
			const started = await coursesService.startLive(courseId)
			const newSession: LiveSession = {
				id: started.id,
				courseId: started.courseId,
				status: 'live',
				startedAt: (started as ServiceLiveSession).startAt
			}
			setSession(newSession)
			return newSession
		} catch (error) {
			console.error('启动直播失败:', error)
			throw error
		}
	}, [])

	const end = React.useCallback(async (sessionId: string): Promise<string> => {
		try {
			const { session: ended, recording } = await coursesService.endLive(sessionId)
			setSession((prev) => ({
				...prev,
				id: ended.id,
				courseId: ended.courseId,
				status: 'ended',
				recordingId: recording.id
			}))
			return recording.id
		} catch (error) {
			console.error('结束直播失败:', error)
			throw error
		}
	}, [])

	return { session, status, start, end }
}

export default useLiveSession
