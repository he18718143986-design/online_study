export interface Recording {
	id: string
	courseId?: string
	title: string
	duration: string
	date: string
	status?: 'ready' | 'processing' | 'failed'
	preview?: string
}
