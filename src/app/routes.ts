export const ROUTES = {
	login: '/login',
	dashboard: '/',
	courseSchedule: '/courses/schedule',
	courseDetail: '/courses/:courseId',
	courseEdit: '/courses/:courseId/edit',
	// 直播教学路由
	liveTeaching: '/live',
	liveTeachingWithCourse: '/live/:courseId',
	recordings: '/recordings',
	resourceLibrary: '/resources',
	assignmentManagement: '/assignments',
	gradingWorkspace: '/assignments/grading',
	gradebook: '/assignments/gradebook',
	examManagement: '/exams',
	studentList: '/students',
	studentProfile: '/students/:studentId',
	questionBank: '/question-bank',
	teachingAnalytics: '/analytics',
	inbox: '/inbox',
	settings: '/settings',
	collaborationReview: '/collaboration/review'
} as const

export type AppRouteKey = keyof typeof ROUTES

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
