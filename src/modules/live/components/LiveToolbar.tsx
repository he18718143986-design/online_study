// 来源 HTML: screen_id: live_teaching_room
import React from 'react'

export interface LiveToolbarProps {
	onToggleMic: () => void
	onToggleCamera: () => void
	onShareScreen: () => void
	onInsertQuestion: () => void
	onToggleRecording: () => void
	onEndSession: () => void
	recordingActive?: boolean
	micMuted?: boolean
	cameraOff?: boolean
}

const LiveToolbar: React.FC<LiveToolbarProps> = ({
	onToggleMic,
	onToggleCamera,
	onShareScreen,
	onInsertQuestion,
	onToggleRecording,
	onEndSession,
	recordingActive = false,
	micMuted = false,
	cameraOff = false
}) => {
	const buttonBase = 'flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors'
	return (
		<nav className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-2 shadow-sm" aria-label="直播控制栏">
			<button type="button" className={`${buttonBase} ${micMuted ? 'text-red-500' : 'text-text-main'}`} aria-label={micMuted ? '取消静音' : '静音'} onClick={onToggleMic}>
				<span className="material-symbols-outlined text-2xl">{micMuted ? 'mic_off' : 'mic'}</span>
				<span>{micMuted ? '取消静音' : '静音'}</span>
			</button>
			<button type="button" className={`${buttonBase} ${cameraOff ? 'text-red-500' : 'text-text-main'}`} aria-label={cameraOff ? '打开摄像头' : '关闭摄像头'} onClick={onToggleCamera}>
				<span className="material-symbols-outlined text-2xl">{cameraOff ? 'videocam_off' : 'videocam'}</span>
				<span>{cameraOff ? '打开摄像头' : '停止视频'}</span>
			</button>
			<button type="button" className={`${buttonBase} text-text-main`} aria-label="共享屏幕" onClick={onShareScreen}>
				<span className="material-symbols-outlined text-2xl">screen_share</span>
				<span>共享屏幕</span>
			</button>
			<button type="button" className={`${buttonBase} text-text-main`} aria-label="插入题目" onClick={onInsertQuestion}>
				<span className="material-symbols-outlined text-2xl">quiz</span>
				<span>插题</span>
			</button>
			<button type="button" className={`${buttonBase} ${recordingActive ? 'text-red-500' : 'text-text-main'}`} aria-label={recordingActive ? '停止录制' : '开始录制'} onClick={onToggleRecording}>
				<span className="material-symbols-outlined text-2xl">{recordingActive ? 'stop_circle' : 'fiber_manual_record'}</span>
				<span>{recordingActive ? '停止录制' : '开始录制'}</span>
			</button>
			<button type="button" className={`${buttonBase} text-red-600`} aria-label="结束课堂" onClick={onEndSession}>
				<span className="material-symbols-outlined text-2xl">logout</span>
				<span>结束</span>
			</button>
		</nav>
	)
}

export default LiveToolbar
