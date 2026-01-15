/**
 * 路由总表与 URL 生成器
 * 
 * 本文件是项目路由的唯一权威来源（Single Source of Truth）。
 * 所有页面导航必须使用本文件导出的常量和辅助函数。
 * 
 * ## 路由命名规则
 * - 列表页：复数形式（/recordings, /assignments, /students）
 * - 详情页：带参数（/recordings/:recordingId）
 * - 编辑页：详情页 + /edit
 * - 操作页：列表页 + /action（如 /assignments/grading）
 * 
 * ## 参数优先级契约
 * Hook 获取 ID 的优先级：route.params > route.query > props/fallback
 * 
 * @see spec/routes.md 完整路由规范文档
 */

// ============================================
// 路由常量定义
// ============================================

export const ROUTES = {
	// ----------------------------------------
	// 公开页面（无需登录）
	// ----------------------------------------
	login: '/login',
	
	// ----------------------------------------
	// 主布局页面（带侧边栏）
	// ----------------------------------------
	dashboard: '/',
	
	// 课程模块
	courseSchedule: '/courses/schedule',
	courseScheduleNew: '/courses/schedule/new',
	
	// 录播模块
	recordings: '/recordings',
	recordingDetail: '/recordings/:recordingId',
	
	// 资源模块
	resourceLibrary: '/resources',
	resourceUpload: '/resources/upload',
	
	// 作业模块
	assignmentManagement: '/assignments',
	assignmentDetail: '/assignments/:assignmentId',
	assignmentNew: '/assignments/new',
	assignmentGrading: '/assignments/:assignmentId/grading',
	gradingWorkspace: '/assignments/grading',
	gradebook: '/assignments/gradebook',
	
	// 考试模块
	examManagement: '/exams',
	examDetail: '/exams/:examId',
	
	// 学生模块
	studentList: '/students',
	studentProfile: '/students/:studentId',
	
	// 题库模块
	questionBank: '/question-bank',
	
	// 分析模块
	teachingAnalytics: '/analytics',
	
	// 通知模块
	inbox: '/inbox',
	
	// 系统模块
	settings: '/settings',
	collaborationReview: '/collaboration/review',
	
	// ----------------------------------------
	// 详情布局页面（带返回导航）
	// ----------------------------------------
	courseDetail: '/courses/:courseId',
	courseEdit: '/courses/:courseId/edit',
	
	// ----------------------------------------
	// 沉浸式布局页面（直播）
	// ----------------------------------------
	liveTeaching: '/live',
	liveTeachingWithCourse: '/live/:courseId'
} as const

export type AppRouteKey = keyof typeof ROUTES
export type AppRoutePath = typeof ROUTES[AppRouteKey]

// ============================================
// URL 生成辅助函数
// ============================================

/**
 * 生成直播教学页面的 URL
 * @param courseId 课程 ID
 * @example getLiveTeachingUrl('course-001') // '/live/course-001'
 */
export function getLiveTeachingUrl(courseId: string): string {
	return `/live/${encodeURIComponent(courseId)}`
}

/**
 * 生成课程详情页面的 URL
 * @param courseId 课程 ID
 * @example getCourseDetailUrl('course-001') // '/courses/course-001'
 */
export function getCourseDetailUrl(courseId: string): string {
	return ROUTES.courseDetail.replace(':courseId', encodeURIComponent(courseId))
}

/**
 * 生成课程编辑页面的 URL
 * @param courseId 课程 ID
 * @example getCourseEditUrl('course-001') // '/courses/course-001/edit'
 */
export function getCourseEditUrl(courseId: string): string {
	return ROUTES.courseEdit.replace(':courseId', encodeURIComponent(courseId))
}

/**
 * 生成录播详情页面的 URL
 * @param recordingId 录播 ID
 * @param courseId 可选的课程 ID（用于返回筛选）
 * @example getRecordingDetailUrl('rec-001') // '/recordings/rec-001'
 * @example getRecordingDetailUrl('rec-001', 'course-001') // '/recordings/rec-001?courseId=course-001'
 */
export function getRecordingDetailUrl(recordingId: string, courseId?: string): string {
	const base = ROUTES.recordingDetail.replace(':recordingId', encodeURIComponent(recordingId))
	if (courseId) {
		return `${base}?courseId=${encodeURIComponent(courseId)}`
	}
	return base
}

/**
 * 生成录播列表页面的 URL（带课程筛选）
 * @param courseId 可选的课程 ID
 * @example getRecordingsUrl() // '/recordings'
 * @example getRecordingsUrl('course-001') // '/recordings?courseId=course-001'
 */
export function getRecordingsUrl(courseId?: string): string {
	if (courseId) {
		return `${ROUTES.recordings}?courseId=${encodeURIComponent(courseId)}`
	}
	return ROUTES.recordings
}

/**
 * 生成作业详情页面的 URL
 * @param assignmentId 作业 ID
 * @example getAssignmentDetailUrl('assign-101') // '/assignments/assign-101'
 */
export function getAssignmentDetailUrl(assignmentId: string): string {
	return ROUTES.assignmentDetail.replace(':assignmentId', encodeURIComponent(assignmentId))
}

/**
 * 生成作业批改页面的 URL
 * @param assignmentId 作业 ID
 * @example getAssignmentGradingUrl('assign-101') // '/assignments/assign-101/grading'
 */
