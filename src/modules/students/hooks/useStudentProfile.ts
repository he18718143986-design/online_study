import React from 'react'
import studentsService from '@/services/students.service'
import type { Student } from '@/types/models/student'

export interface SubmissionRecord {
	id: string
	title: string
	assignmentId: string
	score?: number
	status: 'on-time' | 'late' | 'missing'
	submittedAt?: string
}

export interface MasterySnapshot {
	topic: string
	mastery: number // 0-1
	trend: 'up' | 'flat' | 'down'
}

export interface StudentProfileData {
	id: string
	name: string
	avatar?: string
	grade: string
	className: string
	handle?: string
	email?: string
	phone?: string
	guardian?: string
	group?: string
	attendanceRate: number
	averageScore: number
	lastActive: string
}

export interface UseStudentProfileResult {
	profile: StudentProfileData | null
	submissions: SubmissionRecord[]
	mastery: MasterySnapshot[]
	isLoading: boolean
	error?: Error
	refetch: () => Promise<void>
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

function buildProfile(student: Student): StudentProfileData {
	const seed = hashToInt(student.id)
	const grade = GRADES[seed % GRADES.length]
	const className = CLASS_NAMES[seed % CLASS_NAMES.length]
	const attendanceRateBase = student.attendance === 'present' ? 0.85 : 0.6
	return {
		id: student.id,
		name: student.name,
		avatar: student.avatar,
		grade,
		className,
		handle: `@${student.id}`,
		email: `${student.id}@example.com`,
		phone: `138-0000-${(seed % 9000 + 1000).toString()}`,
		guardian: '家长信息待接入',
		group: student.group,
		attendanceRate: Math.min(1, attendanceRateBase + ((seed % 15) / 100)),
		averageScore: 70 + (seed % 26),
		lastActive: student.lastActive ?? '—'
	}
}

const mockSubmissions: SubmissionRecord[] = [
	{ id: 'sub-1', title: '集合与函数基础作业', assignmentId: 'hw-101', score: 98, status: 'on-time', submittedAt: '2026-01-03 21:10' },
	{ id: 'sub-2', title: '数列与递推小测', assignmentId: 'quiz-204', score: 88, status: 'late', submittedAt: '2025-12-29 09:30' },
	{ id: 'sub-3', title: '平面几何巩固练习', assignmentId: 'hw-205', score: 75, status: 'on-time', submittedAt: '2025-12-22 19:05' },
	{ id: 'sub-4', title: '导数与极值课堂练习', assignmentId: 'quiz-210', status: 'missing' }
]

const mockMastery: MasterySnapshot[] = [
	{ topic: '代数', mastery: 0.95, trend: 'up' },
	{ topic: '几何', mastery: 0.72, trend: 'flat' },
	{ topic: '数列', mastery: 0.82, trend: 'up' },
	{ topic: '函数', mastery: 0.64, trend: 'down' }
]

export function useStudentProfile(studentId?: string): UseStudentProfileResult {
	const [profile, setProfile] = React.useState<StudentProfileData | null>(null)
	const [submissions, setSubmissions] = React.useState<SubmissionRecord[]>([])
	const [mastery, setMastery] = React.useState<MasterySnapshot[]>([])
	const [isLoading, setIsLoading] = React.useState(false)
	const [error, setError] = React.useState<Error | undefined>(undefined)

	const refetch = React.useCallback(async () => {
		setIsLoading(true)
		setError(undefined)
		try {
			if (!studentId) throw new Error('Missing studentId')
			const student = await studentsService.get(studentId)
			if (!student) throw new Error('Not found')
			const progress = await studentsService.getProgress(studentId)
			setProfile(buildProfile(student))
			setSubmissions(mockSubmissions.map((s) => ({ ...s, id: `${studentId}-${s.id}` })))
			const masteryList = Object.entries((progress?.mastery ?? {}) as Record<string, number>).map(([topic, value]) => ({
				topic,
				mastery: value,
				trend: 'flat' as const
			}))
			setMastery(masteryList.length ? masteryList : mockMastery)
		} catch (err) {
			setError(err as Error)
		} finally {
			setIsLoading(false)
		}
	}, [studentId])

	React.useEffect(() => {
		void refetch()
	}, [refetch])

	return { profile, submissions, mastery, isLoading, error, refetch }
}

export default useStudentProfile
