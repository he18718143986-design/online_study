// 来源 HTML: online_study/作业管理
import React from 'react'
import assignmentsService from '../../../services/assignments.service'
import type { Assignment, AssignmentStatus } from '@/types/models/assignment'

export interface AssignmentFilters {
	courseId?: string
	status?: AssignmentStatus
	dueBefore?: string
}

export interface AssignmentPagination {
	page: number
	pageSize: number
	total: number
}

export interface UseAssignmentsResult {
	assignments: Assignment[]
	isLoading: boolean
	error?: Error
	filters: AssignmentFilters
	setFilters: (next: Partial<AssignmentFilters>) => void
	pagination: AssignmentPagination
	setPage: (page: number) => void
	setPageSize: (size: number) => void
	createAssignment: (payload: Partial<Assignment> & { title: string }) => Promise<Assignment>
	updateAssignment: (id: string, updates: Partial<Assignment>) => Promise<Assignment | undefined>
	deleteAssignment: (id: string) => Promise<void>
	refetch: () => Promise<void>
}

const defaultPagination: AssignmentPagination = { page: 1, pageSize: 8, total: 0 }

export function useAssignments(initialFilters: AssignmentFilters = {}): UseAssignmentsResult {
	const [rawAssignments, setRawAssignments] = React.useState<Assignment[]>([])
	const [filters, setFiltersState] = React.useState<AssignmentFilters>(initialFilters)
	const [pagination, setPagination] = React.useState<AssignmentPagination>(defaultPagination)
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [error, setError] = React.useState<Error | undefined>(undefined)

	const refetch = React.useCallback(async () => {
		setIsLoading(true)
		setError(undefined)
		try {
			const list = await assignmentsService.list()
			setRawAssignments(list)
			setPagination((prev) => ({ ...prev, total: list.length }))
		} catch (err) {
			setError(err as Error)
		} finally {
			setIsLoading(false)
		}
	}, [])

	React.useEffect(() => {
		void refetch()
	}, [refetch])

	const filtered = React.useMemo(() => {
		return rawAssignments.filter((item) => {
			if (filters.courseId && item.courseId !== filters.courseId) return false
			if (filters.status && item.status !== filters.status) return false
			if (filters.dueBefore && item.dueAt && item.dueAt > filters.dueBefore) return false
			return true
		})
	}, [filters, rawAssignments])

	React.useEffect(() => {
		setPagination((prev) => ({ ...prev, total: filtered.length, page: Math.min(prev.page, Math.max(1, Math.ceil(filtered.length / prev.pageSize) || 1)) }))
	}, [filtered])

	const paginated = React.useMemo(() => {
		const start = (pagination.page - 1) * pagination.pageSize
		return filtered.slice(start, start + pagination.pageSize)
	}, [filtered, pagination.page, pagination.pageSize])

	const createAssignment = React.useCallback(async (payload: Partial<Assignment> & { title: string }) => {
		const created = await assignmentsService.create(payload)
		setRawAssignments((prev) => [created, ...prev.filter((a) => a.id !== created.id)])
		setPagination((prev) => ({ ...prev, total: prev.total + 1 }))
		return created
	}, [])

	const updateAssignment = React.useCallback(async (id: string, updates: Partial<Assignment>) => {
		const updated = await assignmentsService.update(id, updates)
		setRawAssignments((prev) => prev.map((item) => (item.id === id ? updated : item)))
		return updated
	}, [])

	const deleteAssignment = React.useCallback(async (id: string) => {
		await assignmentsService.remove(id)
		setRawAssignments((prev) => prev.filter((item) => item.id !== id))
		setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }))
	}, [])

	return {
		assignments: paginated,
		isLoading,
		error,
		filters,
		setFilters: (next) => setFiltersState((prev) => ({ ...prev, ...next })),
		pagination,
		setPage: (page) => setPagination((prev) => ({ ...prev, page })),
		setPageSize: (size) => setPagination((prev) => ({ ...prev, pageSize: size, page: 1 })),
		createAssignment,
		updateAssignment,
		deleteAssignment,
		refetch
	}
}

export default useAssignments
