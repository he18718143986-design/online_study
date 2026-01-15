/**
 * 批改工作室页面
 * 
 * 支持两种访问方式：
 * 1. /assignments/:assignmentId/grading - 通过路径参数指定作业（推荐，Deep-Link）
 * 2. /assignments/grading?assignmentId=xxx - 通过查询参数指定作业（兼容）
 * 3. /assignments/grading - 无参数时显示作业选择器
 */
import React from 'react'
import { useAssignmentId } from '@/hooks/useRouteId'
import GradingWorkspace from '../../modules/assignments/grading/GradingWorkspace'

const GradingWorkspacePage: React.FC = () => {
	// 使用统一的路由参数获取 hook
	// 优先级：路径参数 > 查询参数 > fallback
	const { id: assignmentId, source } = useAssignmentId()

	// 如果没有指定作业 ID，显示提示或选择器
	if (!assignmentId) {
		return (
			<div className="p-6">
				<div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-8 text-center">
					<span className="material-symbols-outlined text-5xl text-text-secondary mb-4">grading</span>
					<h1 className="text-xl font-bold text-text-main dark:text-white mb-2">批改工作室</h1>
					<p className="text-sm text-text-secondary mb-4">
						请从作业列表选择一份作业开始批改
					</p>
					<a
						href="/assignments"
						className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm"
					>
						<span className="material-symbols-outlined text-lg">assignment</span>
						前往作业列表
					</a>
				</div>
			</div>
		)
	}

	return (
		<div data-testid="grading-workspace-page" data-assignment-id={assignmentId}>
			<GradingWorkspace assignmentId={assignmentId} />
		</div>
	)
}

export default GradingWorkspacePage
