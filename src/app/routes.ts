export const ROUTES = {
	login: '/login',
	dashboard: '/',
	courseSchedule: '/courses/schedule',
	courseDetail: '/courses/:courseId',
	courseEdit: '/courses/:courseId/edit',
	liveTeaching: '/live',
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
