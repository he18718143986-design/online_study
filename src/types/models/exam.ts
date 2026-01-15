export type ExamStatus = 'draft' | 'scheduled' | 'ongoing' | 'completed' | 'review' | 'closed'

export type AntiCheatLevel = 'low' | 'medium' | 'high' | 'strict'

export interface ExamSegment {
	id: string
	name: string
	startTime?: number // 开始时间（分钟，从考试开始算起）
	duration?: number // 时长（分钟）
	questionCount?: number // 题目数量
}

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
	// 分段设置
	segments?: ExamSegment[]
	antiCheatLevel?: AntiCheatLevel
	timeWindow?: number // 时间窗（分钟），允许学生在此时间范围内开始考试
}
