// 来源 HTML: screen_id: recording_library
import React from 'react'
import type { Recording } from '@/types/models/recording'
import RecordingCard from '../../../components/cards/RecordingCard'

export interface RecordingListProps {
	recordings: Recording[]
	isLoading?: boolean
	error?: Error | null
	onPlay: (id: string) => void
	onShare: (id: string) => void
	onExport: (id: string) => void
	onFilterChange?: (filters: { courseId?: string; status?: Recording['status']; date?: string }) => void
	filters?: { courseId?: string; status?: Recording['status']; date?: string }
	onRetry?: () => void
}

const RecordingList: React.FC<RecordingListProps> = ({
	recordings,
	isLoading = false,
	error = null,
	onPlay,
	onShare,
	onExport,
	onFilterChange,
	filters,
	onRetry
}) => {
	// 直接使用 filters prop，避免内部状态与 props 的循环更新
	const courseId = filters?.courseId
	const status = filters?.status
	const date = filters?.date

	// 只在用户手动改变筛选条件时调用 onFilterChange
	const handleCourseIdChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		onFilterChange?.({ courseId: e.target.value || undefined })
	}, [onFilterChange])

	const handleStatusChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		onFilterChange?.({ status: (e.target.value || undefined) as Recording['status'] | undefined })
	}, [onFilterChange])

	const handleDateChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		onFilterChange?.({ date: e.target.value || undefined })
	}, [onFilterChange])

	const filterBar = (
		<div className="flex flex-col sm:flex-row sm:items-center gap-3">
			<div className="flex items-center gap-2">
				<label className="text-xs text-text-secondary">课程</label>
				<input
					className="h-9 px-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 text-sm"
					placeholder="课程 ID"
					value={courseId ?? ''}
					onChange={handleCourseIdChange}
					disabled={isLoading}
				/>
			</div>
			<div className="flex items-center gap-2">
				<label className="text-xs text-text-secondary">状态</label>
				<select
					className="h-9 px-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 text-sm"
					value={status ?? ''}
					onChange={handleStatusChange}
					disabled={isLoading}
				>
					<option value="">全部</option>
					<option value="ready">已就绪</option>
					<option value="processing">处理中</option>
					<option value="failed">失败</option>
				</select>
			</div>
			<div className="flex items-center gap-2">
				<label className="text-xs text-text-secondary">日期</label>
				<input
					className="h-9 px-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 text-sm"
					type="date"
					value={date ?? ''}
					onChange={handleDateChange}
					disabled={isLoading}
				/>
			</div>
		</div>
	)

	// Loading state
	if (isLoading) {
		return (
			<section className="space-y-4">
				{filterBar}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden animate-pulse">
							<div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
							<div className="p-4 space-y-2">
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
								<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
							</div>
						</div>
					))}
				</div>
			</section>
		)
	}

	// Error state
	if (error) {
		return (
			<section className="space-y-4">
				{filterBar}
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
					<span className="material-symbols-outlined text-3xl text-red-500 mb-2">error_outline</span>
					<p className="text-sm text-red-600 dark:text-red-400 mb-3">{error.message || '加载录播列表失败'}</p>
					{onRetry && (
						<button
							type="button"
							className="px-4 h-9 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
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
	if (recordings.length === 0) {
		return (
			<section className="space-y-4">
				{filterBar}
				<div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center">
					<div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
						<span className="material-symbols-outlined text-3xl text-text-secondary">videocam_off</span>
					</div>
					<h3 className="text-base font-semibold text-text-main dark:text-white mb-1">暂无录播</h3>
					<p className="text-sm text-text-secondary max-w-sm mx-auto">
						{courseId || status || date
							? '没有符合筛选条件的录播，请尝试调整筛选条件'
							: '完成直播后，录播会自动生成并显示在这里'}
					</p>
				</div>
			</section>
		)
	}

	// Ready state (normal)
	return (
		<section className="space-y-4">
			{filterBar}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list">
				{recordings.map((rec) => (
					<RecordingCard key={rec.id} {...rec} onPlay={onPlay} onShare={onShare} onExport={onExport} />
				))}
			</div>
		</section>
	)
}

export default RecordingList
