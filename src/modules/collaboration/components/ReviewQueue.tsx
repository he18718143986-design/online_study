import React from 'react'
import { ReviewFilter, ReviewItem, ReviewStats } from '../hooks/useReviewQueue'

interface ReviewQueueProps {
	items: ReviewItem[]
	filter: ReviewFilter
	search: string
	stats: ReviewStats
	selectedId: string | null
	isLoading?: boolean
	onSelect: (id: string) => void
	onFilterChange: (value: ReviewFilter) => void
	onSearchChange: (value: string) => void
}

const statusLabel: Record<ReviewItem['status'], string> = {
	pending: '待审',
	draft: '草稿',
	rejected: '被驳回',
	approved: '已通过'
}

const statusStyle: Record<ReviewItem['status'], string> = {
	pending: 'bg-amber-100 text-amber-700',
	draft: 'bg-slate-100 text-slate-600',
	rejected: 'bg-red-100 text-red-700',
	approved: 'bg-emerald-100 text-emerald-700'
}

const ReviewQueue: React.FC<ReviewQueueProps> = ({
	items,
	filter,
	search,
	stats,
	selectedId,
	isLoading,
	onSelect,
	onFilterChange,
	onSearchChange
}) => {
	const filters = [
		{ label: '待审', value: 'pending' as ReviewFilter, count: stats.pending },
		{ label: '草稿', value: 'draft' as ReviewFilter, count: stats.draft },
		{ label: '被驳回', value: 'rejected' as ReviewFilter, count: stats.rejected },
		{ label: '已通过', value: 'approved' as ReviewFilter, count: stats.approved },
		{ label: '全部', value: 'all' as ReviewFilter, count: stats.all }
	]

	return (
		<div className="flex flex-col h-full">
			<div className="p-4 border-b border-border-light dark:border-border-dark flex flex-col gap-3">
				<div className="relative">
					<span className="material-symbols-outlined absolute left-3 top-2.5 text-text-secondary-light dark:text-text-secondary-dark text-[20px]">search</span>
					<input
						type="text"
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:ring-2 focus:ring-primary/20 text-text-main-light dark:text-text-main-dark placeholder:text-text-secondary-light"
						placeholder="搜索题目、试卷 ID..."
					/>
				</div>
				<div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
					{filters.map((f) => (
						<button
							key={f.value}
							type="button"
							onClick={() => onFilterChange(f.value)}
							className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
								filter === f.value
									? 'bg-primary/10 text-primary border-primary/30'
									: 'bg-white dark:bg-background-dark text-text-secondary-light dark:text-text-secondary-dark border-border-light dark:border-border-dark hover:border-slate-300'
							}`}
						>
							{f.label}
							<span className="ml-1 text-[11px] font-bold">({f.count})</span>
						</button>
					))}
				</div>
			</div>

			<div className="flex-1 overflow-y-auto">
				{isLoading ? (
					<div className="p-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">加载中...</div>
				) : items.length === 0 ? (
					<div className="p-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">暂无队列项</div>
				) : (
					<ul>
						{items.map((item) => (
							<li key={item.id} className="border-b border-border-light dark:border-border-dark last:border-none">
								<button
									type="button"
									onClick={() => onSelect(item.id)}
									className={`w-full text-left p-4 flex flex-col gap-2 transition-colors ${
										selectedId === item.id
											? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-l-primary'
											: 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
									}`}
								>
									<div className="flex items-start justify-between gap-3">
										<div className="flex items-center gap-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">
											<span className={`px-2 py-0.5 rounded font-bold ${statusStyle[item.status]}`}>{statusLabel[item.status]}</span>
											<span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-text-main-light dark:text-text-main-dark">{item.code}</span>
											{item.tags?.map((tag) => (
												<span key={tag} className="px-2 py-0.5 rounded bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-[10px] font-medium">
													{tag}
												</span>
											))}
										</div>
										<div className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark">{item.updatedAt}</div>
									</div>
									<div className="text-sm font-semibold text-text-main-light dark:text-text-main-dark line-clamp-2">{item.title}</div>
									<div className="flex items-center justify-between text-xs text-text-secondary-light dark:text-text-secondary-dark">
										<span>
											提交人: {item.submitBy}
											{item.submitterRole ? ` · ${item.submitterRole}` : ''}
										</span>
										<span>版本 {item.version}</span>
									</div>
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	)
}

export default ReviewQueue