export function getAssignmentGradingUrl(assignmentId: string): string {
	return ROUTES.assignmentGrading.replace(':assignmentId', encodeURIComponent(assignmentId))
}

/**
 * 生成批改工作室页面的 URL
 * @param assignmentId 可选的作业 ID（预选）
 * @example getGradingWorkspaceUrl() // '/assignments/grading'
 * @example getGradingWorkspaceUrl('assign-101') // '/assignments/grading?assignmentId=assign-101'
 */
export function getGradingWorkspaceUrl(assignmentId?: string): string {
	if (assignmentId) {
		return `${ROUTES.gradingWorkspace}?assignmentId=${encodeURIComponent(assignmentId)}`
	}
	return ROUTES.gradingWorkspace
}

/**
 * 生成作业列表页面的 URL（带通知参数）
 * @param notice 可选的通知类型（published/draft）
 * @example getAssignmentsUrl() // '/assignments'
 * @example getAssignmentsUrl('published') // '/assignments?notice=published'
 */
export function getAssignmentsUrl(notice?: string): string {
	if (notice) {
		return `${ROUTES.assignmentManagement}?notice=${encodeURIComponent(notice)}`
	}
	return ROUTES.assignmentManagement
}

/**
 * 生成学生档案页面的 URL
 * @param studentId 学生 ID
 * @example getStudentProfileUrl('s001') // '/students/s001'
 */
export function getStudentProfileUrl(studentId: string): string {
	return ROUTES.studentProfile.replace(':studentId', encodeURIComponent(studentId))
}

/**
 * 生成考试详情页面的 URL
 * @param examId 考试 ID
 * @example getExamDetailUrl('exam-001') // '/exams/exam-001'
 */
export function getExamDetailUrl(examId: string): string {
	return ROUTES.examDetail.replace(':examId', encodeURIComponent(examId))
}

// ============================================
// Deep-Link 路由列表（用于测试和文档）
// ============================================

/**
 * 所有支持 deep-link 的参数化路由
 * 用于 E2E 测试和文档生成
 */
export const DEEP_LINK_ROUTES = [
	{ path: '/live/:courseId', param: 'courseId', example: '/live/course-live-1', helper: 'getLiveTeachingUrl' },
	{ path: '/courses/:courseId', param: 'courseId', example: '/courses/course-001', helper: 'getCourseDetailUrl' },
	{ path: '/courses/:courseId/edit', param: 'courseId', example: '/courses/course-001/edit', helper: 'getCourseEditUrl' },
	{ path: '/recordings/:recordingId', param: 'recordingId', example: '/recordings/rec-001', helper: 'getRecordingDetailUrl' },
	{ path: '/assignments/:assignmentId', param: 'assignmentId', example: '/assignments/assign-101', helper: 'getAssignmentDetailUrl' },
	{ path: '/assignments/:assignmentId/grading', param: 'assignmentId', example: '/assignments/assign-101/grading', helper: 'getAssignmentGradingUrl' },
	{ path: '/students/:studentId', param: 'studentId', example: '/students/s001', helper: 'getStudentProfileUrl' },
	{ path: '/exams/:examId', param: 'examId', example: '/exams/exam-001', helper: 'getExamDetailUrl' }
] as const

// ============================================
// 路由元数据（用于权限检查和 SSR）
// ============================================

export interface RouteMetadata {
	path: string
	title: string
	requiresAuth: boolean
	roles?: ('teacher' | 'student' | 'admin')[]
	isDeepLinkable: boolean
	lazyLoad: boolean
	shell: 'public' | 'main' | 'detail' | 'immersive'
}

/**
 * 路由元数据表
 * TODO: confirm with backend - 权限字段名称
 */
export const ROUTE_METADATA: Record<string, RouteMetadata> = {
	[ROUTES.login]: {
		path: ROUTES.login,
		title: '登录',
		requiresAuth: false,
		isDeepLinkable: false,
		lazyLoad: false,
		shell: 'public'
	},
	[ROUTES.dashboard]: {
		path: ROUTES.dashboard,
		title: '教学总览',
		requiresAuth: true,
		roles: ['teacher', 'admin'],
		isDeepLinkable: false,
		lazyLoad: false,
		shell: 'main'
	},
	[ROUTES.courseDetail]: {
		path: ROUTES.courseDetail,
		title: '课程详情',
		requiresAuth: true,
		roles: ['teacher', 'admin'],
		isDeepLinkable: true,
		lazyLoad: true,
		shell: 'detail'
	},
	[ROUTES.liveTeachingWithCourse]: {
		path: ROUTES.liveTeachingWithCourse,
		title: '直播授课',
		requiresAuth: true,
		roles: ['teacher'],
		isDeepLinkable: true,
		lazyLoad: true,
		shell: 'immersive'
	}
	// ... 其他路由元数据
}

// ============================================
// 向后兼容重定向（旧路由 -> 新路由）
// ============================================

/**
 * 旧路由到新路由的重定向映射
 * 用于保持向后兼容性
 */
export const ROUTE_REDIRECTS: Array<{ from: string; to: string }> = [
	// 示例：旧的作业批改路由
	// { from: '/grading/:assignmentId', to: '/assignments/:assignmentId/grading' },
	// 示例：旧的课程路由
	// { from: '/course/:id', to: '/courses/:courseId' },
]
