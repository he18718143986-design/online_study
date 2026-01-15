// 来源 HTML: screen_id: e2ff3e9e9b5148b28a6741d0c8901e64 — Generated from Stitch export
import React from 'react'
import AssignmentItem from '../../../components/cards/AssignmentItem'
import { type Assignment } from '@/types/models/assignment'

interface Props {
	assignments: Assignment[]
	onGrade?: (id: string) => void
	onViewAll?: () => void
}

const PendingAssignments: React.FC<Props> = ({ assignments, onGrade, onViewAll }) => {
	return (
		<section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-none border border-border-color dark:border-slate-700 h-full flex flex-col" aria-label="待批改作业">
			<div className="p-5 pb-3 border-b border-border-color dark:border-slate-700 flex justify-between items-center">
				<h3 className="font-bold text-text-main dark:text-white text-lg">待批改作业</h3>
				<div className="relative">
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20" aria-hidden></span>
					<span className="relative bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800">
						{assignments.length} 份加急
					</span>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto p-3">
				<ul className="space-y-2" role="list">
					{assignments.map((item) => (
						<AssignmentItem key={item.id} {...item} onAction={(id) => onGrade?.(id)} />
					))}
				</ul>
			</div>
			<div className="p-3 border-t border-border-color dark:border-slate-700">
				<button onClick={() => onViewAll?.()} className="w-full py-2 text-xs font-bold text-text-secondary hover:text-primary hover:bg-input-bg dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1" aria-label="查看全部作业">
					查看全部作业
					<span className="material-symbols-outlined text-sm">chevron_right</span>
				</button>
			</div>
		</section>
	)
}

export default PendingAssignments
