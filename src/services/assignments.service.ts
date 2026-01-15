/**
 * Assignments service with mock behaviors:
 * - list/get/create/update/remove
 * - grading endpoints: saveDraft + grade (kept simple in-memory)
 */

import api from './apiClient'
import { type Assignment } from '@/types/models/assignment'
import mockDataJson from '@/data/mock/data.json'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const STORAGE_KEY = 'mock.assignments'

type MockData = {
	assignments?: Assignment[]
	// optional seeds for future use
	submissions?: any[]
	grades?: any[]
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const dataset = (mockDataJson as unknown) as MockData

function loadAssignmentsStorage(): Assignment[] {
	if (typeof window === 'undefined') return [...(dataset.assignments ?? [])]
	try {
		const cached = window.localStorage.getItem(STORAGE_KEY)
		if (cached) {
			const parsed = JSON.parse(cached)
			if (Array.isArray(parsed)) return parsed as Assignment[]
		}
	} catch (err) {
		console.warn('assignments load failed, fallback to seed', err)
	}
	return [...(dataset.assignments ?? [])]
}

function persistAssignmentsStorage(assignments: Assignment[]) {
	if (typeof window === 'undefined') return
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments))
	} catch (err) {
		console.warn('assignments persist failed', err)
	}
}

const assignmentsStorage: Assignment[] = loadAssignmentsStorage()
const submissionsStorage: any[] = [...(dataset.submissions ?? [])]
const gradesStorage: any[] = [...(dataset.grades ?? [])]

