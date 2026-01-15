import React from 'react'
import InboxList from '../../modules/notifications/components/InboxList'
import NotificationDetail from '../../modules/notifications/components/NotificationDetail'
import useNotifications from '../../modules/notifications/hooks/useNotifications'

const InboxPage: React.FC = () => {
	const { notifications, filteredNotifications, selectedId, filter, search, stats, isLoading, unreadCount, actions } = useNotifications()

	const selected = React.useMemo(
		() => notifications.find((item) => item.id === selectedId) ?? filteredNotifications[0] ?? null,
		[notifications, filteredNotifications, selectedId]
	)

	const handleSelect = (id: string) => {
		actions.select(id)
		void actions.markRead(id)
	}

	const handleReply = () => {
		if (!selected) return
		console.log('reply stub', selected.id)
	}

	const handleForward = () => {
		if (!selected) return
		console.log('forward stub', selected.id)
	}

	const handleCreateTicket = () => {
		if (!selected) return
		console.log('create ticket stub', selected.id)
	}

	const handleToggleRead = () => {
		if (!selected) return
		void actions.toggleRead(selected.id)
	}

	return (
		<div className="h-full bg-background-light dark:bg-background-dark flex flex-col">
			<header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-6 flex-shrink-0">
				<div className="flex items-center gap-3">
					<h2 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">通知中心</h2>
					<span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-bold">未读 {unreadCount}</span>
				</div>
				<div className="flex items-center gap-2 text-sm">
					<button
						type="button"
						className="px-3 py-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-main-light dark:text-text-main-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition"
						onClick={() => void actions.markAllRead()}
					>
						标记全部已读
					</button>
					<button
						type="button"
						className="px-3 py-2 rounded-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-main-light dark:text-text-main-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition"
						onClick={() => void actions.refetch()}
					>
						刷新
					</button>
				</div>
			</header>

			<div className="flex flex-1 overflow-hidden">
				<section className="w-full md:w-[380px] flex-shrink-0 flex flex-col bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark">
					<InboxList
						items={filteredNotifications}
						filter={filter}
						search={search}
						stats={stats}
						selectedId={selectedId}
						isLoading={isLoading}
						onSelect={handleSelect}
						onFilterChange={actions.setFilter}
						onSearchChange={actions.setSearch}
					/>
				</section>

				<section className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark">
					{!selected ? (
						<div className="flex-1 flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark">选择一条消息查看详情</div>
					) : (
						<div className="flex-1 overflow-y-auto p-6">
							<NotificationDetail
								selected={selected}
								onReply={handleReply}
								onForward={handleForward}
								onCreateTicket={handleCreateTicket}
								onToggleRead={handleToggleRead}
							/>
						</div>
					)}
				</section>
			</div>
		</div>
	)
}

export default InboxPage
