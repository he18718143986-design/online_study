import React from 'react'
import type { Student } from '@/types/models/student'
import studentsService from '@/services/students.service'

export type ScoreFilter = 'all' | '90+' | '60-89' | '<60'
export type AttendanceFilter = 'all' | Student['attendance']

export interface StudentFilters {
	query: string
	grade: string
	className: string
	attendance: AttendanceFilter
	score: ScoreFilter
}

export interface StudentRecord extends Student {
	studentNumber: string
	grade: string
	className: string
	latestScore?: number
	attendanceRate?: number
	handle?: string
	trend?: 'up' | 'flat' | 'down'
}

export interface UseStudentsResult {
	data: StudentRecord[]
	isLoading: boolean
	filters: StudentFilters
	pagination: { page: number; pageSize: number; total: number }
	selectedIds: Set<string>
	actions: {
		setFilters: (next: Partial<StudentFilters>) => void
		resetFilters: () => void
		changePage: (page: number) => void
		setPageSize: (size: number) => void
		toggleSelect: (id: string) => void
		toggleSelectAll: (ids: string[], checked: boolean) => void
		clearSelection: () => void
		refetch: () => Promise<void>
		createStudent: (payload: Partial<Student> & { name: string }) => Promise<Student>
		updateStudent: (id: string, payload: Partial<Student>) => Promise<Student>
		removeStudent: (id: string) => Promise<void>
		bulkMessage: (ids: string[]) => Promise<void>
		bulkExport: (ids: string[]) => Promise<void>
		bulkGroup: (ids: string[]) => Promise<void>
		bulkMarkPresent: (ids: string[]) => Promise<void>
	}
}

const defaultFilters: StudentFilters = {
	query: '',
	grade: 'all',
	className: 'all',
	attendance: 'all',
	score: 'all'
}

const GRADES = ['高一', '高二', '高三'] as const
const CLASS_NAMES = ['高一 (1) 班', '高一 (2) 班', '高一 (3) 班', '高二 (1) 班', '高二 (2) 班'] as const

function hashToInt(input: string) {
	let hash = 0
	for (let i = 0; i < input.length; i += 1) {
		hash = (hash * 31 + input.charCodeAt(i)) >>> 0
	}
	return hash
}

function enrichStudent(student: Student): StudentRecord {
	const seed = hashToInt(student.id)
	const grade = (student.grade as any) ?? GRADES[seed % GRADES.length]
	const className = student.className ?? CLASS_NAMES[seed % CLASS_NAMES.length]
	const latestScore = 55 + (seed % 46) // 55..100
	const trend: StudentRecord['trend'] = latestScore >= 90 ? 'up' : latestScore < 60 ? 'down' : 'flat'
	const attendanceRateBase = student.attendance === 'present' ? 0.85 : 0.6
	const attendanceRate = Math.min(1, attendanceRateBase + ((seed % 15) / 100))
	return {
		...student,
		studentNumber: student.studentNumber ?? student.id,
		grade,
		className,
		latestScore,
		trend,
		attendanceRate,
		handle: `@${student.id}`
	}
}

