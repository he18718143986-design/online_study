export type QuestionStatus = 'draft' | 'review' | 'published'

export interface Question {
	id: string
	title: string
	content: string
	knowledgePoints?: string[]
	difficulty?: 1 | 2 | 3 | 4 | 5
	type?: string
	status: QuestionStatus
	author?: string
	updatedAt?: string
}
