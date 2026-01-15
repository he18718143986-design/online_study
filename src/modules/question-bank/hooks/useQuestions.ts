// 来源 HTML: online_study/题库与试题管理
import React from 'react'
import type { Question, QuestionStatus } from '@/types/models/question'

export interface QuestionFilters {
	query?: string
	knowledgePoint?: string
	difficulty?: number
	type?: string
	status?: QuestionStatus
}

export interface UseQuestionsResult {
	questions: Question[]
	isLoading: boolean
	error?: Error
	filters: QuestionFilters
	setFilters: (next: Partial<QuestionFilters>) => void
	getQuestion: (id: string) => Question | undefined
	createQuestion: (payload: Partial<Question> & { title: string; content: string }) => Promise<Question>
	updateQuestion: (id: string, updates: Partial<Question>) => Promise<Question | undefined>
	refetch: () => Promise<void>
}

const mockQuestions: Question[] = [
	{
		id: 'q-842',
		title: '证明对于任意正整数 n，表达式 n^3 - n 能被 6 整除',
		content: '证明对于任意正整数 n，表达式 $n^3 - n$ 能被 6 整除。',
		knowledgePoints: ['数论'],
		difficulty: 3,
		type: '证明题',
		status: 'review',
		author: '张志强',
		updatedAt: '10:42'
	},
	{
		id: 'q-841',
		title: '求解不等式 |2x - 1| < 5 的解集',
		content: '求解不等式 |2x - 1| < 5 的解集。',
		knowledgePoints: ['代数'],
		difficulty: 2,
		type: '计算题',
		status: 'draft',
		author: '李明',
		updatedAt: '昨天'
	},
	{
		id: 'q-839',
		title: '函数 f(x) = x^2 + ax + b 的零点分析',
		content: '已知函数 f(x) = x^2 + ax + b，若 f(1) = 0...',
		knowledgePoints: ['函数'],
		difficulty: 3,
		type: '选择题',
		status: 'published',
		author: '王芳',
		updatedAt: '本周'
	}
]

export function useQuestions(initialFilters: QuestionFilters = {}): UseQuestionsResult {
	const [rawQuestions, setRawQuestions] = React.useState<Question[]>(mockQuestions)
	const [filters, setFiltersState] = React.useState<QuestionFilters>(initialFilters)
	const [isLoading, setIsLoading] = React.useState(false)
	const [error, setError] = React.useState<Error | undefined>(undefined)

	const refetch = React.useCallback(async () => {
		setIsLoading(true)
		setError(undefined)
		await new Promise((resolve) => setTimeout(resolve, 120))
		setIsLoading(false)
	}, [])

	const filtered = React.useMemo(() => {
		return rawQuestions.filter((q) => {
			if (filters.status && q.status !== filters.status) return false
			if (filters.knowledgePoint && !q.knowledgePoints?.includes(filters.knowledgePoint)) return false
			if (filters.type && q.type !== filters.type) return false
			if (typeof filters.difficulty === 'number' && q.difficulty !== filters.difficulty) return false
			if (filters.query && !q.title.toLowerCase().includes(filters.query.toLowerCase())) return false
			return true
		})
	}, [filters, rawQuestions])

	const getQuestion = React.useCallback(
		(id: string) => rawQuestions.find((q) => q.id === id),
		[rawQuestions]
	)

	const createQuestion = React.useCallback(async (payload: Partial<Question> & { title: string; content: string }) => {
		const next: Question = {
			id: payload.id ?? `q-${Date.now()}`,
			title: payload.title,
			content: payload.content,
			knowledgePoints: payload.knowledgePoints ?? [],
			difficulty: (payload.difficulty as Question['difficulty']) ?? 3,
			type: payload.type ?? '未分类',
			status: payload.status ?? 'draft',
			author: payload.author,
			updatedAt: payload.updatedAt ?? '刚刚'
		}
		setRawQuestions((prev) => [next, ...prev])
		return next
	}, [])

	const updateQuestion = React.useCallback(async (id: string, updates: Partial<Question>) => {
		let updated: Question | undefined
		setRawQuestions((prev) =>
			prev.map((q) => {
				if (q.id === id) {
					updated = { ...q, ...updates }
					return updated
				}
				return q
			})
		)
		return updated
	}, [])

	return {
		questions: filtered,
		isLoading,
		error,
		filters,
		setFilters: (next) => setFiltersState((prev) => ({ ...prev, ...next })),
		getQuestion,
		createQuestion,
		updateQuestion,
		refetch
	}
}

export default useQuestions
