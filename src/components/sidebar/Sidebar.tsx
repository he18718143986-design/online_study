import React from 'react'
import { ROUTES } from '../../app/routes'

export interface SidebarProps {
	onNavigate?: (to: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
	return (
		<aside className="w-60 bg-surface-light border-r border-border-light h-screen sticky top-0 p-4" aria-label="主导航">
			<nav className="space-y-2 text-sm">
				<button type="button" className="block w-full text-left px-3 py-2 rounded hover:bg-input-bg" onClick={() => onNavigate?.(ROUTES.dashboard)} aria-label="教学总览">
					教学总览
				</button>
				<button type="button" className="block w-full text-left px-3 py-2 rounded hover:bg-input-bg" onClick={() => onNavigate?.(ROUTES.courseSchedule)} aria-label="课程日程与班级花名册">
					课程日程
				</button>
				<button type="button" className="block w-full text-left px-3 py-2 rounded hover:bg-input-bg" onClick={() => onNavigate?.(ROUTES.assignmentManagement)} aria-label="作业管理">
					作业管理
				</button>
				<button type="button" className="block w-full text-left px-3 py-2 rounded hover:bg-input-bg" onClick={() => onNavigate?.(ROUTES.gradingWorkspace)} aria-label="批改工作室">
					批改工作室
				</button>
				<button type="button" className="block w-full text-left px-3 py-2 rounded hover:bg-input-bg" onClick={() => onNavigate?.(ROUTES.gradebook)} aria-label="成绩册">
					成绩册
				</button>
				<button type="button" className="block w-full text-left px-3 py-2 rounded hover:bg-input-bg" onClick={() => onNavigate?.(ROUTES.examManagement)} aria-label="考试管理">
					考试管理
				</button>
				<button type="button" className="block w-full text-left px-3 py-2 rounded hover:bg-input-bg" onClick={() => onNavigate?.(ROUTES.questionBank)} aria-label="题库与试题管理">
					题库与试题管理
				</button>
				<button type="button" className="block w-full text-left px-3 py-2 rounded hover:bg-input-bg" onClick={() => onNavigate?.(ROUTES.recordings)} aria-label="录播与媒体库">
					录播与媒体库
				</button>
				<button type="button" className="block w-full text-left px-3 py-2 rounded hover:bg-input-bg" onClick={() => onNavigate?.(ROUTES.resourceLibrary)} aria-label="教学资源库">
					教学资源库
				</button>
				<button type="button" className="block w-full text-left px-3 py-2 rounded hover:bg-input-bg" onClick={() => onNavigate?.(ROUTES.teachingAnalytics)} aria-label="报表与教学分析">
					报表与教学分析
				</button>
				<button type="button" className="block w-full text-left px-3 py-2 rounded hover:bg-input-bg" onClick={() => onNavigate?.(ROUTES.studentList)} aria-label="学生管理">
					学生管理
				</button>
				<button type="button" className="block w-full text-left px-3 py-2 rounded hover:bg-input-bg" onClick={() => onNavigate?.(ROUTES.inbox)} aria-label="通知与收件箱">
					通知与收件箱
				</button>
				<button type="button" className="block w-full text-left px-3 py-2 rounded hover:bg-input-bg" onClick={() => onNavigate?.(ROUTES.collaborationReview)} aria-label="协作与审核">
					协作与审核
				</button>
				<button type="button" className="block w-full text-left px-3 py-2 rounded hover:bg-input-bg" onClick={() => onNavigate?.(ROUTES.settings)} aria-label="系统设置与权限">
					系统设置与权限
				</button>
				<button type="button" className="block w-full text-left px-3 py-2 rounded hover:bg-input-bg" onClick={() => onNavigate?.(ROUTES.liveTeaching)} aria-label="直播授课">
					直播授课
				</button>
			</nav>
		</aside>
	)
}

export default Sidebar
