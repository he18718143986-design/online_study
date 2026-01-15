import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import DetailShellPage from '../pages/shell/DetailShellPage'
import ImmersiveShellPage from '../pages/shell/ImmersiveShellPage'
import MainShellPage from '../pages/shell/MainShellPage'
import PublicShellPage from '../pages/shell/PublicShellPage'
import AssignmentManagementPage from '../pages/assignments/AssignmentManagementPage'
import GradebookPage from '../pages/assignments/GradebookPage'
import GradingWorkspacePage from '../pages/assignments/GradingWorkspacePage'
import CollaborationReviewPage from '../pages/collaboration/CollaborationReviewPage'
import CourseDetailPage from '../pages/courses/CourseDetailPage'
import CourseSchedulePage from '../pages/courses/CourseSchedulePage'
import CourseEditPage from '../pages/courses/CourseEditPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import InboxPage from '../pages/notifications/InboxPage'
import RecordingLibraryPage from '../pages/recordings/RecordingLibraryPage'
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
import { ROUTES } from './routes'
import LiveTeachingRoutePage from '../pages/shell/LiveTeachingRoutePage'
import LoginPage from '../pages/auth/LoginPage'

const router = createBrowserRouter([
	{
		element: <PublicShellPage />,
		children: [{ path: ROUTES.login, element: <LoginPage />, handle: { title: '登录' } }]
	},
	{
		element: <MainShellPage />,
		children: [
			{ path: ROUTES.dashboard, element: <DashboardPage />, handle: { title: '教学总览' } },
			{ path: ROUTES.courseSchedule, element: <CourseSchedulePage />, handle: { title: '课程日程' } },
			{ path: ROUTES.recordings, element: <RecordingLibraryPage />, handle: { title: '录播库' } },
			{ path: ROUTES.resourceLibrary, element: <ResourceLibraryPage />, handle: { title: '教学资源库' } },
			{ path: `${ROUTES.resourceLibrary}/upload`, element: <UploadResourcePage />, handle: { title: '上传资源' } },
			{ path: ROUTES.assignmentManagement, element: <AssignmentManagementPage />, handle: { title: '作业管理' } },
			{ path: `${ROUTES.assignmentManagement}/new`, element: <NewAssignmentPage />, handle: { title: '新建作业' } },
			{ path: ROUTES.gradebook, element: <GradebookPage />, handle: { title: '成绩册' } },
			{ path: ROUTES.examManagement, element: <ExamManagementPage />, handle: { title: '考试管理' } },
			{ path: ROUTES.studentList, element: <StudentListPage />, handle: { title: '学生列表' } },
			{ path: ROUTES.teachingAnalytics, element: <TeachingAnalyticsPage />, handle: { title: '教学分析' } },
			{ path: ROUTES.inbox, element: <InboxPage />, handle: { title: '收件箱' } },
			{ path: ROUTES.settings, element: <SettingsPage />, handle: { title: '系统设置' } },
			{ path: ROUTES.collaborationReview, element: <CollaborationReviewPage />, handle: { title: '协作审核' } },
			{ path: ROUTES.questionBank, element: <QuestionBankPage />, handle: { title: '题库与试题管理' } },
			{ path: '*', element: <NotFoundPage />, handle: { title: '未找到' } }
		]
	},
	{
		element: <DetailShellPage />,
		children: [
			{ path: ROUTES.courseDetail, element: <CourseDetailPage />, handle: { title: '课程详情' } },
			{ path: ROUTES.courseEdit, element: <CourseEditPage />, handle: { title: '编辑课程' } },
			{ path: ROUTES.studentProfile, element: <StudentProfilePage />, handle: { title: '学生档案' } },
			{ path: ROUTES.gradingWorkspace, element: <GradingWorkspacePage />, handle: { title: '批改工作室' } }
		]
	},
	{
		element: <ImmersiveShellPage />,
		children: [
			// 参数化路由必须放在前面，以便正确匹配 /live/:courseId
			{ path: ROUTES.liveTeachingWithCourse, element: <LiveTeachingRoutePage />, handle: { title: '直播授课' } },
			// /live 作为默认入口（无 courseId 时使用默认课程）
			{ path: ROUTES.liveTeaching, element: <LiveTeachingRoutePage />, handle: { title: '直播授课' } }
		]
	}
])

export default router
