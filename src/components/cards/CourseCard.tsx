/**
 * 来源 HTML: screen_id: e2ff3e9e9b5148b28a6741d0c8901e64
 * Generated from Stitch export
 */
import React from 'react'
import { type CourseStatus } from '@/types/models/course'

export type CourseCardStatus = Extract<CourseStatus, 'live' | 'upcoming' | 'completed' | 'ongoing' | 'pending'>

export interface CourseCardProps {
	id: string
	title: string
	description?: string
	classLabel?: string
	timeRange: string
	studentsCount: number
	status: CourseCardStatus
	onEnter?: (courseId: string) => void
	onMore?: (courseId: string) => void
}

// TODO: consider lifting status copy/variants to a global config if more states are added
const statusBadge: Record<CourseCardStatus, string> = {
	live: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
	upcoming: 'bg-input-bg text-text-secondary dark:bg-slate-700 dark:text-slate-400',
	ongoing: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
	completed: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
	pending: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
}

const statusLabel: Record<CourseCardStatus, string> = {
	live: '直播中',
	ongoing: '进行中',
	upcoming: '未开始',
	completed: '已结束',
	pending: '待排课'
}

const CourseCard: React.FC<CourseCardProps> = ({ id, title, description, classLabel, timeRange, studentsCount, status, onEnter, onMore }) => {
	const canEnter = status === 'live' || status === 'ongoing'
	return (
		<article className="bg-surface-light dark:bg-surface-dark rounded-xl p-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-border-color dark:border-slate-700 flex flex-col relative overflow-hidden group hover:border-primary/30 transition-all" role="listitem">
			{status === 'live' ? <div className="h-1 w-full bg-primary absolute top-0 left-0" aria-hidden /> : null}
			<div className="p-5 flex flex-col h-full gap-3">
				<div className="flex justify-between items-start">
					<span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wide flex items-center gap-1 ${statusBadge[status]}`}>
						{status === 'live' || status === 'ongoing' ? <span className="size-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden /> : null}
						{statusLabel[status]}
					</span>
					<button type="button" className="text-text-secondary hover:text-text-main" aria-label="课程更多操作" onClick={() => onMore?.(id)}>
						<span className="material-symbols-outlined">more_horiz</span>
					</button>
				</div>

				<div>
					<div className="flex items-center gap-2 mb-1">
						<h4 className="font-bold text-lg text-text-main dark:text-white">{title}</h4>
						{classLabel ? <span className="text-[11px] font-semibold text-text-secondary bg-input-bg dark:bg-slate-800 px-2 py-0.5 rounded">{classLabel}</span> : null}
					</div>
					{description ? <p className="text-xs text-text-secondary line-clamp-1">{description}</p> : null}
				</div>

				<div className="mt-auto space-y-3">
					<div className="flex items-center justify-between text-sm text-text-main dark:text-slate-300">
						<div className="flex items-center gap-2 bg-input-bg dark:bg-slate-800 px-2 py-1 rounded" aria-label="上课时间">
							<span className="material-symbols-outlined text-base text-text-secondary">schedule</span>
							<span className="font-medium">{timeRange}</span>
						</div>
						<div className="flex items-center gap-1 text-text-secondary" aria-label="班级人数">
							<span className="material-symbols-outlined text-base">group</span>
							<span className="text-xs">{studentsCount} 人</span>
						</div>
					</div>

					<button
						type="button"
						className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm ${
							canEnter ? 'bg-primary text-white hover:bg-blue-600' : 'bg-input-bg text-text-secondary dark:bg-slate-700 dark:text-slate-400 cursor-not-allowed'
						}`}
						onClick={() => (canEnter ? onEnter?.(id) : undefined)}
						aria-label={canEnter ? '进入课堂' : '等待开课'}
						disabled={!canEnter}
					>
						<span className="material-symbols-outlined text-base">{canEnter ? 'videocam' : 'schedule_send'}</span>
						{canEnter ? '进入课堂' : '待开课'}
					</button>
				</div>
			</div>
		</article>
	)
}

export default CourseCard
