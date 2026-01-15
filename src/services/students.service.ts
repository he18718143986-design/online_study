/**
 * Student service with mock behaviors:
 * - list/get
 * - getProgress(id) returns a lightweight synthesized progress object (demo-friendly)
 * - write operations are in-memory (optionally persisted to localStorage)
 */

import api from './apiClient'
import { type Student } from '@/types/models/student'
import mockDataJson from '@/data/mock/data.json'

// 默认在开发环境使用 mock，除非明确设置为 false
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false' && (import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === 'true')

type MockData = {
	students?: Student[]
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const STORAGE_KEY = 'mock.students'

function loadStorage(): Student[] {
	const seed = [...(((mockDataJson as unknown) as MockData).students ?? [])]
	if (typeof window === 'undefined') return seed
	try {
		const cached = window.localStorage.getItem(STORAGE_KEY)
		if (cached) {
			const parsed = JSON.parse(cached)
			if (Array.isArray(parsed)) return parsed
		}
	} catch (err) {
		console.warn('students load failed, fallback to seed', err)
	}
	return seed
}

const studentsStorage: Array<Student & Record<string, any>> = loadStorage() as any

function persistStorage() {
	if (typeof window === 'undefined') return
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(studentsStorage))
	} catch (err) {
		console.warn('students persist failed', err)
	}
}

function nowId(prefix = 'student') {
	return `${prefix}-${Date.now().toString(36)}`
}

export const studentsService = {
	async list(params?: { courseId?: string }): Promise<Student[]> {
		if (USE_MOCK) {
			await delay(30)
			if (params?.courseId) return studentsStorage.filter((s) => s.courseId === params.courseId)
			return [...studentsStorage]
		}
		const res = await api.get<Student[]>('/students', { params })
		// 确保返回的是数组
		return Array.isArray(res.data) ? res.data : []
	},

	async get(id: string): Promise<Student | undefined> {
		if (USE_MOCK) {
			await delay(20)
			return studentsStorage.find((s) => s.id === id)
		}
		const res = await api.get<Student>(`/students/${id}`)
		return res.data
	},

	async getProgress(id: string) {
		if (USE_MOCK) {
			await delay(20)
			const student = studentsStorage.find((s) => s.id === id)
			if (!student) throw new Error('Not found')
			return {
				studentId: id,
				scores: [
					{ date: '2025-12-01', score: 80 },
					{ date: '2025-12-20', score: 85 },
					{ date: '2026-01-05', score: 87 }
				],
				mastery: { '数论': 0.7, '几何': 0.6 }
			}
		}
		const res = await api.get(`/students/${id}/progress`)
		return res.data
	}

	,
	async create(payload: Partial<Student> & { name: string }): Promise<Student> {
		if (USE_MOCK) {
			await delay(50)
			const created: Student & Record<string, any> = {
				id: payload.id ?? nowId('student'),
				studentNumber: payload.studentNumber,
				name: payload.name,
				courseId: payload.courseId,
				classId: payload.classId,
				grade: payload.grade,
				className: payload.className,
				avatar: payload.avatar,
				group: payload.group,
				onlineStatus: payload.onlineStatus ?? 'offline',
				attendance: payload.attendance ?? 'absent',
				lastActive: payload.lastActive
			}
			studentsStorage.unshift(created)
			persistStorage()
			return created
		}
		const res = await api.post<Student>('/students', payload)
		return res.data
	},

	async update(id: string, payload: Partial<Student>): Promise<Student> {
		if (USE_MOCK) {
			await delay(30)
			const idx = studentsStorage.findIndex((s) => s.id === id)
			if (idx === -1) throw new Error('Not found')
			studentsStorage[idx] = { ...studentsStorage[idx], ...payload }
			persistStorage()
			return studentsStorage[idx]
		}
		const res = await api.put<Student>(`/students/${id}`, payload)
		return res.data
	},

	async remove(id: string): Promise<boolean> {
		if (USE_MOCK) {
			await delay(20)
			const idx = studentsStorage.findIndex((s) => s.id === id)
			if (idx !== -1) studentsStorage.splice(idx, 1)
			persistStorage()
			return true
		}
		await api.delete(`/students/${id}`)
		return true
	},

	async bulkMessage(studentIds: string[], payload?: { message?: string }): Promise<boolean> {
		if (USE_MOCK) {
			await delay(40)
			// demo-only; no persistence required
			return true
		}
		await api.post('/students/bulk/message', { studentIds, ...payload })
		return true
	},

	async bulkGroup(studentIds: string[], payload: { group: string }): Promise<boolean> {
		if (USE_MOCK) {
			await delay(40)
			studentIds.forEach((id) => {
				const idx = studentsStorage.findIndex((s) => s.id === id)
				if (idx !== -1) studentsStorage[idx] = { ...studentsStorage[idx], group: payload.group }
			})
			persistStorage()
			return true
		}
		await api.post('/students/bulk/group', { studentIds, ...payload })
		return true
	},

	async bulkMarkPresent(studentIds: string[]): Promise<boolean> {
		if (USE_MOCK) {
			await delay(40)
			studentIds.forEach((id) => {
				const idx = studentsStorage.findIndex((s) => s.id === id)
				if (idx !== -1) {
					studentsStorage[idx] = {
						...studentsStorage[idx],
						attendance: 'present',
						lastActive: studentsStorage[idx].lastActive ?? 'just now'
					}
				}
			})
			persistStorage()
			return true
		}
		await api.post('/students/bulk/attendance', { studentIds, attendance: 'present' })
		return true
	},

	async exportCsv(studentIds: string[]): Promise<{ filename: string; content: string }> {
		if (USE_MOCK) {
			await delay(30)
			// 如果没有指定学生ID，导出所有学生
			const studentsToExport = studentIds.length > 0 
				? studentIds.map((id) => studentsStorage.find((s) => s.id === id)).filter(Boolean)
				: studentsStorage
			
			const header = 'id,name,courseId,attendance,onlineStatus,group\n'
			const rows = studentsToExport
				.map((s) => `${s!.id},${s!.name},${s!.courseId ?? ''},${s!.attendance},${s!.onlineStatus},${s!.group ?? ''}`)
				.join('\n')
			return { filename: `students_${new Date().toISOString().slice(0, 10)}.csv`, content: header + rows + (rows ? '\n' : '') }
		}
		try {
			const res = await api.post('/students/export', { studentIds })
			return res.data
		} catch (err) {
			console.error('导出失败，回退到 mock 模式', err)
			// 如果 API 调用失败，回退到 mock 实现
			await delay(30)
			const studentsToExport = studentIds.length > 0 
				? studentIds.map((id) => studentsStorage.find((s) => s.id === id)).filter(Boolean)
				: studentsStorage
			
			const header = 'id,name,courseId,attendance,onlineStatus,group\n'
			const rows = studentsToExport
				.map((s) => `${s!.id},${s!.name},${s!.courseId ?? ''},${s!.attendance},${s!.onlineStatus},${s!.group ?? ''}`)
				.join('\n')
			return { filename: `students_${new Date().toISOString().slice(0, 10)}.csv`, content: header + rows + (rows ? '\n' : '') }
		}
	}
}

export default studentsService
