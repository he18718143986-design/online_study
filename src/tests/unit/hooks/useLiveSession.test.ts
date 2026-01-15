/**
 * useLiveSession hook 单元测试
 * 测试直播会话管理逻辑
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import useLiveSession from '@/modules/live/hooks/useLiveSession'

// Mock coursesService
vi.mock('@/services/courses.service', () => ({
	default: {
		startLive: vi.fn(),
		endLive: vi.fn()
	}
}))

import coursesService from '@/services/courses.service'

describe('useLiveSession', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.resetAllMocks()
	})

	describe('初始化', () => {
		it('应该使用传入的 courseId 初始化 session', () => {
			const { result } = renderHook(() => useLiveSession('test-course-123'))

			expect(result.current.session.courseId).toBe('test-course-123')
			expect(result.current.session.status).toBe('idle')
			expect(result.current.status).toBe('idle')
		})

		it('没有传入 courseId 时应使用空字符串', () => {
			const { result } = renderHook(() => useLiveSession())

			expect(result.current.session.courseId).toBe('')
			expect(result.current.status).toBe('idle')
		})

		it('传入 undefined 时应使用空字符串', () => {
			const { result } = renderHook(() => useLiveSession(undefined))

			expect(result.current.session.courseId).toBe('')
		})
	})

	describe('start 方法', () => {
		it('应该调用 coursesService.startLive 并更新 session 状态', async () => {
			const mockSession = {
				id: 'live-session-1',
				courseId: 'course-123',
				startAt: '2026-01-15T10:00:00Z',
				status: 'live' as const
			}

			vi.mocked(coursesService.startLive).mockResolvedValue(mockSession)

			const { result } = renderHook(() => useLiveSession('course-123'))

			await act(async () => {
				await result.current.start('course-123')
			})

			expect(coursesService.startLive).toHaveBeenCalledWith('course-123')
			expect(result.current.session.id).toBe('live-session-1')
			expect(result.current.session.status).toBe('live')
			expect(result.current.status).toBe('live')
		})

		it('start 失败时应抛出错误', async () => {
			const mockError = new Error('启动直播失败')
			vi.mocked(coursesService.startLive).mockRejectedValue(mockError)

			const { result } = renderHook(() => useLiveSession('course-123'))

			await expect(
				act(async () => {
					await result.current.start('course-123')
				})
			).rejects.toThrow('启动直播失败')

			// 状态应保持 idle
			expect(result.current.status).toBe('idle')
		})
	})

	describe('end 方法', () => {
		it('应该调用 coursesService.endLive 并更新 session 状态为 ended', async () => {
			const mockStartSession = {
				id: 'live-session-1',
				courseId: 'course-123',
				startAt: '2026-01-15T10:00:00Z',
				status: 'live' as const
			}

		const mockEndResult = {
			session: {
				id: 'live-session-1',
				courseId: 'course-123',
				startAt: '2026-01-15T10:00:00Z',
				endAt: '2026-01-15T11:30:00Z',
				status: 'ended' as const
			},
			recording: {
				id: 'recording-001',
				courseId: 'course-123',
				title: '录播',
				duration: '01:30:00',
				date: '2026-01-15',
				status: 'processing' as const
			}
		}

			vi.mocked(coursesService.startLive).mockResolvedValue(mockStartSession)
			vi.mocked(coursesService.endLive).mockResolvedValue(mockEndResult)

			const { result } = renderHook(() => useLiveSession('course-123'))

			// 先启动直播
			await act(async () => {
				await result.current.start('course-123')
			})

			expect(result.current.session.id).toBe('live-session-1')

			// 结束直播
			let recordingId: string | undefined
			await act(async () => {
				recordingId = await result.current.end('live-session-1')
			})

			expect(coursesService.endLive).toHaveBeenCalledWith('live-session-1')
			expect(result.current.session.status).toBe('ended')
			expect(result.current.session.recordingId).toBe('recording-001')
			expect(recordingId).toBe('recording-001')
		})

		it('end 失败时应抛出错误', async () => {
			const mockError = new Error('结束直播失败')
			vi.mocked(coursesService.endLive).mockRejectedValue(mockError)

			const { result } = renderHook(() => useLiveSession('course-123'))

			await expect(
				act(async () => {
					await result.current.end('non-existent-session')
				})
			).rejects.toThrow('结束直播失败')
		})
	})

	describe('courseId 来源优先级测试', () => {
		/**
		 * 测试 LiveTeachingRoutePage 中的 courseId 解析优先级：
		 * 1. URL 路径参数 /live/:courseId
		 * 2. 查询参数 ?courseId=xxx
		 * 3. 默认值 'course-live-1'
		 */
		it('应该正确初始化为传入的 courseId（模拟从 URL 路径参数获取）', () => {
			// 模拟 URL 路径参数场景：/live/my-course-id
			const courseIdFromPath = 'my-course-id'
			const { result } = renderHook(() => useLiveSession(courseIdFromPath))

			expect(result.current.session.courseId).toBe('my-course-id')
		})

		it('应该能够使用任意 courseId 启动直播', async () => {
			const mockSession = {
				id: 'live-new',
				courseId: 'custom-course',
				startAt: new Date().toISOString(),
				status: 'live' as const
			}

			vi.mocked(coursesService.startLive).mockResolvedValue(mockSession)

			const { result } = renderHook(() => useLiveSession('custom-course'))

			await act(async () => {
				await result.current.start('custom-course')
			})

			expect(coursesService.startLive).toHaveBeenCalledWith('custom-course')
			expect(result.current.session.courseId).toBe('custom-course')
		})
	})
})
