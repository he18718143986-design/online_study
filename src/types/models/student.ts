export type AttendanceStatus = 'present' | 'absent'
export type OnlineStatus = 'online' | 'offline'

export interface Student {
	id: string
	/** External/student-facing number (can differ from internal id) */
	studentNumber?: string
	courseId?: string
	/** Back-compat with mock schema */
	classId?: string
	/** Optional persisted fields used by list filters */
	grade?: string
	className?: string
	name: string
	avatar?: string
	group?: string
	onlineStatus: OnlineStatus
	attendance: AttendanceStatus
	lastActive?: string
}
