// 来源 HTML: screen_id: live_teaching_room
import React from 'react'

export interface LiveRoomProps {
	title?: string
	statusLabel?: string
	children?: React.ReactNode
}

const LiveRoom: React.FC<LiveRoomProps> = ({ title = '直播中', statusLabel = 'Live', children }) => {
	return (
		<section
			className="relative w-full aspect-video bg-slate-900 text-white rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center"
			role="region"
			aria-live="polite"
			aria-label={title}
		>
			<div className="absolute top-3 left-3 flex items-center gap-2">
				<span className="px-2 py-0.5 rounded-full bg-red-500 text-[11px] font-semibold uppercase tracking-wide">{statusLabel}</span>
				<span className="text-xs text-white/70">{title}</span>
			</div>
			{children || (
				<div className="text-center">
					<div className="text-4xl font-bold">Whiteboard / Stream Placeholder</div>
					<p className="text-sm text-white/60 mt-3">TODO: 接入 WebRTC/流媒体 SDK 以展示实时画面</p>
				</div>
			)}
		</section>
	)
}

export default LiveRoom
