import React from 'react'
import ReviewDetail from '../../modules/collaboration/components/ReviewDetail'
import ReviewQueue from '../../modules/collaboration/components/ReviewQueue'
import useReviewQueue from '../../modules/collaboration/hooks/useReviewQueue'

const CollaborationReviewPage: React.FC = () => {
	const { filteredItems, items, selectedId, filter, search, stats, isLoading, actions } = useReviewQueue()

	const selected = React.useMemo(() => items.find((i) => i.id === selectedId) ?? filteredItems[0] ?? null, [items, filteredItems, selectedId])

	const handleSelect = (id: string) => {
		actions.select(id)
	}

	const handleAssign = () => {
		if (!selected) return
		void actions.assignReviewer(selected.id, '我 (占位)')
		console.log('assign stub', selected.id)
	}

	const handleApprove = () => {
		if (!selected) return
		void actions.markApproved(selected.id)
		console.log('approve stub', selected.id)
	}

	const handleReject = () => {
		if (!selected) return
		void actions.markRejected(selected.id)
		console.log('reject stub', selected.id)
	}

	const handleSendBack = () => {
		if (!selected) return
		void actions.markPending(selected.id)
		console.log('send back stub', selected.id)
	}

	return (
		<div className="h-full bg-background-light dark:bg-background-dark flex flex-col">
			<header className="h-16 bg-white dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-6 shrink-0">
				<div className="flex items-center gap-3">
					<nav className="flex items-center text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
						<span className="hover:text-primary cursor-pointer">协作中心</span>
						<span className="mx-2 text-border-light">/</span>
						<span className="text-text-main-light dark:text-text-main-dark font-semibold">审核队列</span>
					</nav>
				</div>
				<div className="flex items-center gap-2 text-sm">
					<button
						type="button"
						className="px-3 py-2 rounded-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-main-light dark:text-text-main-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition"
						onClick={() => void actions.refetch()}
					>
						刷新
					</button>
					<button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold shadow-sm" type="button">
						<span className="material-symbols-outlined text-[18px]">add</span>
						新建任务
					</button>
				</div>
			</header>

			<div className="flex flex-1 overflow-hidden">
				<aside className="w-full md:w-[360px] flex-shrink-0 bg-white dark:bg-surface-dark border-r border-border-light dark:border-border-dark">
					<ReviewQueue
						items={filteredItems}
						filter={filter}
						search={search}
						stats={stats}
						selectedId={selectedId}
						isLoading={isLoading}
						onSelect={handleSelect}
						onFilterChange={actions.setFilter}
						onSearchChange={actions.setSearch}
					/>
				</aside>

				<main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark overflow-hidden">
					{!selected ? (
						<div className="flex-1 flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark">选择一个队列项查看详情</div>
					) : (
						<ReviewDetail selected={selected} onAssign={handleAssign} onSendBack={handleSendBack} onReject={handleReject} onApprove={handleApprove} />
					)}
				</main>
			</div>
		</div>
	)
}

export default CollaborationReviewPage
