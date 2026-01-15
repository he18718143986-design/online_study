/**
 * useRouteId - 统一的路由参数获取 Hook
 * 
 * 用于从路由中获取 ID 参数，遵循以下优先级：
 * 1. URL 路径参数（params）- 最高优先级
 * 2. URL 查询参数（searchParams）- 次优先级
 * 3. 传入的 fallback 值 - 最低优先级
 * 
 * @example
 * // 在页面组件中使用
 * const { courseId, isFromParams } = useRouteId('courseId', 'course-default')
 * 
 * @example
 * // 获取多个参数
 * const courseId = useRouteId('courseId')
 * const recordingId = useRouteId('recordingId')
 */
import { useParams, useSearchParams } from 'react-router-dom'
import React from 'react'

export interface UseRouteIdOptions {
	/** 是否在获取到 ID 后清除查询参数（避免 URL 冗余） */
	clearQueryOnParam?: boolean
}

export interface UseRouteIdResult {
	/** 解析得到的 ID 值 */
	id: string | undefined
	/** ID 是否来自路径参数 */
	isFromParams: boolean
	/** ID 是否来自查询参数 */
	isFromQuery: boolean
	/** ID 是否来自 fallback */
	isFromFallback: boolean
	/** ID 来源描述 */
	source: 'params' | 'query' | 'fallback' | 'none'
}

/**
 * 从路由中获取指定的 ID 参数
 * 
 * 优先级：路径参数 > 查询参数 > fallback
 * 
 * @param paramName - 参数名称（如 'courseId', 'recordingId'）
 * @param fallback - 可选的默认值
 * @param options - 可选配置
 * @returns 包含 ID 和来源信息的对象
 */
export function useRouteId(
	paramName: string,
	fallback?: string,
	options?: UseRouteIdOptions
): UseRouteIdResult {
	const params = useParams()
	const [searchParams] = useSearchParams()

	return React.useMemo(() => {
		// 1. 优先从路径参数获取
		const fromParams = (params as Record<string, string | undefined>)[paramName]?.trim()
		if (fromParams) {
			return {
				id: fromParams,
				isFromParams: true,
				isFromQuery: false,
				isFromFallback: false,
				source: 'params' as const
			}
		}

		// 2. 其次从查询参数获取
		const fromQuery = searchParams.get(paramName)?.trim()
		if (fromQuery) {
			return {
				id: fromQuery,
				isFromParams: false,
				isFromQuery: true,
				isFromFallback: false,
				source: 'query' as const
			}
		}

		// 3. 最后使用 fallback
		if (fallback) {
			return {
				id: fallback,
				isFromParams: false,
				isFromQuery: false,
				isFromFallback: true,
				source: 'fallback' as const
			}
		}

		// 4. 无可用值
		return {
			id: undefined,
			isFromParams: false,
			isFromQuery: false,
			isFromFallback: false,
			source: 'none' as const
		}
	}, [params, searchParams, paramName, fallback])
}

/**
 * 简化版：直接返回 ID 字符串
 * 
 * @param paramName - 参数名称
 * @param fallback - 可选的默认值
 * @returns ID 字符串或 undefined
 */
export function useRouteIdValue(paramName: string, fallback?: string): string | undefined {
	const { id } = useRouteId(paramName, fallback)
	return id
}

/**
 * 获取 courseId 的便捷 Hook
 * 
 * @param fallback - 默认课程 ID
 * @returns courseId 相关信息
 */
export function useCourseId(fallback?: string): UseRouteIdResult {
	return useRouteId('courseId', fallback)
}

/**
 * 获取 recordingId 的便捷 Hook
 * 
 * @param fallback - 默认录播 ID
 * @returns recordingId 相关信息
 */
export function useRecordingId(fallback?: string): UseRouteIdResult {
	return useRouteId('recordingId', fallback)
}

/**
 * 获取 assignmentId 的便捷 Hook
 * 
 * @param fallback - 默认作业 ID
 * @returns assignmentId 相关信息
 */
export function useAssignmentId(fallback?: string): UseRouteIdResult {
	return useRouteId('assignmentId', fallback)
}

/**
 * 获取 studentId 的便捷 Hook
 * 
 * @param fallback - 默认学生 ID
 * @returns studentId 相关信息
 */
export function useStudentId(fallback?: string): UseRouteIdResult {
	return useRouteId('studentId', fallback)
}

/**
 * 获取 examId 的便捷 Hook
 * 
 * @param fallback - 默认考试 ID
 * @returns examId 相关信息
 */
export function useExamId(fallback?: string): UseRouteIdResult {
	return useRouteId('examId', fallback)
}

export default useRouteId
