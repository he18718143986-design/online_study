import React from 'react'
import { type Recording } from '@/types/models/recording'

interface CourseRecordingsPanelProps {
	recordings: Recording[]
}

const CourseRecordingsPanel: React.FC<CourseRecordingsPanelProps> = ({ recordings }) => {
	return (
		<div className="space-y-3">
			{recordings.map((rec) => (
				<div key={rec.id} className="flex items-center p-4 bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg hover:shadow-md transition-shadow group">
					<div className="relative h-16 w-28 rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center flex-shrink-0 mr-4">
						{rec.preview ? (
							<div className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:scale-105 transition-transform duration-300" style={{ backgroundImage: `url(${rec.preview})` }} aria-hidden />
						) : null}
						<div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" aria-hidden />
						<span className="relative z-10 text-white material-symbols-outlined">play_arrow</span>
						<span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">{rec.duration}</span>
					</div>
					<div className="min-w-0 flex-1">
						<h4 className="text-base font-semibold text-text-main dark:text-white truncate">{rec.title}</h4>
						<p className="text-xs text-text-secondary mt-1">{rec.date} • {rec.status === 'ready' ? '录播已生成' : '生成中'}</p>
					</div>
					<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
						<button type="button" className="p-2 text-text-secondary hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" aria-label={`播放 ${rec.title}`}>
							<span className="material-symbols-outlined">play_circle</span>
						</button>
					</div>
				</div>
			))}
		</div>
	)
}

export default CourseRecordingsPanel
