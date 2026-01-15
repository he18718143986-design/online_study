export type ExamStatus = 'draft' | 'scheduled' | 'ongoing' | 'completed' | 'review' | 'closed'

export interface Exam {
	id: string
	title: string
	classLabel?: string
	status: ExamStatus
	startAt?: string
	endAt?: string
	durationMinutes?: number
	proctor?: string
	token?: string
	participants?: { current: number; total: number }
	note?: string
}
