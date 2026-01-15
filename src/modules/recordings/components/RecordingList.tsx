// 来源 HTML: screen_id: recording_library
import React from 'react'
import type { Recording } from '@/types/models/recording'
import RecordingCard from '../../../components/cards/RecordingCard'

export interface RecordingListProps {
	recordings: Recording[]
	onPlay: (id: string) => void
	onShare: (id: string) => void
	onExport: (id: string) => void
	onFilterChange?: (filters: { courseId?: string; status?: Recording['status']; date?: string }) => void
	filters?: { courseId?: string; status?: Recording['status']; date?: string }
}

const RecordingList: React.FC<RecordingListProps> = ({ recordings, onPlay, onShare, onExport, onFilterChange, filters }) => {
	const [courseId, setCourseId] = React.useState<string | undefined>(undefined)
	const [status, setStatus] = React.useState<Recording['status'] | undefined>(undefined)
	const [date, setDate] = React.useState<string | undefined>(undefined)

	React.useEffect(() => {
		if (!filters) return
		setCourseId(filters.courseId)
		setStatus(filters.status)
		setDate(filters.date)
	}, [filters?.courseId, filters?.status, filters?.date])

	React.useEffect(() => {
		onFilterChange?.({ courseId, status, date })
	}, [courseId, status, date, onFilterChange])

	return (
		<section className="space-y-4">
			<div className="flex flex-col sm:flex-row sm:items-center gap-3">
				<div className="flex items-center gap-2">
					<label className="text-xs text-text-secondary">课程</label>
					<input className="h-9 px-3 rounded-lg border border-border-light bg-white text-sm" placeholder="courseId" value={courseId ?? ''} onChange={(e) => setCourseId(e.target.value || undefined)} />
				</div>
				<div className="flex items-center gap-2">
					<label className="text-xs text-text-secondary">状态</label>
					<select className="h-9 px-3 rounded-lg border border-border-light bg-white text-sm" value={status ?? ''} onChange={(e) => setStatus((e.target.value || undefined) as Recording['status'] | undefined)}>
						<option value="">全部</option>
						<option value="ready">已就绪</option>
						<option value="processing">处理中</option>
						<option value="failed">失败</option>
					</select>
				</div>
				<div className="flex items-center gap-2">
					<label className="text-xs text-text-secondary">日期</label>
					<input className="h-9 px-3 rounded-lg border border-border-light bg-white text-sm" type="date" value={date ?? ''} onChange={(e) => setDate(e.target.value || undefined)} />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list">
				{recordings.map((rec) => (
					<RecordingCard key={rec.id} {...rec} onPlay={onPlay} onShare={onShare} onExport={onExport} />
				))}
			</div>
		</section>
	)
}

export default RecordingList
