// 来源 HTML: online_study/作业管理
import React from 'react'
import AssignmentItem from '../../../components/cards/AssignmentItem'
import type { Assignment, AssignmentStatus } from '@/types/models/assignment'
import type { AssignmentFilters, AssignmentPagination } from '../hooks/useAssignments'

export interface AssignmentListProps {
	assignments: Assignment[]
	onSelect?: (id: string) => void
	onAction?: (id: string) => void
	onFilterChange?: (filters: AssignmentFilters) => void
	pagination?: AssignmentPagination
	onPageChange?: (page: number) => void
}

const AssignmentList: React.FC<AssignmentListProps> = ({ assignments, onSelect, onAction, onFilterChange, pagination, onPageChange }) => {
	const [courseId, setCourseId] = React.useState<string>('')
	const [status, setStatus] = React.useState<AssignmentStatus | ''>('')
	const [dueBefore, setDueBefore] = React.useState<string>('')

	React.useEffect(() => {
		onFilterChange?.({ courseId: courseId || undefined, status: (status as AssignmentStatus) || undefined, dueBefore: dueBefore || undefined })
	}, [courseId, status, dueBefore, onFilterChange])

	return (
		<section className="space-y-4">
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
				<label className="flex flex-col gap-1 text-xs text-text-secondary">
					课程 ID
					<input className="h-9 px-3 rounded-lg border border-border-light bg-white text-sm" placeholder="输入 courseId" value={courseId} onChange={(e) => setCourseId(e.target.value)} />
				</label>
				<label className="flex flex-col gap-1 text-xs text-text-secondary">
					状态
					<select className="h-9 px-3 rounded-lg border border-border-light bg-white text-sm" value={status} onChange={(e) => setStatus((e.target.value || '') as AssignmentStatus | '')}>
						<option value="">全部</option>
						<option value="draft">草稿</option>
						<option value="published">已发布</option>
						<option value="closed">已关闭</option>
						<option value="pending">待处理</option>
						<option value="review">待复核</option>
						<option value="completed">已完成</option>
						<option value="urgent">加急</option>
						<option value="normal">普通</option>
					</select>
				</label>
				<label className="flex flex-col gap-1 text-xs text-text-secondary">
					截止日期
					<input className="h-9 px-3 rounded-lg border border-border-light bg-white text-sm" type="date" value={dueBefore} onChange={(e) => setDueBefore(e.target.value)} />
				</label>
			</div>

			<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="list">
				{assignments.map((assignment) => (
					<AssignmentItem key={assignment.id} {...assignment} status={assignment.status} onClick={onSelect} onAction={onAction} />
				))}
			</ul>

			{assignments.length === 0 ? <div className="text-sm text-text-secondary">暂无作业，调整筛选或新建一个。</div> : null}

			{pagination ? (
				<div className="flex items-center justify-between text-xs text-text-secondary">
					<div>
						第 {pagination.page} 页，共 {Math.ceil(Math.max(1, pagination.total) / pagination.pageSize)} 页（{pagination.total} 条）
					</div>
					<div className="flex items-center gap-2">
						<button className="px-2 py-1 rounded border border-border-light disabled:opacity-50" onClick={() => onPageChange?.(Math.max(1, pagination.page - 1))} disabled={pagination.page <= 1}>
							上一页
						</button>
						<button className="px-2 py-1 rounded border border-border-light disabled:opacity-50" onClick={() => onPageChange?.(pagination.page + 1)} disabled={pagination.page * pagination.pageSize >= pagination.total}>
							下一页
						</button>
					</div>
				</div>
			) : null}
		</section>
	)
}

export default AssignmentList
