/**
 * 录播详情页面 - 支持 Deep-Link
 * 
 * 路由：/recordings/:recordingId
 * 查询参数：?courseId=xxx（可选，用于返回筛选）
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecordingId, useCourseId } from '@/hooks/useRouteId'
import RecordingPlayer from '@/modules/recordings/components/RecordingPlayer'
import recordingsService from '@/services/recordings.service'
import type { Recording } from '@/types/models/recording'
import { getRecordingsUrl } from '@/app/routes'

const RecordingDetailPage: React.FC = () => {
	const navigate = useNavigate()
	const { id: recordingId, source: recordingSource } = useRecordingId()
	const { id: courseId } = useCourseId()

	const [recording, setRecording] = React.useState<Recording | null>(null)
	const [isLoading, setIsLoading] = React.useState(true)
	const [error, setError] = React.useState<Error | null>(null)

	// 加载录播详情
	React.useEffect(() => {
		if (!recordingId) {
			setError(new Error('未指定录播 ID'))
			setIsLoading(false)
			return
		}

		let cancelled = false
		
		const fetchRecording = async () => {
			setIsLoading(true)
			setError(null)
			try {
				const rec = await recordingsService.get(recordingId)
				if (cancelled) return
				if (!rec) {
					setError(new Error(`录播不存在：${recordingId}`))
				} else {
					setRecording(rec)
				}
			} catch (err) {
				if (cancelled) return
				setError(err as Error)
			} finally {
				if (!cancelled) {
					setIsLoading(false)
				}
			}
		}

		void fetchRecording()

		return () => {
			cancelled = true
		}
	}, [recordingId])

	const handleClose = React.useCallback(() => {
		// 使用 URL helper 返回录播列表，保持 courseId 筛选
		navigate(getRecordingsUrl(courseId))
	}, [navigate, courseId])

	const handleShare = React.useCallback(async () => {
		if (!recordingId) return
		const link = `${window.location.origin}/recordings/${recordingId}`
		try {
			await navigator.clipboard.writeText(link)
			alert('分享链接已复制')
		} catch {
			alert(`分享链接：${link}`)
		}
	}, [recordingId])

	// 错误状态
	if (error) {
		return (
			<div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
				<div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-lg p-8 max-w-md text-center">
					<span className="material-symbols-outlined text-5xl text-red-500 mb-4">error</span>
					<h1 className="text-xl font-bold text-text-main dark:text-white mb-2">录播加载失败</h1>
					<p className="text-sm text-text-secondary mb-4">{error.message}</p>
					<div className="flex items-center justify-center gap-3">
						<button
							onClick={handleClose}
							className="px-4 py-2 rounded-lg border border-border-light dark:border-border-dark text-sm"
						>
							返回列表
						</button>
						<button
							onClick={() => window.location.reload()}
							className="px-4 py-2 rounded-lg bg-primary text-white text-sm"
						>
							重试
						</button>
					</div>
				</div>
			</div>
		)
	}

	// 加载状态
	if (isLoading) {
		return (
			<div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
					<p className="text-sm text-text-secondary">加载录播中...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background-dark" data-testid="recording-detail-page">
			{/* 顶部导航栏 */}
			<header className="bg-gray-900/80 backdrop-blur-sm border-b border-white/10 px-4 py-3 flex items-center justify-between">
				<button
					onClick={handleClose}
					className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
				>
					<span className="material-symbols-outlined text-lg">arrow_back</span>
					返回录播库
				</button>
				<div className="flex items-center gap-3">
					<span className="text-xs text-white/60" data-testid="recording-id-display">
						ID: {recordingId}
					</span>
					<button
						onClick={handleShare}
						className="px-3 py-1.5 rounded-lg border border-white/20 text-white/80 text-xs hover:bg-white/10"
					>
						<span className="material-symbols-outlined text-sm align-middle mr-1">share</span>
						分享
					</button>
				</div>
			</header>

			{/* 录播播放器 */}
			<div className="p-6">
				{recording ? (
					<div className="max-w-5xl mx-auto">
						<div className="mb-4">
							<h1 className="text-xl font-bold text-white" data-testid="recording-title">
								{recording.title}
							</h1>
							<p className="text-sm text-white/60 mt-1">
								{recording.date} · {recording.duration}
								{recording.status === 'processing' && (
									<span className="ml-2 px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">
										处理中
									</span>
								)}
							</p>
						</div>
						<RecordingPlayer recording={recording} onClose={handleClose} />
					</div>
				) : (
					<div className="text-center py-20 text-white/60">
						录播数据加载中...
					</div>
				)}
			</div>
		</div>
	)
}

export default RecordingDetailPage
