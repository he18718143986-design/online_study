import { Student } from './student'
import { Assignment } from './assignment'
import { Recording } from './recording'

export type CourseStatus = 'live' | 'upcoming' | 'completed' | 'ongoing' | 'pending'

export interface CourseStats {
	studentsTotal: number
	participationRate: number
	homeworkSubmissionRate: number
}

export interface Course {
	id: string
	title: string
	description?: string
	subtitle?: string
	teacher?: string
	schedule?: string
	term?: string
	classLabel?: string
	timeRange?: string
	studentsCount?: number
	status: CourseStatus
	stats?: CourseStats
}

export interface CourseSession {
	id: string
	courseId?: string
	title: string
	className: string
	description?: string
	dayLabel: string
	dateLabel?: string
	weekday: number // 1 = Monday, 7 = Sunday
	status: CourseStatus
	startTime: string
	endTime: string
	tag?: string
	mode?: 'live' | 'recorded' | 'hybrid'
	students?: Student[]
	assignments?: Assignment[]
	recordings?: Recording[]
}
