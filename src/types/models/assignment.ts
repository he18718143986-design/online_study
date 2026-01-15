export type AssignmentStatus = 'draft' | 'published' | 'closed' | 'pending' | 'review' | 'completed' | 'urgent' | 'normal'

export interface Assignment {
	id: string
	courseId: string
	title: string
	description?: string
	dueAt?: string
	totalPoints?: number
	status: AssignmentStatus
	submissionsCount?: number
	ungradedCount?: number
	classLabel?: string
	submittedAt?: string
	note?: string
	size?: string
	priority?: 'urgent' | 'normal'
}
