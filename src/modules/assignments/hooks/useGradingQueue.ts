import React from 'react'
import type { Assignment } from '@/types/models/assignment'
import type { Student } from '@/types/models/student'

export type SubmissionStatus = 'pending' | 'grading' | 'completed' | 'review'

export interface SubmissionAttachment {
	id: string
	label: string
	src: string
	type?: 'image' | 'pdf'
	page?: number
}

export interface SubmissionItem {
	id: string
	student: Student
	assignment: Assignment
	submittedAt?: string
	status: SubmissionStatus
	score?: number
	aiConfidence?: 'high' | 'medium' | 'low'
	attachments: SubmissionAttachment[]
	flags?: string[]
}

export interface SubmissionDraft {
	score?: number
	comment?: string
	rubric?: Record<string, boolean>
}

export interface UseGradingQueueResult {
	queue: SubmissionItem[]
	activeSubmission?: SubmissionItem
	isLoading: boolean
	fetchQueue: () => Promise<void>
	selectSubmission: (id: string) => void
	saveDraft: (submissionId: string, draft: SubmissionDraft) => Promise<void>
	submitGrade: (submissionId: string, score: number, comment?: string) => Promise<void>
}

const buildPlaceholderAssignment = (assignmentId: string): Assignment => ({
	id: assignmentId || 'assignment-temp',
	courseId: 'course-001',
	title: '数学竞赛模拟测试',
	status: 'pending',
	totalPoints: 100,
	submissionsCount: 50,
	ungradedCount: 12
})

const placeholderStudent = (id: string, name: string, group: string, onlineStatus: Student['onlineStatus'], attendance: Student['attendance']): Student => ({
	id,
	courseId: 'course-001',
	name,
	group,
	onlineStatus,
	attendance,
	avatar: undefined,
	lastActive: '刚刚'
})

const placeholderAttachments: SubmissionAttachment[] = [
	{ id: 'p1', label: '第 1 页', src: 'https://picsum.photos/seed/grading-1/800/1000', type: 'image', page: 1 },
	{ id: 'p2', label: '第 2 页', src: 'https://picsum.photos/seed/grading-2/800/1000', type: 'image', page: 2 },
	{ id: 'p3', label: '答题卡', src: 'https://picsum.photos/seed/grading-3/800/1000', type: 'image', page: 3 }
]

export function useGradingQueue(assignmentId: string): UseGradingQueueResult {
	const [queue, setQueue] = React.useState<SubmissionItem[]>([])
	const [activeId, setActiveId] = React.useState<string | undefined>(undefined)
	const [isLoading, setIsLoading] = React.useState(false)

	const fetchQueue = React.useCallback(async () => {
		setIsLoading(true)
		const assignment = buildPlaceholderAssignment(assignmentId)
		const sampleQueue: SubmissionItem[] = [
			{
				id: 'sub-1',
				student: placeholderStudent('stu-1', '李明', 'A 组', 'online', 'present'),
				assignment,
				submittedAt: '10:42',
				status: 'grading',
				score: undefined,
				aiConfidence: 'high',
				attachments: placeholderAttachments,
				flags: ['手写公式']
			},
			{
				id: 'sub-2',
				student: placeholderStudent('stu-2', '王芳', 'A 组', 'offline', 'present'),
				assignment,
				submittedAt: '09:15',
				status: 'pending',
				score: undefined,
				aiConfidence: 'low',
				attachments: placeholderAttachments.slice(0, 2),
				flags: ['AI置信度低']
			},
			{
				id: 'sub-3',
				student: placeholderStudent('stu-3', '张伟', 'B 组', 'online', 'present'),
				assignment,
				submittedAt: '09:10',
				status: 'pending',
				score: undefined,
				aiConfidence: 'medium',
				attachments: placeholderAttachments.slice(0, 1)
			},
			{
				id: 'sub-4',
				student: placeholderStudent('stu-4', '陈曦', 'B 组', 'offline', 'absent'),
				assignment,
				submittedAt: '08:50',
				status: 'completed',
				score: 92,
				aiConfidence: 'high',
				attachments: placeholderAttachments.slice(0, 2)
			}
		]

		setQueue(sampleQueue)
		setActiveId(sampleQueue[0]?.id)
		setIsLoading(false)
	}, [assignmentId])

	const selectSubmission = React.useCallback((id: string) => {
		setActiveId(id)
	}, [])

	const saveDraft = React.useCallback(async (submissionId: string, draft: SubmissionDraft) => {
		setQueue((prev) =>
			prev.map((item) => {
				if (item.id !== submissionId) return item
				return { ...item, score: draft.score ?? item.score, flags: draft.rubric ? Object.keys(draft.rubric).filter((key) => draft.rubric?.[key]) : item.flags }
			})
		)
	}, [])

	const submitGrade = React.useCallback(async (submissionId: string, score: number, comment?: string) => {
		setQueue((prev) =>
			prev.map((item) => {
				if (item.id !== submissionId) return item
				return { ...item, score, status: 'completed', flags: comment ? [...(item.flags ?? []), '已反馈'] : item.flags }
			})
		)
	}, [])

	const activeSubmission = React.useMemo(() => queue.find((item) => item.id === activeId), [activeId, queue])

	React.useEffect(() => {
		void fetchQueue()
	}, [fetchQueue])

	return {
		queue,
		activeSubmission,
		isLoading,
		fetchQueue,
		selectSubmission,
		saveDraft,
		submitGrade
	}
}

export default useGradingQueue
