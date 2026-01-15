import React from 'react'
import { NotificationFilter, NotificationItem, NotificationStats } from '../hooks/useNotifications'

interface InboxListProps {
	items: NotificationItem[]
	filter: NotificationFilter
	search: string
	stats: NotificationStats
	selectedId: string | null
	isLoading?: boolean
	onSelect: (id: string) => void
	onFilterChange: (value: NotificationFilter) => void
	onSearchChange: (value: string) => void
}

const priorityStyles: Record<NotificationItem['priority'], string> = {
	high: 'bg-red-50 text-red-700 border border-red-200',
	medium: 'bg-amber-50 text-amber-700 border border-amber-200',
	low: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
}

const InboxList: React.FC<InboxListProps> = ({
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
		{ label: '全部', value: 'all' as NotificationFilter, count: stats.all },
		{ label: '未读', value: 'unread' as NotificationFilter, count: stats.unread },
		{ label: '提问', value: 'question' as NotificationFilter, count: stats.question },
		{ label: '申诉', value: 'appeal' as NotificationFilter, count: stats.appeal },
		{ label: '系统', value: 'system' as NotificationFilter, count: stats.system },
		{ label: '公告', value: 'general' as NotificationFilter, count: stats.general }
	]

	return (
		<div className="flex flex-col h-full">
			<div className="p-4 border-b border-border-light dark:border-border-dark flex flex-col gap-3 shadow-sm z-10">
				<div className="relative">
					<span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">
						<span className="material-symbols-outlined text-[20px]">search</span>
					</span>
					<input
						type="text"
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:ring-2 focus:ring-primary/50 placeholder:text-text-secondary-light dark:text-white"
						placeholder="搜索学生、工单号或关键词..."
					/>
				</div>
				<div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
					{filters.map((item) => (
						<button
							key={item.value}
							type="button"
							onClick={() => onFilterChange(item.value)}
							className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
								filter === item.value
									? 'bg-primary/10 text-primary border-primary/30'
									: 'bg-background-light dark:bg-background-dark text-text-secondary-light dark:text-text-secondary-dark border-border-light dark:border-border-dark hover:border-slate-300 dark:hover:border-slate-600'
							}`}
						>
							{item.label}
							{typeof item.count === 'number' ? <span className="ml-1 text-[11px] font-bold">({item.count})</span> : null}
						</button>
					))}
				</div>
			</div>

			<div className="flex-1 overflow-y-auto">
				{isLoading ? (
					<div className="p-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">加载中...</div>
				) : items.length === 0 ? (
					<div className="p-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">暂无消息</div>
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
											: 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
									}`}
								>
									<div className="flex items-start justify-between">
										<div className="flex items-center gap-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">
											<span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-text-main-light dark:text-text-main-dark font-bold text-[11px]">{item.type === 'question' ? '提问' : item.type === 'system' ? '系统' : item.type === 'appeal' ? '申诉' : '公告'}</span>
											<span className={`px-2 py-0.5 rounded text-[11px] font-bold ${priorityStyles[item.priority]}`}>
												{item.priority === 'high' ? '高优先级' : item.priority === 'medium' ? '普通' : '低'}
											</span>
											{item.tags?.map((tag) => (
												<span key={tag} className="px-2 py-0.5 rounded bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-[11px] font-medium">
													{tag}
												</span>
											))}
										</div>
										<div className="flex items-center gap-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">
											{!item.isRead ? <span className="size-2 rounded-full bg-primary inline-block" aria-label="unread" /> : null}
											<span>{item.time}</span>
										</div>
									</div>
									<div className="flex items-center gap-2 text-sm font-semibold text-text-main-light dark:text-text-main-dark">
										<span className="text-text-secondary-light dark:text-text-secondary-dark">{item.sender}</span>
										<span className="text-text-secondary-light">·</span>
										<span>{item.subject}</span>
									</div>
									<p className="text-xs text-text-secondary-light dark:text-text-secondary-dark line-clamp-2 leading-relaxed">{item.preview}</p>
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	)
}

export default InboxList
