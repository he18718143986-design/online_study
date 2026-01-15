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
		// TODO: 从用户上下文获取当前用户信息
		const currentUser = '当前用户' // 实际应从 auth context 获取
		void actions.assignReviewer(selected.id, currentUser)
		setNotice('已指派给我')
		setTimeout(() => setNotice(null), 3000)
	}

	const [notice, setNotice] = React.useState<string | null>(null)

	const handleApprove = () => {
		if (!selected) return
		void actions.markApproved(selected.id)
		setNotice('已标记为通过')
		setTimeout(() => setNotice(null), 3000)
	}

	const handleReject = () => {
		if (!selected) return
		const confirmed = window.confirm('确认驳回此审核项吗？')
		if (!confirmed) return
		void actions.markRejected(selected.id)
		setNotice('已驳回')
		setTimeout(() => setNotice(null), 3000)
	}

	const handleSendBack = () => {
		if (!selected) return
		void actions.markPending(selected.id)
		setNotice('已返回到待审状态')
		setTimeout(() => setNotice(null), 3000)
	}

	const handleNewTask = () => {
		setNotice('新建任务功能待实现')
		setTimeout(() => setNotice(null), 3000)
		// TODO: 打开新建任务对话框
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
					{notice ? (
						<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs">
							<span className="material-symbols-outlined text-[16px]">check_circle</span>
							{notice}
						</div>
					) : null}
					<button
						type="button"
						className="px-3 py-2 rounded-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-main-light dark:text-text-main-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition"
						onClick={() => void actions.refetch()}
					>
						刷新
					</button>
					<button 
						className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold shadow-sm" 
						type="button"
						onClick={handleNewTask}
					>
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
