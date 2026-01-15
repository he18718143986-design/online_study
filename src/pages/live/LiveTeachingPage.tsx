// 来源 HTML: screen_id: live_teaching_room
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LiveRoom from '../../modules/live/components/LiveRoom'
import LiveToolbar from '../../modules/live/components/LiveToolbar'
import LiveStudentPanel from '../../modules/live/components/LiveStudentPanel'
import useLiveSession from '../../modules/live/hooks/useLiveSession'
import { mockStudents } from '../../modules/live/mocks/students'
import liveTeachingService from '@/services/liveTeaching.service'
import { ROUTES } from '@/app/routes'

export interface LiveTeachingPageProps {
	onBackToCourse?: (courseId: string) => void
}

const LiveTeachingPage: React.FC<LiveTeachingPageProps> = ({ onBackToCourse }) => {
	const navigate = useNavigate()
	const params = useParams()
	const [courseId] = React.useState(() => {
		try {
			if (typeof window !== 'undefined') {
				const q = new URLSearchParams(window.location.search)
				const fromQuery = q.get('courseId')?.trim()
				if (fromQuery) return fromQuery
			}
		} catch {
			// ignore
		}
		return ((params as any)?.courseId as string | undefined) || 'course-live-1'
	})
	const { session, status, start, end } = useLiveSession(courseId)
	const [micMuted, setMicMuted] = React.useState(false)
	const [cameraOff, setCameraOff] = React.useState(false)
	const [recordingActive, setRecordingActive] = React.useState(false)
	const [ending, setEnding] = React.useState(false)
	const [endedRecordingId, setEndedRecordingId] = React.useState<string | null>(null)
	const [endError, setEndError] = React.useState<string | null>(null)

	React.useEffect(() => {
		if (status === 'idle' && courseId) {
			void start(courseId)
		}
	}, [courseId, start, status])

	const handleEnd = async () => {
		if (!session.id) return
		if (ending) return
		setEnding(true)
		setEndError(null)
		try {
			const recordingId = await end(session.id)
			setEndedRecordingId(recordingId)
		} catch (err) {
			const message = err instanceof Error ? err.message : '结束课堂失败'
			setEndError(message)
			alert(message)
		} finally {
			setEnding(false)
		}
	}

	const handleShareScreen = async () => {
		if (!session.id) return
		try {
			await liveTeachingService.shareScreen({ courseId, sessionId: session.id })
		} catch (err) {
			alert(err instanceof Error ? err.message : '共享屏幕失败')
		}
	}

	const handleInsertQuestion = async () => {
		if (!session.id) return
		try {
			await liveTeachingService.insertQuestion({ courseId, sessionId: session.id })
		} catch (err) {
			alert(err instanceof Error ? err.message : '插题失败')
		}
	}

	const handleOpenChat = async () => {
		if (!session.id) return
		try {
			await liveTeachingService.openChat({ courseId, sessionId: session.id })
		} catch (err) {
			alert(err instanceof Error ? err.message : '打开聊天失败')
		}
	}

	const handleToggleRecording = async () => {
		if (!session.id) return
		const next = !recordingActive
		setRecordingActive(next)
		try {
			await liveTeachingService.toggleRecording({ courseId, sessionId: session.id, active: next })
		} catch (err) {
			alert(err instanceof Error ? err.message : '录制状态切换失败')
		}
	}

	return (
		<div className="min-h-screen bg-background-dark text-white">
			<header className="flex items-center justify-between px-4 py-3">
				<button
					type="button"
					className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white"
					onClick={() => onBackToCourse?.(courseId)}
					aria-label="返回课程详情"
				>
					<span className="material-symbols-outlined text-base">arrow_back</span>
					返回课程
				</button>
				<div className="flex items-center gap-3 text-xs text-white/70">
					<span className="px-2 py-1 rounded-full bg-red-500 text-white text-[11px] font-semibold uppercase tracking-wide">{status === 'live' ? 'Live' : 'Ended'}</span>
					<span>课程 ID: {courseId}</span>
				</div>
			</header>

			{ending ? (
				<div className="px-4">
					<div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">
						正在结束课堂并生成录播…
					</div>
				</div>
			) : null}

			{!ending && endedRecordingId ? (
				<div className="px-4">
					<div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 flex flex-wrap items-center justify-between gap-2">
						<div className="space-y-1">
							<div className="font-semibold text-white">录播已创建，处理中</div>
							<div>
								录播 ID：<span className="font-mono text-[11px]">{endedRecordingId}</span>
								<span className="ml-2 text-white/60">（可在录播库中刷新查看就绪状态）</span>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<button
								type="button"
								className="px-3 py-2 rounded-lg bg-primary text-white text-xs font-bold"
								onClick={() => navigate(`${ROUTES.recordings}?courseId=${encodeURIComponent(courseId)}`)}
							>
								前往录播库
							</button>
							<button
								type="button"
								className="px-3 py-2 rounded-lg border border-white/20 text-white/90 text-xs"
								onClick={() => setEndedRecordingId(null)}
								aria-label="关闭提示"
							>
								关闭
							</button>
						</div>
					</div>
				</div>
			) : null}

			{!ending && endError ? (
				<div className="px-4">
					<div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-100">{endError}</div>
				</div>
			) : null}

			<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 px-4 pb-6">
				<div className="space-y-4">
					<LiveRoom title="白板演示" statusLabel={status === 'live' ? 'Live' : 'Ended'} />
					<LiveToolbar
						onToggleMic={() => setMicMuted((v) => !v)}
						onToggleCamera={() => setCameraOff((v) => !v)}
						onShareScreen={() => void handleShareScreen()}
						onInsertQuestion={() => void handleInsertQuestion()}
						onToggleRecording={() => void handleToggleRecording()}
						onEndSession={handleEnd}
						recordingActive={recordingActive}
						micMuted={micMuted}
						cameraOff={cameraOff}
					/>
				</div>
				<LiveStudentPanel students={mockStudents} onOpenChat={() => void handleOpenChat()} />
			</div>
		</div>
	)
}

export default LiveTeachingPage
