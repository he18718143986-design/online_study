// 来源 HTML: screen_id: recording_library
import React from 'react'
import type { Recording } from '@/types/models/recording'

export interface RecordingPlayerProps {
	recording?: Recording
	onClose: () => void
}

const RecordingPlayer: React.FC<RecordingPlayerProps> = ({ recording, onClose }) => {
	if (!recording) return null

	return (
		<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="录播详情">
			<div className="relative w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
				<header className="flex items-center justify-between px-6 py-4 border-b border-border-light">
					<div>
						<h3 className="font-bold text-lg text-text-main line-clamp-1">{recording.title}</h3>
						<p className="text-xs text-text-secondary">课程: {recording.courseId || '未分配'} • {recording.date}</p>
					</div>
					<div className="flex items-center gap-2">
						<button className="p-2 text-text-secondary hover:bg-gray-100 rounded-lg transition-colors" title="在新窗口打开">
							<span className="material-symbols-outlined text-[20px]">open_in_new</span>
						</button>
						<button className="p-2 text-text-secondary hover:bg-gray-100 rounded-lg transition-colors" title="关闭" onClick={onClose}>
							<span className="material-symbols-outlined text-[20px]">close</span>
						</button>
					</div>
				</header>
				<div className="flex-1 overflow-y-auto">
					<div className="bg-black aspect-video relative">
						<div className="absolute inset-0 bg-center bg-cover opacity-80" style={{ backgroundImage: `url(${recording.preview || ''})` }} aria-hidden />
						<div className="absolute inset-0 flex items-center justify-center">
							<button className="bg-white/20 backdrop-blur-md rounded-full p-4 hover:scale-110 transition-transform" aria-label="播放录播">
								<span className="material-symbols-outlined text-white text-[40px] fill-1">play_arrow</span>
							</button>
						</div>
						<div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
							<div className="h-full bg-primary w-1/3 relative">
								<div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 bg-white rounded-full shadow cursor-pointer" aria-label="播放进度指示" />
							</div>
						</div>
					</div>
					<div className="p-6 space-y-6">
						<div className="grid grid-cols-2 gap-4 text-sm text-text-secondary">
							<div>
								<p className="font-semibold text-text-main">元数据</p>
								<p>时长: {recording.duration}</p>
								<p>状态: {recording.status}</p>
							</div>
							<div>
								<p className="font-semibold text-text-main">分享链接</p>
								<p className="text-xs">TODO: 生成带有效期的分享链接</p>
							</div>
						</div>
						<div className="space-y-3">
							<h4 className="font-bold text-text-main flex items-center gap-2">
								<span className="material-symbols-outlined text-primary">content_cut</span>
								剪辑/章节
							</h4>
							<div className="h-12 bg-slate-100 rounded-lg border border-border-light relative overflow-hidden flex items-center px-2 text-xs text-text-secondary">
								<span className="opacity-60">章节/时间线占位</span>
							</div>
						</div>
						<div className="space-y-3">
							<h4 className="font-bold text-text-main flex items-center gap-2">
								<span className="material-symbols-outlined text-primary">whiteboard</span>
								白板同步
							</h4>
							<p className="text-sm text-text-secondary">TODO: 同步展示课堂白板/屏幕录制的关键帧。</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default RecordingPlayer
