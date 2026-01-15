// 来源 HTML: screen_id: e2ff3e9e9b5148b28a6741d0c8901e64 — Generated from Stitch export
import React from 'react'
import AssignmentItem from '../../../components/cards/AssignmentItem'
import { type Assignment } from '@/types/models/assignment'

interface Props {
	assignments: Assignment[]
	isLoading?: boolean
	error?: Error | null
	onGrade?: (id: string) => void
	onViewAll?: () => void
	onRetry?: () => void
	onCreateAssignment?: () => void
}

const PendingAssignments: React.FC<Props> = ({
	assignments,
	isLoading = false,
	error = null,
	onGrade,
	onViewAll,
	onRetry,
	onCreateAssignment
}) => {
	// Loading state
	if (isLoading) {
		return (
			<section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-none border border-border-color dark:border-slate-700 h-full flex flex-col" aria-label="待批改作业">
				<div className="p-5 pb-3 border-b border-border-color dark:border-slate-700 flex justify-between items-center">
					<h3 className="font-bold text-text-main dark:text-white text-lg">待批改作业</h3>
				</div>
				<div className="flex-1 p-3 space-y-3">
					{[1, 2, 3].map((i) => (
						<div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 animate-pulse">
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
							<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
						</div>
					))}
				</div>
			</section>
		)
	}

	// Error state
	if (error) {
		return (
			<section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-none border border-border-color dark:border-slate-700 h-full flex flex-col" aria-label="待批改作业">
				<div className="p-5 pb-3 border-b border-border-color dark:border-slate-700 flex justify-between items-center">
					<h3 className="font-bold text-text-main dark:text-white text-lg">待批改作业</h3>
				</div>
				<div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
					<span className="material-symbols-outlined text-3xl text-red-500 mb-2">error_outline</span>
					<p className="text-sm text-red-600 dark:text-red-400 mb-3">{error.message || '加载失败'}</p>
					{onRetry && (
						<button
							type="button"
							className="px-3 h-8 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
							onClick={onRetry}
						>
							重试
						</button>
					)}
				</div>
			</section>
		)
	}

	// Empty state
	if (assignments.length === 0) {
		return (
			<section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-none border border-border-color dark:border-slate-700 h-full flex flex-col" aria-label="待批改作业">
				<div className="p-5 pb-3 border-b border-border-color dark:border-slate-700 flex justify-between items-center">
					<h3 className="font-bold text-text-main dark:text-white text-lg">待批改作业</h3>
					<span className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
						已完成
					</span>
				</div>
				<div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
					<div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-3">
						<span className="material-symbols-outlined text-2xl text-green-500">check_circle</span>
					</div>
					<h4 className="text-sm font-semibold text-text-main dark:text-white mb-1">暂无待批改作业</h4>
					<p className="text-xs text-text-secondary mb-4">太棒了！所有作业都已批改完成</p>
					{onCreateAssignment && (
						<button
							type="button"
							className="px-3 h-8 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-600 transition-colors inline-flex items-center gap-1"
							onClick={onCreateAssignment}
						>
							<span className="material-symbols-outlined text-sm">add</span>
							创建新作业
						</button>
					)}
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

	// Ready state (normal)
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
