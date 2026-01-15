/**
 * 作业详情页面 - 支持 Deep-Link
 * 
 * 路由：/assignments/:assignmentId
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssignmentId } from '@/hooks/useRouteId'
import assignmentsService from '@/services/assignments.service'
import type { Assignment } from '@/types/models/assignment'
import { ROUTES, getCourseDetailUrl, getGradingWorkspaceUrl, getAssignmentGradingUrl } from '@/app/routes'

const AssignmentDetailPage: React.FC = () => {
	const navigate = useNavigate()
	const { id: assignmentId, source } = useAssignmentId()

	const [assignment, setAssignment] = React.useState<Assignment | null>(null)
	const [isLoading, setIsLoading] = React.useState(true)
	const [error, setError] = React.useState<Error | null>(null)

	// 加载作业详情
	React.useEffect(() => {
		if (!assignmentId) {
			setError(new Error('未指定作业 ID'))
			setIsLoading(false)
			return
		}

		let cancelled = false

		const fetchAssignment = async () => {
			setIsLoading(true)
			setError(null)
			try {
				const data = await assignmentsService.get(assignmentId)
				if (cancelled) return
				if (!data) {
					setError(new Error(`作业不存在：${assignmentId}`))
				} else {
					setAssignment(data)
				}
			} catch (err) {
				if (cancelled) return
				setError(err as Error)
			} finally {
				if (!cancelled) {
					setIsLoading(false)
				}
			}
		}

		void fetchAssignment()

		return () => {
			cancelled = true
		}
	}, [assignmentId])

	const handleBack = React.useCallback(() => {
		navigate(ROUTES.assignmentManagement)
	}, [navigate])

	const handleGoToCourse = React.useCallback(() => {
		if (assignment?.courseId) {
			navigate(getCourseDetailUrl(assignment.courseId))
		}
	}, [navigate, assignment?.courseId])

	const handleGrade = React.useCallback(() => {
		if (assignmentId) {
			// 使用参数化路由 /assignments/:assignmentId/grading
			navigate(getAssignmentGradingUrl(assignmentId))
		}
	}, [navigate, assignmentId])

	// 获取状态标签样式
	const getStatusStyle = (status?: string) => {
		switch (status) {
			case 'published':
				return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
			case 'draft':
				return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
			case 'closed':
				return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
			default:
				return 'bg-gray-100 text-gray-600'
		}
	}

	const getStatusText = (status?: string) => {
		switch (status) {
			case 'published': return '已发布'
			case 'draft': return '草稿'
			case 'closed': return '已关闭'
			default: return status || '未知'
		}
	}

	// 错误状态
	if (error) {
		return (
			<div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-6">
				<div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-lg p-8 max-w-md text-center">
					<span className="material-symbols-outlined text-5xl text-red-500 mb-4">error</span>
					<h1 className="text-xl font-bold text-text-main dark:text-white mb-2">作业加载失败</h1>
					<p className="text-sm text-text-secondary mb-4">{error.message}</p>
					<div className="flex items-center justify-center gap-3">
						<button
							onClick={handleBack}
							className="px-4 py-2 rounded-lg border border-border-light dark:border-border-dark text-sm"
						>
							返回列表
						</button>
						<button
							onClick={() => window.location.reload()}
							className="px-4 py-2 rounded-lg bg-primary text-white text-sm"
						>
							重试
						</button>
					</div>
				</div>
			</div>
		)
	}

	// 加载状态
	if (isLoading) {
		return (
			<div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
					<p className="text-sm text-text-secondary">加载作业详情...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="p-6 space-y-6" data-testid="assignment-detail-page">
			{/* 面包屑导航 */}
			<nav className="flex items-center text-sm text-text-secondary">
				<button onClick={handleBack} className="hover:text-primary">
					作业管理
				</button>
				<span className="mx-2">/</span>
				<span className="text-text-main dark:text-white font-medium" data-testid="assignment-title">
					{assignment?.title || '作业详情'}
				</span>
			</nav>

			{/* 作业卡片 */}
			{assignment && (
				<div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
					{/* 头部 */}
					<div className="px-6 py-5 border-b border-border-light dark:border-border-dark">
						<div className="flex items-start justify-between gap-4">
							<div>
								<h1 className="text-xl font-bold text-text-main dark:text-white">
									{assignment.title}
								</h1>
								<p className="text-sm text-text-secondary mt-1">
									ID: <span data-testid="assignment-id-display">{assignmentId}</span>
								</p>
							</div>
							<span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(assignment.status)}`}>
								{getStatusText(assignment.status)}
							</span>
						</div>
					</div>

					{/* 详情内容 */}
					<div className="px-6 py-5 space-y-6">
						{/* 基本信息 */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
								<div className="text-xs text-text-secondary mb-1">所属课程</div>
								<button
									onClick={handleGoToCourse}
									className="text-sm font-medium text-primary hover:underline"
								>
									{assignment.courseId}
								</button>
							</div>
							<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
								<div className="text-xs text-text-secondary mb-1">截止日期</div>
								<div className="text-sm font-medium text-text-main dark:text-white">
									{assignment.dueAt ? new Date(assignment.dueAt).toLocaleString('zh-CN') : '未设置'}
								</div>
							</div>
							<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
								<div className="text-xs text-text-secondary mb-1">总分</div>
								<div className="text-sm font-medium text-text-main dark:text-white">
									{assignment.totalPoints || 0} 分
								</div>
							</div>
							<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
								<div className="text-xs text-text-secondary mb-1">提交情况</div>
								<div className="text-sm font-medium text-text-main dark:text-white">
									{assignment.submissionsCount || 0} 份提交
									{assignment.ungradedCount ? (
										<span className="text-amber-600 ml-1">
											({assignment.ungradedCount} 待批改)
										</span>
									) : null}
								</div>
							</div>
						</div>

						{/* 作业描述 */}
						{assignment.description && (
							<div>
								<h3 className="text-sm font-semibold text-text-main dark:text-white mb-2">作业说明</h3>
								<p className="text-sm text-text-secondary whitespace-pre-wrap">
									{assignment.description}
								</p>
							</div>
						)}
					</div>

					{/* 操作按钮 */}
					<div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-border-light dark:border-border-dark flex items-center justify-between">
						<button
							onClick={handleBack}
							className="px-4 py-2 rounded-lg border border-border-light dark:border-border-dark text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
						>
							返回列表
						</button>
						<div className="flex items-center gap-3">
							<button
								onClick={handleGrade}
								className="px-4 py-2 rounded-lg bg-primary text-white text-sm shadow hover:shadow-md"
							>
								<span className="material-symbols-outlined text-sm align-middle mr-1">grading</span>
								开始批改
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default AssignmentDetailPage
