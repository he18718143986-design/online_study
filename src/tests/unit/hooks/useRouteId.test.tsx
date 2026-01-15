/**
 * useRouteId Hook 单元测试
 * 
 * 测试路由参数获取的优先级：
 * 1. 路径参数（params）
 * 2. 查询参数（query）
 * 3. fallback 值
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import React from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import { useRouteId, useCourseId, useRecordingId, useAssignmentId } from '@/hooks/useRouteId'

// 创建测试用的 Router wrapper
function createTestRouter(initialPath: string, TestComponent: React.ComponentType) {
	const router = createMemoryRouter(
		[
			{ path: '/test/:paramId', element: <TestComponent /> },
			{ path: '/courses/:courseId', element: <TestComponent /> },
			{ path: '/recordings/:recordingId', element: <TestComponent /> },
			{ path: '/assignments/:assignmentId', element: <TestComponent /> },
			{ path: '/test', element: <TestComponent /> },
			{ path: '*', element: <TestComponent /> }
		],
		{ initialEntries: [initialPath] }
	)
	return router
}

// 包装组件用于测试
function createWrapper(initialPath: string) {
	return function Wrapper({ children }: { children: React.ReactNode }) {
		const router = createMemoryRouter(
			[
				{ path: '/test/:paramId', element: <>{children}</> },
				{ path: '/courses/:courseId', element: <>{children}</> },
				{ path: '/recordings/:recordingId', element: <>{children}</> },
				{ path: '/assignments/:assignmentId', element: <>{children}</> },
				{ path: '/test', element: <>{children}</> },
				{ path: '*', element: <>{children}</> }
			],
			{ initialEntries: [initialPath] }
		)
		return <RouterProvider router={router} />
	}
}

describe('useRouteId', () => {
	describe('优先级测试', () => {
		it('应该优先使用路径参数', () => {
			const { result } = renderHook(
				() => useRouteId('paramId', 'fallback-value'),
				{ wrapper: createWrapper('/test/path-value?paramId=query-value') }
			)

			expect(result.current.id).toBe('path-value')
			expect(result.current.source).toBe('params')
			expect(result.current.isFromParams).toBe(true)
			expect(result.current.isFromQuery).toBe(false)
			expect(result.current.isFromFallback).toBe(false)
		})

		it('路径参数不存在时应使用查询参数', () => {
			const { result } = renderHook(
				() => useRouteId('paramId', 'fallback-value'),
				{ wrapper: createWrapper('/test?paramId=query-value') }
			)

			expect(result.current.id).toBe('query-value')
			expect(result.current.source).toBe('query')
			expect(result.current.isFromParams).toBe(false)
			expect(result.current.isFromQuery).toBe(true)
			expect(result.current.isFromFallback).toBe(false)
		})

		it('路径和查询参数都不存在时应使用 fallback', () => {
			const { result } = renderHook(
				() => useRouteId('paramId', 'fallback-value'),
				{ wrapper: createWrapper('/test') }
			)

			expect(result.current.id).toBe('fallback-value')
			expect(result.current.source).toBe('fallback')
			expect(result.current.isFromParams).toBe(false)
			expect(result.current.isFromQuery).toBe(false)
			expect(result.current.isFromFallback).toBe(true)
		})

		it('无任何值时应返回 undefined', () => {
			const { result } = renderHook(
				() => useRouteId('paramId'),
				{ wrapper: createWrapper('/test') }
			)

			expect(result.current.id).toBeUndefined()
			expect(result.current.source).toBe('none')
			expect(result.current.isFromParams).toBe(false)
			expect(result.current.isFromQuery).toBe(false)
			expect(result.current.isFromFallback).toBe(false)
		})
	})

	describe('空值处理', () => {
		it('应该忽略空字符串查询参数', () => {
			const { result } = renderHook(
				() => useRouteId('paramId', 'fallback'),
				{ wrapper: createWrapper('/test?paramId=') }
			)

			expect(result.current.id).toBe('fallback')
			expect(result.current.source).toBe('fallback')
		})

		it('应该 trim 空白字符', () => {
			const { result } = renderHook(
				() => useRouteId('paramId'),
				{ wrapper: createWrapper('/test?paramId=  value-with-spaces  ') }
			)

			expect(result.current.id).toBe('value-with-spaces')
		})
	})
})

describe('useCourseId', () => {
	it('应该正确解析 courseId 路径参数', () => {
		const { result } = renderHook(
			() => useCourseId(),
			{ wrapper: createWrapper('/courses/course-001') }
		)

		expect(result.current.id).toBe('course-001')
		expect(result.current.source).toBe('params')
	})

	it('应该正确解析 courseId 查询参数', () => {
		const { result } = renderHook(
			() => useCourseId(),
			{ wrapper: createWrapper('/test?courseId=course-002') }
		)

		expect(result.current.id).toBe('course-002')
		expect(result.current.source).toBe('query')
	})

	it('应该使用 fallback 值', () => {
		const { result } = renderHook(
			() => useCourseId('default-course'),
			{ wrapper: createWrapper('/test') }
		)

		expect(result.current.id).toBe('default-course')
		expect(result.current.source).toBe('fallback')
	})
})

describe('useRecordingId', () => {
	it('应该正确解析 recordingId 路径参数', () => {
		const { result } = renderHook(
			() => useRecordingId(),
			{ wrapper: createWrapper('/recordings/rec-001') }
		)

		expect(result.current.id).toBe('rec-001')
		expect(result.current.source).toBe('params')
	})

	it('应该正确解析 recordingId 查询参数', () => {
		const { result } = renderHook(
			() => useRecordingId(),
			{ wrapper: createWrapper('/test?recordingId=rec-002') }
		)

		expect(result.current.id).toBe('rec-002')
		expect(result.current.source).toBe('query')
	})
})

describe('useAssignmentId', () => {
	it('应该正确解析 assignmentId 路径参数', () => {
		const { result } = renderHook(
			() => useAssignmentId(),
			{ wrapper: createWrapper('/assignments/assign-101') }
		)

		expect(result.current.id).toBe('assign-101')
		expect(result.current.source).toBe('params')
	})

	it('应该正确解析 assignmentId 查询参数', () => {
		const { result } = renderHook(
			() => useAssignmentId(),
			{ wrapper: createWrapper('/test?assignmentId=assign-102') }
		)

		expect(result.current.id).toBe('assign-102')
		expect(result.current.source).toBe('query')
	})
})
