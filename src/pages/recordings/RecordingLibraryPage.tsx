import React from 'react'
import RecordingList from '../../modules/recordings/components/RecordingList'
import RecordingPlayer from '../../modules/recordings/components/RecordingPlayer'
import useRecordings from '../../modules/recordings/hooks/useRecordings'

const RecordingLibraryPage: React.FC = () => {
	const { recordings, isLoading, error, filters, setFilters, refetch } = useRecordings()
	const [activeId, setActiveId] = React.useState<string | undefined>(undefined)
	const [shareLink, setShareLink] = React.useState<string | null>(null)
	const [shareMessage, setShareMessage] = React.useState<string | null>(null)

	React.useEffect(() => {
		if (typeof window === 'undefined') return
		const params = new URLSearchParams(window.location.search)
		const courseId = params.get('courseId')?.trim() || undefined
		const recordingId = params.get('recordingId')?.trim() || undefined
		if (courseId && courseId !== filters.courseId) setFilters({ courseId })
		if (recordingId) setActiveId(recordingId)
	}, [filters.courseId, setFilters])

	const activeRecording = React.useMemo(() => recordings.find((rec) => rec.id === activeId), [activeId, recordings])

	const handlePlay = React.useCallback((id: string) => {
		setActiveId(id)
	}, [])

	const handleShare = React.useCallback(
		async (id: string) => {
			const link = `https://campus.example.com/recordings/${id}?expires=7d`
			setShareLink(link)
			try {
				if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
					await navigator.clipboard.writeText(link)
					setShareMessage('分享链接已复制，7 天内有效')
					return
				}
				setShareMessage('复制到剪贴板不可用，请手动复制链接')
			} catch (err) {
				console.error('复制分享链接失败', err)
				setShareMessage('复制失败，请手动复制链接')
			}
		},
		[]
	)

	const handleExport = React.useCallback((id: string) => {
		setShareMessage(`已发起导出任务: ${id}`)
		setShareLink(null)
	}, [])

	const handleClosePlayer = React.useCallback(() => {
		setActiveId(undefined)
	}, [])

	return (
		<div className="p-6 space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-xl font-bold text-text-main">录播与媒体库</h1>
					<p className="text-sm text-text-secondary">集中管理课程录播，处理中录播会自动轮询状态，可手动刷新。</p>
				</div>
				<div className="flex items-center gap-2">
					<button className="px-3 h-10 rounded-lg border border-border-light bg-white text-sm text-text-main hover:border-primary transition-colors" onClick={() => void refetch()}>
						<span className="material-symbols-outlined text-[18px] align-middle">refresh</span>
						<span className="ml-1">手动刷新</span>
					</button>
					<button className="px-3 h-10 rounded-lg bg-primary text-white text-sm shadow hover:shadow-md transition-shadow" type="button">
						<span className="material-symbols-outlined text-[18px] align-middle">upload</span>
						<span className="ml-1">上传录播</span>
					</button>
				</div>
			</div>

			{shareMessage ? (
				<div className="rounded-lg border border-border-light bg-amber-50 px-3 py-2 text-xs text-amber-800 flex items-start justify-between gap-2">
					<div className="space-y-1">
						<p>{shareMessage}</p>
						{shareLink ? (
							<p className="font-mono text-[11px] break-all text-amber-900">{shareLink}</p>
						) : null}
					</div>
					<button
						className="text-amber-700 hover:text-amber-900"
						onClick={() => {
							setShareMessage(null)
							setShareLink(null)
						}}
						aria-label="关闭提示"
					>
						<span className="material-symbols-outlined text-[18px]">close</span>
					</button>
				</div>
			) : null}

			{error ? <div className="text-sm text-red-600">{error.message}</div> : null}
			{isLoading ? <div className="text-sm text-text-secondary">加载中...</div> : null}

			<RecordingList recordings={recordings} onPlay={handlePlay} onShare={handleShare} onExport={handleExport} onFilterChange={setFilters} filters={filters} />

			<RecordingPlayer recording={activeRecording} onClose={handleClosePlayer} />
		</div>
	)
}

export default RecordingLibraryPage
