// 来源 HTML: screen_id: recording_library
import React from 'react'
import type { Recording } from '@/types/models/recording'

export interface RecordingCardProps extends Recording {
	onPlay: (recordingId: string) => void
	onShare: (recordingId: string) => void
	onExport: (recordingId: string) => void
}

const statusMap: Record<NonNullable<Recording['status']>, { label: string; tone: string }> = {
	ready: { label: '已就绪', tone: 'bg-emerald-100 text-emerald-700' },
	processing: { label: '处理中', tone: 'bg-amber-100 text-amber-700' },
	failed: { label: '失败', tone: 'bg-red-100 text-red-700' }
}

const fallbackTone = { label: '未知', tone: 'bg-gray-100 text-gray-600' }

const RecordingCard: React.FC<RecordingCardProps> = ({ id, title, duration, date, status, preview, onPlay, onShare, onExport }) => {
	const tone = status ? statusMap[status] ?? fallbackTone : fallbackTone
	return (
		<article className="group bg-white rounded-xl border border-border-light shadow-sm hover:shadow-md hover:border-border-dark/50 transition-all cursor-pointer flex flex-col overflow-hidden" role="listitem">
			<div className="relative aspect-video bg-slate-200 w-full overflow-hidden">
				{preview ? <div className="absolute inset-0 bg-center bg-cover transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${preview})` }} aria-hidden /> : null}
				<div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{duration}</div>
				<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
					<button
						type="button"
						className="bg-white/90 rounded-full p-2 shadow-lg backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform"
						onClick={() => onPlay(id)}
						aria-label={`播放 ${title}`}
					>
						<span className="material-symbols-outlined text-primary text-[28px] pl-1">play_arrow</span>
					</button>
				</div>
			</div>
			<div className="p-4 flex flex-col gap-2 flex-1">
				<div className="flex items-start justify-between gap-2">
					<h3 className="text-text-main font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">{title}</h3>
					<button className="text-text-secondary hover:text-text-main -mr-2 -mt-2 p-2 rounded-full" aria-label="更多操作">
						<span className="material-symbols-outlined text-[20px]">more_vert</span>
					</button>
				</div>
				<div className="mt-auto flex items-center justify-between text-xs text-text-secondary">
					<div className="flex items-center gap-1.5">
						<span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${tone.tone}`}>{tone.label}</span>
					</div>
					<span>{date}</span>
				</div>
				<div className="flex items-center gap-2 pt-2 text-xs">
					<button className="flex items-center gap-1 px-2 py-1 rounded-lg border border-border-light hover:border-primary text-text-main hover:text-primary transition-colors" onClick={() => onShare(id)} aria-label={`分享 ${title}`}>
						<span className="material-symbols-outlined text-[18px]">share</span>
						分享
					</button>
					<button className="flex items-center gap-1 px-2 py-1 rounded-lg border border-border-light hover:border-primary text-text-main hover:text-primary transition-colors" onClick={() => onExport(id)} aria-label={`导出 ${title}`}>
						<span className="material-symbols-outlined text-[18px]">file_download</span>
						导出
					</button>
				</div>
			</div>
		</article>
	)
}

export default RecordingCard