export function useStudents(initialFilters: Partial<StudentFilters> = {}): UseStudentsResult {
	const [rawStudents, setRawStudents] = React.useState<StudentRecord[]>([])
	const [filters, setFiltersState] = React.useState<StudentFilters>({ ...defaultFilters, ...initialFilters })
	const [page, setPage] = React.useState(1)
	const [pageSize, setPageSize] = React.useState(10)
	const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
	const [isLoading, setIsLoading] = React.useState(false)

	const filtered = React.useMemo(() => {
		return rawStudents.filter((student) => {
			if (filters.grade !== 'all' && student.grade !== filters.grade) return false
			if (filters.className !== 'all' && student.className !== filters.className) return false
			if (filters.attendance !== 'all' && student.attendance !== filters.attendance) return false
			if (filters.score === '90+' && (student.latestScore ?? 0) < 90) return false
			if (filters.score === '60-89' && ((student.latestScore ?? 0) < 60 || (student.latestScore ?? 0) > 89)) return false
			if (filters.score === '<60' && (student.latestScore ?? 0) >= 60) return false
			if (filters.query) {
				const q = filters.query.toLowerCase()
				if (
					!student.name.toLowerCase().includes(q) &&
					!student.studentNumber.toLowerCase().includes(q) &&
					!(student.handle ?? '').toLowerCase().includes(q)
				) {
					return false
				}
			}
			return true
		})
	}, [filters, rawStudents])

	const total = filtered.length
	const totalPages = Math.max(1, Math.ceil(total / pageSize))
	const currentPage = Math.min(page, totalPages)
	const paginated = React.useMemo(() => {
		const start = (currentPage - 1) * pageSize
		return filtered.slice(start, start + pageSize)
	}, [currentPage, filtered, pageSize])

	const toggleSelect = React.useCallback((id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev)
			if (next.has(id)) {
				next.delete(id)
			} else {
				next.add(id)
			}
			return next
		})
	}, [])

	const toggleSelectAll = React.useCallback((ids: string[], checked: boolean) => {
		setSelectedIds((prev) => {
			const next = new Set(prev)
			ids.forEach((id) => {
				if (checked) {
					next.add(id)
				} else {
					next.delete(id)
				}
			})
			return next
		})
	}, [])

	const clearSelection = React.useCallback(() => {
		setSelectedIds(new Set())
	}, [])

	const refetch = React.useCallback(async () => {
		setIsLoading(true)
		try {
			const list = await studentsService.list()
			setRawStudents(list.map(enrichStudent))
		} finally {
			setIsLoading(false)
		}
	}, [])

	React.useEffect(() => {
		void refetch()
	}, [refetch])

	const setFilters = React.useCallback((next: Partial<StudentFilters>) => {
		setFiltersState((prev) => ({ ...prev, ...next }))
		setPage(1)
	}, [])

	const resetFilters = React.useCallback(() => {
		setFiltersState(defaultFilters)
		setPage(1)
		clearSelection()
	}, [clearSelection])

	const changePage = React.useCallback((nextPage: number) => {
		setPage(Math.max(1, nextPage))
	}, [])

	const changePageSize = React.useCallback((size: number) => {
		setPageSize(Math.max(1, size))
		setPage(1)
	}, [])

	const createStudent = React.useCallback(
		async (payload: Partial<Student> & { name: string }) => {
			const created = await studentsService.create(payload)
			await refetch()
			setPage(1)
			return created
		},
		[refetch]
	)

	const updateStudent = React.useCallback(
		async (id: string, payload: Partial<Student>) => {
			const updated = await studentsService.update(id, payload)
			await refetch()
			return updated
		},
		[refetch]
	)

	const removeStudent = React.useCallback(
		async (id: string) => {
			await studentsService.remove(id)
			setSelectedIds((prev) => {
				if (!prev.has(id)) return prev
				const next = new Set(prev)
				next.delete(id)
				return next
			})
			await refetch()
		},
		[refetch]
	)

	const bulkMessage = React.useCallback(async (ids: string[]) => {
		const message = window.prompt('请输入要发送的消息', '同学们请按时完成作业～')
		if (message === null) return
		await studentsService.bulkMessage(ids, { message })
		window.alert(`已向 ${ids.length} 名学生发送消息`)
		clearSelection()
	}, [clearSelection])

	const bulkExport = React.useCallback(async (ids: string[]) => {
		const { filename, content } = await studentsService.exportCsv(ids)
		const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = filename
		a.style.display = 'none'
		document.body.appendChild(a)
		a.click()
		a.remove()
		URL.revokeObjectURL(url)
		window.alert(`已导出 ${ids.length} 名学生的 CSV`)
		clearSelection()
	}, [clearSelection])

	const bulkGroup = React.useCallback(async (ids: string[]) => {
		const group = window.prompt('请输入分组名称', '直播听课')
		if (group === null) return
		await studentsService.bulkGroup(ids, { group })
		await refetch()
		window.alert(`已将 ${ids.length} 名学生分到「${group}」`)
		clearSelection()
	}, [clearSelection, refetch])

	const bulkMarkPresent = React.useCallback(async (ids: string[]) => {
		await studentsService.bulkMarkPresent(ids)
		await refetch()
		clearSelection()
	}, [clearSelection, refetch])

	return {
		data: paginated,
		isLoading,
		filters,
		pagination: { page: currentPage, pageSize, total },
		selectedIds,
		actions: {
			setFilters,
			resetFilters,
			changePage,
			setPageSize: changePageSize,
			toggleSelect,
			toggleSelectAll,
			clearSelection,
			refetch,
			createStudent,
			updateStudent,
			removeStudent,
			bulkMessage,
			bulkExport,
			bulkGroup,
			bulkMarkPresent
		}
	}
}

export default useStudents
