/**
 * 来源 HTML: screen_id: e2ff3e9e9b5148b28a6741d0c8901e64
 * Generated from Stitch export
 */
import React from 'react'
import { type AssignmentStatus as DomainAssignmentStatus } from '@/types/models/assignment'

export type AssignmentStatus = DomainAssignmentStatus

export interface AssignmentItemProps {
	id: string
	title: string
	classLabel?: string
	submittedAt?: string
	ungradedCount?: number
	status: AssignmentStatus
	note?: string
	size?: string
	onClick?: (id: string) => void
	onAction?: (id: string) => void
}

// TODO: align badge styles across dashboards/assignments pages if design updates
const badgeClass: Record<AssignmentStatus, string> = {
	urgent: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300',
	normal: 'bg-input-bg dark:bg-slate-700 text-text-secondary',
	completed: 'bg-green-50 text-green-600',
	review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
	pending: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
	draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
	published: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
	closed: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
}

const statusLabel: Record<AssignmentStatus, string> = {
	urgent: '加急',
	normal: '普通',
	completed: '已完成',
	review: '待复核',
	pending: '待处理',
	draft: '草稿',
	published: '已发布',
	closed: '已关闭'
}

const AssignmentItem: React.FC<AssignmentItemProps> = ({ id, title, classLabel, submittedAt, ungradedCount, status, note, size, onClick, onAction }) => {
	const isDone = status === 'completed'
	return (
		<li
			className={`bg-white dark:bg-slate-800/50 hover:bg-input-bg dark:hover:bg-slate-700/80 p-3 rounded-lg cursor-pointer transition-colors group border border-transparent hover:border-border-color dark:hover:border-slate-600 ${isDone ? 'opacity-70 hover:opacity-100' : ''}`}
			onClick={() => onClick?.(id)}
			role="listitem"
			aria-label={title}
		>
			<div className="flex justify-between mb-1.5">
				{classLabel ? <span className={`text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded uppercase ${badgeClass[status]}`}>{classLabel}</span> : <span className={`text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded uppercase ${badgeClass[status]}`}>{statusLabel[status]}</span>}
				{submittedAt ? <span className="text-[10px] text-text-secondary">{submittedAt}</span> : null}
			</div>
			<h4 className="font-bold text-text-main dark:text-slate-200 text-sm mb-3 group-hover:text-primary transition-colors line-clamp-1">{title}</h4>
			<div className="flex items-center justify-between">
				<div className="text-xs text-text-secondary font-medium flex items-center gap-2">
					{typeof ungradedCount === 'number' ? <span>未批：{ungradedCount} 份</span> : null}
					{size ? <span>{size}</span> : null}
					{note ? <span className="flex items-center gap-1 text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded text-[11px]">{note}</span> : null}
				</div>
				{isDone ? (
					<span className="text-[10px] font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded" aria-label="已完成">
						<span className="material-symbols-outlined text-sm">check</span> 已完成
					</span>
				) : (
						<button
							type="button"
							className="text-[10px] font-bold bg-white dark:bg-slate-600 border border-border-color dark:border-slate-500 px-2 py-1 rounded text-text-main dark:text-slate-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors shadow-sm"
							onClick={(e: any) => {
								e.stopPropagation()
								onAction?.(id)
							}}
							aria-label="处理作业"
						>
						去批改
					</button>
				)}
			</div>
		</li>
	)
}

export default AssignmentItem
