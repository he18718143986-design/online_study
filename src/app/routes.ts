/**
 * 路由常量定义
 * 
 * 路由命名规则：
 * - 列表页：复数形式（/recordings, /assignments, /students）
 * - 详情页：带参数（/recordings/:recordingId）
 * - 编辑页：详情页 + /edit
 * 
 * Deep-Link 支持的路由：
 * - /live/:courseId - 直播教学
 * - /courses/:courseId - 课程详情
 * - /recordings/:recordingId - 录播详情
 * - /assignments/:assignmentId - 作业详情
 * - /students/:studentId - 学生档案
 */
export const ROUTES = {
	// 公开页面
	login: '/login',
	
	// 主布局页面
	dashboard: '/',
	courseSchedule: '/courses/schedule',
	recordings: '/recordings',
	recordingDetail: '/recordings/:recordingId',
	resourceLibrary: '/resources',
	assignmentManagement: '/assignments',
	assignmentDetail: '/assignments/:assignmentId',
	assignmentNew: '/assignments/new',
	gradingWorkspace: '/assignments/grading',
	gradebook: '/assignments/gradebook',
	examManagement: '/exams',
	examDetail: '/exams/:examId',
	studentList: '/students',
	questionBank: '/question-bank',
	teachingAnalytics: '/analytics',
	inbox: '/inbox',
	settings: '/settings',
	collaborationReview: '/collaboration/review',
	
	// 详情布局页面
	courseDetail: '/courses/:courseId',
	courseEdit: '/courses/:courseId/edit',
	studentProfile: '/students/:studentId',
	
	// 沉浸式布局页面（直播）
	liveTeaching: '/live',
	liveTeachingWithCourse: '/live/:courseId'
} as const

export type AppRouteKey = keyof typeof ROUTES

// ============================================
// URL 生成辅助函数
// ============================================

/**
 * 生成直播教学页面的 URL
 * @param courseId 课程 ID
 * @returns 直播页面 URL
 */
export function getLiveTeachingUrl(courseId: string): string {
	return `/live/${encodeURIComponent(courseId)}`
}

/**
 * 生成课程详情页面的 URL
 * @param courseId 课程 ID
 * @returns 课程详情页面 URL
 */
export function getCourseDetailUrl(courseId: string): string {
	return ROUTES.courseDetail.replace(':courseId', encodeURIComponent(courseId))
}

/**
 * 生成录播详情页面的 URL
 * @param recordingId 录播 ID
 * @param courseId 可选的课程 ID（用于筛选）
 * @returns 录播详情页面 URL
 */
export function getRecordingDetailUrl(recordingId: string, courseId?: string): string {
	const base = ROUTES.recordingDetail.replace(':recordingId', encodeURIComponent(recordingId))
	if (courseId) {
		return `${base}?courseId=${encodeURIComponent(courseId)}`
	}
	return base
}

/**
 * 生成作业详情页面的 URL
 * @param assignmentId 作业 ID
 * @returns 作业详情页面 URL
 */
export function getAssignmentDetailUrl(assignmentId: string): string {
	return ROUTES.assignmentDetail.replace(':assignmentId', encodeURIComponent(assignmentId))
}

/**
 * 生成学生档案页面的 URL
 * @param studentId 学生 ID
 * @returns 学生档案页面 URL
 */
export function getStudentProfileUrl(studentId: string): string {
	return ROUTES.studentProfile.replace(':studentId', encodeURIComponent(studentId))
}

/**
 * 生成考试详情页面的 URL
 * @param examId 考试 ID
 * @returns 考试详情页面 URL
 */
export function getExamDetailUrl(examId: string): string {
	return ROUTES.examDetail.replace(':examId', encodeURIComponent(examId))
}

// ============================================
// Deep-Link 路由列表（用于测试和文档）
// ============================================

/**
 * 所有支持 deep-link 的参数化路由
 * 用于测试和文档生成
 */
export const DEEP_LINK_ROUTES = [
	{ path: '/live/:courseId', param: 'courseId', example: '/live/course-live-1' },
	{ path: '/courses/:courseId', param: 'courseId', example: '/courses/course-001' },
	{ path: '/recordings/:recordingId', param: 'recordingId', example: '/recordings/rec-001' },
	{ path: '/assignments/:assignmentId', param: 'assignmentId', example: '/assignments/assign-101' },
	{ path: '/students/:studentId', param: 'studentId', example: '/students/s001' },
	{ path: '/exams/:examId', param: 'examId', example: '/exams/exam-001' }
] as const
