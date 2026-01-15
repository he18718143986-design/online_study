import React from 'react'
import type { MasterySnapshot, SubmissionRecord } from '../hooks/useStudentProfile'

export interface ProgressTimelineProps {
	mastery: MasterySnapshot[]
	submissions: SubmissionRecord[]
	onAssignmentSelect?: (assignmentId: string) => void
}

const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ mastery, submissions, onAssignmentSelect }) => {
	return (
		<div className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-4 flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-lg font-bold text-text-main">学习进度与提交</h2>
					<p className="text-sm text-text-secondary">掌握度趋势与作业提交历史</p>
				</div>
				<div className="text-xs text-text-secondary">数据为占位，等待接入图表组件</div>
			</div>

			<div className="h-48 rounded-lg border border-dashed border-border-light dark:border-border-dark flex items-center justify-center text-text-secondary text-sm bg-background-light/50">
				图表占位：知识点掌握度趋势
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<h3 className="text-sm font-semibold text-text-main">知识点掌握度</h3>
					<ul className="divide-y divide-border-light dark:divide-border-dark">
						{mastery.map((item) => (
							<li key={item.topic} className="py-2 flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-text-main">{item.topic}</p>
									<p className="text-xs text-text-secondary">掌握度 {Math.round(item.mastery * 100)}%</p>
								</div>
								<span
									className={`material-symbols-outlined text-[18px] ${
										item.trend === 'up' ? 'text-green-500' : item.trend === 'down' ? 'text-red-500' : 'text-gray-400'
									}`}
								>
									{item.trend === 'up' ? 'trending_up' : item.trend === 'down' ? 'trending_down' : 'drag_indicator'}
								</span>
							</li>
						))}
					</ul>
				</div>
				<div className="space-y-2">
					<h3 className="text-sm font-semibold text-text-main">提交历史</h3>
					<ul className="divide-y divide-border-light dark:divide-border-dark">
						{submissions.map((submission) => (
							<li key={submission.id} className="py-2 flex items-center justify-between gap-3">
								<div>
									<p className="text-sm font-medium text-text-main">{submission.title}</p>
									<p className="text-xs text-text-secondary">{submission.submittedAt ?? '未提交'} · {submission.status === 'missing' ? '缺交' : submission.status === 'late' ? '迟交' : '按时提交'}</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-semibold text-text-main">{submission.score ?? '--'}</p>
									{onAssignmentSelect ? (
										<button
											type="button"
											onClick={() => onAssignmentSelect(submission.assignmentId)}
											className="text-xs text-primary hover:text-primary-hover"
										>
											查看作业
										</button>
									) : (
										<span className="text-xs text-text-secondary">查看作业</span>
									)}
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}

export default ProgressTimeline
