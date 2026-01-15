/**
 * Questions/Problems service
 * - Manages question bank operations
 * - Supports CRUD, filtering, and batch operations
 */

import api from './apiClient'
import mockDataJson from '@/data/mock/data.json'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export type QuestionType = 'subjective' | 'single_choice' | 'multiple_choice' | 'fill_blank'
export type QuestionDifficulty = 'easy' | 'medium' | 'hard'
export type QuestionStatus = 'draft' | 'published' | 'archived' | 'pending_review'

export interface QuestionChoice {
	id: string
	label: string
	content_html: string
}

export interface QuestionAttachment {
	id: string
	url: string
	mimeType: string
	title: string
}

export interface Question {
	id: string
	title: string
	stem_html: string
	stem_latex?: string | null
	type: QuestionType
	difficulty: QuestionDifficulty
	tags: string[]
	knowledge_points: string[]
	attachments: QuestionAttachment[]
	choices: QuestionChoice[]
	solution_html?: string | null
	solution_latex?: string | null
	hints: string[]
	author_id: string
	version: number
	status: QuestionStatus
	review?: { reviewer_id: string; comment: string; status: 'approved' | 'rejected' } | null
	created_at: string
	updated_at: string
	meta?: { estimated_minutes?: number; tags_count?: number }
}

export interface QuestionFilters {
	knowledgePoint?: string
	type?: QuestionType
	difficulty?: QuestionDifficulty
	status?: QuestionStatus
	search?: string
}

type MockData = {
	problems?: Question[]
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const dataset = (mockDataJson as unknown) as MockData
const questionsStorage: Question[] = [...(dataset.problems ?? [])]

const STORAGE_KEY = 'mock.questions'

function loadStorage(): Question[] {
	if (typeof window === 'undefined') return [...(dataset.problems ?? [])]
	try {
		const cached = window.localStorage.getItem(STORAGE_KEY)
		if (cached) {
			const parsed = JSON.parse(cached)
			if (Array.isArray(parsed)) return parsed
		}
	} catch (err) {
		console.warn('questions load failed, fallback to seed', err)
	}
	return [...(dataset.problems ?? [])]
}

function persistStorage(questions: Question[]) {
	if (typeof window === 'undefined') return
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(questions))
	} catch (err) {
		console.warn('questions persist failed', err)
	}
}

function nowId(prefix = 'q') {
	return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export const questionsService = {
	async list(filters?: QuestionFilters): Promise<Question[]> {
		if (USE_MOCK) {
			await delay(50)
			let result = loadStorage()

			if (filters?.knowledgePoint) {
				result = result.filter((q) => q.knowledge_points.includes(filters.knowledgePoint!))
			}
			if (filters?.type) {
				result = result.filter((q) => q.type === filters.type)
			}
			if (filters?.difficulty) {
				result = result.filter((q) => q.difficulty === filters.difficulty)
			}
			if (filters?.status) {
				result = result.filter((q) => q.status === filters.status)
			}
			if (filters?.search) {
				const term = filters.search.toLowerCase()
				result = result.filter(
					(q) =>
						q.title.toLowerCase().includes(term) ||
						q.tags.some((t) => t.toLowerCase().includes(term))
				)
			}

			return result
		}

		const res = await api.get<Question[]>('/problems', { params: filters })
		return res.data
	},

	async get(id: string): Promise<Question | undefined> {
		if (USE_MOCK) {
			await delay(30)
			const storage = loadStorage()
			return storage.find((q) => q.id === id)
		}

		const res = await api.get<Question>(`/problems/${id}`)
		return res.data
	},

	async create(payload: Partial<Question> & { title: string; stem_html: string }): Promise<Question> {
		if (USE_MOCK) {
			await delay(100)
			const storage = loadStorage()

			const newQuestion: Question = {
				id: payload.id ?? nowId('q'),
				title: payload.title,
				stem_html: payload.stem_html,
				stem_latex: payload.stem_latex ?? null,
				type: payload.type ?? 'subjective',
				difficulty: payload.difficulty ?? 'medium',
				tags: payload.tags ?? [],
				knowledge_points: payload.knowledge_points ?? [],
				attachments: payload.attachments ?? [],
				choices: payload.choices ?? [],
				solution_html: payload.solution_html ?? null,
				solution_latex: payload.solution_latex ?? null,
				hints: payload.hints ?? [],
				author_id: payload.author_id ?? 'u1',
				version: 1,
				status: payload.status ?? 'draft',
				review: null,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				meta: payload.meta ?? { estimated_minutes: 10, tags_count: payload.tags?.length ?? 0 }
			}

			storage.unshift(newQuestion)
			persistStorage(storage)

			return newQuestion
		}

		const res = await api.post<Question>('/problems', payload)
		return res.data
	},

	async update(id: string, payload: Partial<Question>): Promise<Question> {
		if (USE_MOCK) {
			await delay(50)
			const storage = loadStorage()
			const idx = storage.findIndex((q) => q.id === id)
			if (idx === -1) throw new Error('Question not found')

			storage[idx] = {
				...storage[idx],
				...payload,
				version: storage[idx].version + 1,
				updated_at: new Date().toISOString()
			}

			persistStorage(storage)
			return storage[idx]
		}

		const res = await api.put<Question>(`/problems/${id}`, payload)
		return res.data
	},

	async remove(id: string): Promise<boolean> {
		if (USE_MOCK) {
			await delay(30)
			const storage = loadStorage()
			const idx = storage.findIndex((q) => q.id === id)
			if (idx !== -1) {
				storage.splice(idx, 1)
				persistStorage(storage)
			}
			return true
		}

		await api.delete(`/problems/${id}`)
		return true
	},

	async submitForReview(id: string): Promise<Question> {
		if (USE_MOCK) {
			await delay(100)
			const storage = loadStorage()
			const idx = storage.findIndex((q) => q.id === id)
			if (idx === -1) throw new Error('Question not found')

			storage[idx] = {
				...storage[idx],
				status: 'pending_review',
				updated_at: new Date().toISOString()
			}

			persistStorage(storage)
			return storage[idx]
		}

		const res = await api.post<Question>(`/problems/${id}/submit-review`)
		return res.data
	},

	async batchImport(file: File): Promise<{ imported: number; errors: string[] }> {
		if (USE_MOCK) {
			await delay(2000)
			// Simulate import
			return { imported: 5, errors: [] }
		}

		const formData = new FormData()
		formData.append('file', file)
		const res = await api.post<{ imported: number; errors: string[] }>('/problems/batch-import', formData)
		return res.data
	}
}

export default questionsService
