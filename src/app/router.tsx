/**
 * 应用路由配置
 * 
 * 路由分为四个 Shell 布局：
 * - PublicShellPage: 公开页面（登录）
 * - MainShellPage: 主布局（带侧边栏）
 * - DetailShellPage: 详情布局（返回导航）
 * - ImmersiveShellPage: 沉浸式布局（直播）
 * 
 * Deep-Link 支持的路由（参见 spec/routes.md）：
 * - /live/:courseId
 * - /courses/:courseId
 * - /courses/:courseId/edit
 * - /recordings/:recordingId
 * - /assignments/:assignmentId
 * - /assignments/:assignmentId/grading
 * - /students/:studentId
 * - /exams/:examId
 * 
 * @see src/app/routes.ts 路由常量和 URL helpers
 * @see spec/routes.md 完整路由规范
 */
import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import DetailShellPage from '../pages/shell/DetailShellPage'
import ImmersiveShellPage from '../pages/shell/ImmersiveShellPage'
import MainShellPage from '../pages/shell/MainShellPage'
import PublicShellPage from '../pages/shell/PublicShellPage'
import AssignmentManagementPage from '../pages/assignments/AssignmentManagementPage'
import AssignmentDetailPage from '../pages/assignments/AssignmentDetailPage'
import GradebookPage from '../pages/assignments/GradebookPage'
import GradingWorkspacePage from '../pages/assignments/GradingWorkspacePage'
import CollaborationReviewPage from '../pages/collaboration/CollaborationReviewPage'
import CourseDetailPage from '../pages/courses/CourseDetailPage'
import CourseSchedulePage from '../pages/courses/CourseSchedulePage'
import CourseEditPage from '../pages/courses/CourseEditPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import InboxPage from '../pages/notifications/InboxPage'
import RecordingLibraryPage from '../pages/recordings/RecordingLibraryPage'
import RecordingDetailPage from '../pages/recordings/RecordingDetailPage'
import ResourceLibraryPage from '../pages/resources/ResourceLibraryPage'
import UploadResourcePage from '../pages/resources/UploadResourcePage'
import SettingsPage from '../pages/settings/SettingsPage'
import StudentListPage from '../pages/students/StudentListPage'
import StudentProfilePage from '../pages/students/StudentProfilePage'
import NewAssignmentPage from '../pages/assignments/NewAssignmentPage'
import TeachingAnalyticsPage from '../pages/analytics/TeachingAnalyticsPage'
import ExamManagementPage from '../pages/exams/ExamManagementPage'
import QuestionBankPage from '../pages/question-bank/QuestionBankPage'
import NotFoundPage from '../pages/NotFoundPage'
import { ROUTES, ROUTE_REDIRECTS } from './routes'
import LiveTeachingRoutePage from '../pages/shell/LiveTeachingRoutePage'
import LoginPage from '../pages/auth/LoginPage'

// ============================================
// 懒加载组件示例（生产优化）
// ============================================
// const LazyLiveTeachingPage = React.lazy(() => import('../pages/live/LiveTeachingPage'))
// const LazyCourseDetailPage = React.lazy(() => import('../pages/courses/CourseDetailPage'))

const router = createBrowserRouter([
	// ================================
	// 公开页面（无需登录）
	// ================================
	{
		element: <PublicShellPage />,
		children: [
			{ path: ROUTES.login, element: <LoginPage />, handle: { title: '登录' } }
		]
	},

	// ================================
	// 主布局页面（带侧边栏）
	// ================================
	{
		element: <MainShellPage />,
		children: [
			// 首页
			{ path: ROUTES.dashboard, element: <DashboardPage />, handle: { title: '教学总览' } },
			
			// 课程模块
			{ path: ROUTES.courseSchedule, element: <CourseSchedulePage />, handle: { title: '课程日程' } },
			{ path: ROUTES.courseScheduleNew, element: <CourseSchedulePage />, handle: { title: '新建课程日程' } },
			
			// 录播模块
			{ path: ROUTES.recordings, element: <RecordingLibraryPage />, handle: { title: '录播库' } },
			{ path: ROUTES.recordingDetail, element: <RecordingDetailPage />, handle: { title: '录播详情' } },
			
			// 资源模块
			{ path: ROUTES.resourceLibrary, element: <ResourceLibraryPage />, handle: { title: '教学资源库' } },
			{ path: ROUTES.resourceUpload, element: <UploadResourcePage />, handle: { title: '上传资源' } },
			
			// 作业模块（注意路由顺序：具体路由在前，通配路由在后）
			{ path: ROUTES.assignmentNew, element: <NewAssignmentPage />, handle: { title: '新建作业' } },
			{ path: ROUTES.assignmentGrading, element: <GradingWorkspacePage />, handle: { title: '作业批改' } },
			{ path: ROUTES.assignmentDetail, element: <AssignmentDetailPage />, handle: { title: '作业详情' } },
			{ path: ROUTES.assignmentManagement, element: <AssignmentManagementPage />, handle: { title: '作业管理' } },
			{ path: ROUTES.gradingWorkspace, element: <GradingWorkspacePage />, handle: { title: '批改工作室' } },
			{ path: ROUTES.gradebook, element: <GradebookPage />, handle: { title: '成绩册' } },
			
			// 考试模块
			{ path: ROUTES.examManagement, element: <ExamManagementPage />, handle: { title: '考试管理' } },
			{ path: ROUTES.examDetail, element: <ExamManagementPage />, handle: { title: '考试详情' } },
			
			// 学生模块
			{ path: ROUTES.studentList, element: <StudentListPage />, handle: { title: '学生列表' } },
			
			// 其他模块
			{ path: ROUTES.teachingAnalytics, element: <TeachingAnalyticsPage />, handle: { title: '教学分析' } },
			{ path: ROUTES.inbox, element: <InboxPage />, handle: { title: '收件箱' } },
			{ path: ROUTES.settings, element: <SettingsPage />, handle: { title: '系统设置' } },
			{ path: ROUTES.collaborationReview, element: <CollaborationReviewPage />, handle: { title: '协作审核' } },
			{ path: ROUTES.questionBank, element: <QuestionBankPage />, handle: { title: '题库与试题管理' } },
			
			// 404 兜底（必须放在最后）
			{ path: '*', element: <NotFoundPage />, handle: { title: '未找到' } }
		]
	},

	// ================================
	// 详情布局页面（带返回导航）
	// ================================
	{
		element: <DetailShellPage />,
		children: [
			// 课程详情（Deep-Link）
			{ path: ROUTES.courseDetail, element: <CourseDetailPage />, handle: { title: '课程详情' } },
			{ path: ROUTES.courseEdit, element: <CourseEditPage />, handle: { title: '编辑课程' } },
			// 学生档案（Deep-Link）
			{ path: ROUTES.studentProfile, element: <StudentProfilePage />, handle: { title: '学生档案' } }
		]
	},

	// ================================
	// 沉浸式布局页面（直播）
	// ================================
	{
		element: <ImmersiveShellPage />,
		children: [
			// 参数化路由必须放在前面，以便正确匹配 /live/:courseId
			{ path: ROUTES.liveTeachingWithCourse, element: <LiveTeachingRoutePage />, handle: { title: '直播授课' } },
			// /live 作为默认入口（无 courseId 时使用默认课程）
			{ path: ROUTES.liveTeaching, element: <LiveTeachingRoutePage />, handle: { title: '直播授课' } }
		]
	},

	// ================================
	// 向后兼容重定向
	// ================================
	...ROUTE_REDIRECTS.map(({ from, to }) => ({
		path: from,
		element: <Navigate to={to} replace />
	}))
])

export default router
