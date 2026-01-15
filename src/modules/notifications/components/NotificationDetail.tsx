import React from 'react'
import { type NotificationItem } from '../hooks/useNotifications'

interface NotificationDetailProps {
	selected: NotificationItem
	onReply: () => void
	onForward: () => void
	onCreateTicket: () => void
	onToggleRead: () => void
}

const NotificationDetail: React.FC<NotificationDetailProps> = ({ selected, onReply, onForward, onCreateTicket, onToggleRead }) => {
	return (
		<div className="flex-1 overflow-y-auto p-6">
			<div className="max-w-5xl mx-auto bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden flex flex-col min-h-[520px]">
				<div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-900/40">
					<div className="flex items-center gap-2">
						<button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-text-secondary-light dark:text-text-secondary-dark transition-colors" onClick={onReply}>
							<span className="material-symbols-outlined">reply</span>
						</button>
						<button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-text-secondary-light dark:text-text-secondary-dark transition-colors" onClick={onForward}>
							<span className="material-symbols-outlined">forward</span>
						</button>
						<button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-text-secondary-light dark:text-text-secondary-dark transition-colors" onClick={onCreateTicket}>
							<span className="material-symbols-outlined">assignment_add</span>
						</button>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">状态</span>
						<button
							type="button"
							className={`px-2 py-1 rounded text-xs font-bold border ${
								selected.isRead ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-orange-50 text-orange-700 border-orange-200'
							}`}
							onClick={onToggleRead}
						>
							{selected.isRead ? '已读' : '未读'}
						</button>
					</div>
				</div>
				<div className="p-6 flex-1 flex flex-col gap-6">
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1">
							<h1 className="text-xl font-bold text-text-main-light dark:text-text-main-dark mb-2">{selected.subject}</h1>
							<div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
								<span className="font-semibold text-text-main-light dark:text-text-main-dark">{selected.sender}</span>
								<span className="text-text-secondary-light">·</span>
								<span>{selected.role}</span>
								{selected.email ? <span className="text-text-secondary-light">{selected.email}</span> : null}
								<span className="text-text-secondary-light">{selected.time}</span>
							</div>
						</div>
						<div className="flex flex-wrap gap-2 justify-end">
							<span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold text-text-main-light dark:text-text-main-dark">
								{selected.type === 'question' ? '学生提问' : selected.type === 'appeal' ? '申诉' : selected.type === 'system' ? '系统通知' : '公告'}
							</span>
							<span
								className={`px-2 py-0.5 rounded text-xs font-bold border ${
									selected.priority === 'high'
										? 'bg-red-50 text-red-700 border-red-200'
									: selected.priority === 'medium'
										? 'bg-amber-50 text-amber-700 border-amber-200'
									: 'bg-emerald-50 text-emerald-700 border-emerald-200'
								}`}
							>
								{selected.priority === 'high' ? '高优先级' : selected.priority === 'medium' ? '普通' : '低'}
							</span>
							{selected.tags?.map((tag) => (
								<span key={tag} className="px-2 py-0.5 rounded bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-xs font-medium">
									{tag}
								</span>
							))}
						</div>
					</div>

					<div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-text-main-light dark:text-text-main-dark">
						<p>{selected.content}</p>
					</div>

					<div className="mt-auto pt-4 border-t border-border-light dark:border-border-dark">
						<div className="mb-3 text-sm font-bold text-text-main-light dark:text-text-main-dark">快速操作</div>
						<div className="flex flex-wrap gap-2">
							<button
								type="button"
								className="px-3 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors flex items-center gap-1"
								onClick={onReply}
							>
								<span className="material-symbols-outlined text-[18px]">reply</span>
								回复
							</button>
							<button
								type="button"
								className="px-3 py-2 rounded-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm font-semibold text-text-main-light dark:text-text-main-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
								onClick={onForward}
							>
								<span className="material-symbols-outlined text-[18px]">forward</span>
								转发
							</button>
							<button
								type="button"
								className="px-3 py-2 rounded-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm font-semibold text-text-main-light dark:text-text-main-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
								onClick={onCreateTicket}
							>
								<span className="material-symbols-outlined text-[18px]">assignment_add</span>
								创建工单
							</button>
							<button
								type="button"
								className="px-3 py-2 rounded-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm font-semibold text-text-main-light dark:text-text-main-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
								onClick={onToggleRead}
							>
								<span className="material-symbols-outlined text-[18px]">visibility</span>
								{selected.isRead ? '标记未读' : '标记已读'}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NotificationDetail
