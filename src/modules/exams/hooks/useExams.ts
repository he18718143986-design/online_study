// 来源 HTML: online_study/考试管理
import React from 'react'
import type { Exam, ExamStatus } from '@/types/models/exam'

export interface ExamFilters {
	status?: ExamStatus
	classLabel?: string
	query?: string
}

export interface UseExamsResult {
	exams: Exam[]
	isLoading: boolean
	error?: Error
	filters: ExamFilters
	setFilters: (next: Partial<ExamFilters>) => void
	createExam: (payload: Partial<Exam> & { title: string }) => Promise<Exam>
	updateExam: (id: string, updates: Partial<Exam>) => Promise<Exam | undefined>
	refetch: () => Promise<void>
}

const mockExams: Exam[] = [
	{
		id: 'exam-1',
		title: '2023秋季高二奥数模拟考 (三)',
		status: 'ongoing',
		classLabel: '高二(3)班',
		startAt: '2023-10-24T14:00:00',
		durationMinutes: 120,
		proctor: '李老师',
		token: 'A8F-9K2',
		participants: { current: 42, total: 45 }
	},
	{
		id: 'exam-2',
		title: '2023函数与导数专题测试',
		status: 'review',
		classLabel: '高三(1)班',
		endAt: '2023-10-23T16:30:00',
		durationMinutes: 90,
		note: '客观题评分完成 95%'
	},
	{
		id: 'exam-3',
		title: '高一上学期第一次月考',
		status: 'scheduled',
		classLabel: '高一年级',
		startAt: '2023-10-28T09:00:00',
		durationMinutes: 90
	}
]

export function useExams(initialFilters: ExamFilters = {}): UseExamsResult {
	const [rawExams, setRawExams] = React.useState<Exam[]>(mockExams)
	const [filters, setFiltersState] = React.useState<ExamFilters>(initialFilters)
	const [isLoading, setIsLoading] = React.useState(false)
	const [error, setError] = React.useState<Error | undefined>(undefined)

	const refetch = React.useCallback(async () => {
		setIsLoading(true)
		setError(undefined)
		await new Promise((resolve) => setTimeout(resolve, 120))
		setIsLoading(false)
	}, [])

	const filtered = React.useMemo(() => {
		return rawExams.filter((exam) => {
			if (filters.status && exam.status !== filters.status) return false
			if (filters.classLabel && exam.classLabel !== filters.classLabel) return false
			if (filters.query && !exam.title.toLowerCase().includes(filters.query.toLowerCase())) return false
			return true
		})
	}, [filters, rawExams])

	const createExam = React.useCallback(async (payload: Partial<Exam> & { title: string }) => {
		const newExam: Exam = {
			id: payload.id ?? `exam-${Date.now()}`,
			title: payload.title,
			status: payload.status ?? 'draft',
			classLabel: payload.classLabel,
			startAt: payload.startAt,
			endAt: payload.endAt,
			durationMinutes: payload.durationMinutes,
			proctor: payload.proctor,
			token: payload.token,
			participants: payload.participants,
			note: payload.note
		}
		setRawExams((prev) => [newExam, ...prev])
		return newExam
	}, [])

	const updateExam = React.useCallback(async (id: string, updates: Partial<Exam>) => {
		let updated: Exam | undefined
		setRawExams((prev) =>
			prev.map((exam) => {
				if (exam.id === id) {
					updated = { ...exam, ...updates }
					return updated
				}
				return exam
			})
		)
		return updated
	}, [])

	return {
		exams: filtered,
		isLoading,
		error,
		filters,
		setFilters: (next) => setFiltersState((prev) => ({ ...prev, ...next })),
		createExam,
		updateExam,
		refetch
	}
}

export default useExams