function escapeCsv(value: unknown) {
	const str = value == null ? '' : String(value)
	if (/[\n\r,\"]/g.test(str)) return `"${str.replace(/\"/g, '""')}"`
	return str
}

function parseCsv(text: string) {
	const rows: string[][] = []
	let current = ''
	let row: string[] = []
	let inQuotes = false
	for (let i = 0; i < text.length; i += 1) {
		const ch = text[i]
		const next = text[i + 1]
		if (inQuotes) {
			if (ch === '"' && next === '"') {
				current += '"'
				i += 1
				continue
			}
			if (ch === '"') {
				inQuotes = false
				continue
			}
			current += ch
			continue
		}
		if (ch === '"') {
			inQuotes = true
			continue
		}
		if (ch === ',') {
			row.push(current)
			current = ''
			continue
		}
		if (ch === '\n' || ch === '\r') {
			if (ch === '\r' && next === '\n') i += 1
			row.push(current)
			current = ''
			if (row.some((c) => c.trim() !== '')) rows.push(row)
			row = []
			continue
		}
		current += ch
	}
	row.push(current)
	if (row.some((c) => c.trim() !== '')) rows.push(row)
	return rows
}

export const assignmentsService = {
	async list(params?: { courseId?: string }): Promise<Assignment[]> {
		if (USE_MOCK) {
			await delay(30)
			if (params?.courseId) return assignmentsStorage.filter((a) => a.courseId === params.courseId)
			return [...assignmentsStorage]
		}
		const res = await api.get<Assignment[]>('/assignments', { params })
		// 确保返回的是数组
		return Array.isArray(res.data) ? res.data : []
	},

	async get(id: string): Promise<Assignment | undefined> {
		if (USE_MOCK) {
			await delay(20)
			return assignmentsStorage.find((a) => a.id === id)
		}
		const res = await api.get<Assignment>(`/assignments/${id}`)
		return res.data
	},

	async create(payload: Partial<Assignment> & { title: string }): Promise<Assignment> {
		if (USE_MOCK) {
			await delay(50)
			const newItem: Assignment = {
				id: payload.id ?? `assign-${Date.now().toString(36)}`,
				courseId: payload.courseId ?? 'unknown-course',
				title: payload.title,
				status: payload.status ?? 'draft',
				dueAt: payload.dueAt,
				totalPoints: payload.totalPoints,
				submissionsCount: payload.submissionsCount ?? 0,
				ungradedCount: payload.ungradedCount ?? 0,
				classLabel: payload.classLabel,
				submittedAt: payload.submittedAt,
				note: payload.note,
				size: payload.size,
				priority: payload.priority
			}
			assignmentsStorage.unshift(newItem)
			persistAssignmentsStorage(assignmentsStorage)
			return newItem
		}
		const res = await api.post<Assignment>('/assignments', payload)
		return res.data
	},

	async update(id: string, payload: Partial<Assignment>): Promise<Assignment> {
		if (USE_MOCK) {
			await delay(30)
			const idx = assignmentsStorage.findIndex((a) => a.id === id)
			if (idx === -1) throw new Error('Not found')
			assignmentsStorage[idx] = { ...assignmentsStorage[idx], ...payload }
			persistAssignmentsStorage(assignmentsStorage)
			return assignmentsStorage[idx]
		}
		const res = await api.put<Assignment>(`/assignments/${id}`, payload)
		return res.data
	},

	async remove(id: string): Promise<boolean> {
		if (USE_MOCK) {
			const idx = assignmentsStorage.findIndex((a) => a.id === id)
			if (idx !== -1) assignmentsStorage.splice(idx, 1)
			persistAssignmentsStorage(assignmentsStorage)
			return true
		}
		await api.delete(`/assignments/${id}`)
		return true
	},

	async exportCsv(params?: { courseId?: string; status?: Assignment['status'] }): Promise<{ filename: string; csv: string }> {
		if (!USE_MOCK) {
			// Example real API shape; adjust when backend exists.
			const res = await api.get<{ filename: string; csv: string }>('/assignments/export', { params })
			return res.data
		}
		await delay(20)
		let list = [...assignmentsStorage]
		if (params?.courseId) list = list.filter((a) => a.courseId === params.courseId)
		if (params?.status) list = list.filter((a) => a.status === params.status)
		const header = ['id', 'courseId', 'title', 'dueAt', 'totalPoints', 'status']
		const lines = [header.join(',')]
		for (const a of list) {
			lines.push([
				escapeCsv(a.id),
				escapeCsv(a.courseId),
				escapeCsv(a.title),
				escapeCsv(a.dueAt ?? ''),
				escapeCsv(a.totalPoints ?? ''),
				escapeCsv(a.status)
			].join(','))
		}
		return { filename: 'assignments.csv', csv: `${lines.join('\n')}\n` }
	},

	async importCsv(input: { csvText: string; defaultCourseId?: string }): Promise<{ imported: number }> {
		if (!USE_MOCK) {
			const res = await api.post<{ imported: number }>('/assignments/import', input)
			return res.data
		}
		await delay(40)
		const rows = parseCsv(input.csvText.trim())
		if (rows.length === 0) return { imported: 0 }

		const headerRow = rows[0].map((c) => c.trim())
		const hasHeader = headerRow.includes('title') || headerRow.includes('courseId') || headerRow.includes('status')
		const header = hasHeader ? headerRow : ['id', 'courseId', 'title', 'dueAt', 'totalPoints', 'status']
		const startIdx = hasHeader ? 1 : 0
		let imported = 0

		for (let i = startIdx; i < rows.length; i += 1) {
			const r = rows[i]
			const obj: Record<string, string> = {}
			for (let j = 0; j < header.length; j += 1) obj[header[j]] = (r[j] ?? '').trim()
			const title = obj.title || ''
			if (!title) continue
			const courseId = obj.courseId || input.defaultCourseId || 'unknown-course'
			const totalPoints = obj.totalPoints ? Number(obj.totalPoints) : undefined
			const status = (obj.status as Assignment['status']) || 'draft'
			const dueAt = obj.dueAt || undefined

			const created: Assignment = {
				id: obj.id || `assign-${Date.now().toString(36)}-${i}`,
				courseId,
				title,
				status,
				dueAt,
				totalPoints
			}
			assignmentsStorage.unshift(created)
			imported += 1
		}

		if (imported > 0) persistAssignmentsStorage(assignmentsStorage)
		return { imported }
	},

	async grade(assignmentId: string, submissionId: string, payload: any) {
		if (USE_MOCK) {
			const grade = {
				id: `g-${Date.now().toString(36)}`,
				submission_id: submissionId,
				grader_id: payload.grader_id ?? 'u1',
				score: payload.score,
				feedback: payload.feedback,
				created_at: new Date().toISOString(),
				draft: false
			}
			gradesStorage.push(grade)
			const sub = submissionsStorage.find((s) => s.id === submissionId)
			if (sub) {
				sub.grade = payload.score
				sub.status = 'graded'
			}
			return grade
		}
		const res = await api.post(`/assignments/${assignmentId}/grade`, payload)
		return res.data
	},

	async saveDraft(assignmentId: string, submissionId: string, payload: any) {
		if (USE_MOCK) {
			const graderId = payload.grader_id ?? 'u1'
			const existing = gradesStorage.find((g) => g.submission_id === submissionId && g.grader_id === graderId)
			const draft = {
				id: existing?.id ?? `gd-${Date.now().toString(36)}`,
				submission_id: submissionId,
				grader_id: graderId,
				score: payload.score ?? null,
				feedback: payload.feedback ?? null,
				draft: true,
				updated_at: new Date().toISOString()
			}
			if (!existing) gradesStorage.push(draft)
			else Object.assign(existing, draft)
			return draft
		}
		const res = await api.post(`/assignments/${assignmentId}/grade/draft`, payload)
		return res.data
	}
}

export default assignmentsService
