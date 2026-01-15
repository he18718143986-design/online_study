/**
 * 来源 HTML: screen_id: db7e4a443f6545ee97956546f94f340d
 * Generated from Stitch export
 */
import React from 'react'
import type { Course } from '@/types/models/course'

export interface CourseOverviewProps {
	course: Course
	onStartLive?: () => void
	onViewRecording?: () => void
	onEdit?: () => void
}

const statusLabel: Record<Course['status'], { text: string; classes: string }> = {
	live: { text: '直播中', classes: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
	ongoing: { text: '进行中', classes: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
	upcoming: { text: '未开始', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
	completed: { text: '已结束', classes: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
	pending: { text: '待排课', classes: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' }
}

const CourseOverview: React.FC<CourseOverviewProps> = ({ course, onStartLive, onViewRecording, onEdit }) => {
	const badge = statusLabel[course.status]
	return (
		<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
			<div className="flex items-start gap-4">
				<div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20" aria-hidden>
					<span className="material-symbols-outlined text-3xl">functions</span>
				</div>
				<div>
					<div className="flex items-center gap-3 mb-1">
						<h2 className="text-2xl font-bold tracking-tight text-text-main dark:text-white">{course.title}</h2>
						<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.classes}`}>
							<span className="w-1.5 h-1.5 mr-1.5 bg-green-500 rounded-full" aria-hidden />
							{badge.text}
						</span>
					</div>
					<p className="text-sm text-text-secondary flex flex-wrap items-center gap-4">
						<span className="flex items-center gap-1">
							<span className="material-symbols-outlined text-[16px]">person</span> 主讲教师: {course.teacher}
						</span>
						<span className="flex items-center gap-1">
							<span className="material-symbols-outlined text-[16px]">schedule</span> 上课时间: {course.schedule}
						</span>
					</p>
				</div>
			</div>
			<div className="flex items-center gap-3 self-end md:self-center">
				<button
					type="button"
					className="px-4 h-10 rounded-lg text-sm font-medium text-text-secondary hover:text-text-main hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
					onClick={onEdit}
					aria-label="保存草稿"
				>
					保存草稿
				</button>
				<button
					type="button"
					className="px-4 h-10 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
					onClick={onEdit}
					aria-label="删除课程"
				>
					删除
				</button>
				<button
					type="button"
					className="px-4 h-10 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-main dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm transition-colors flex items-center gap-2"
					onClick={onViewRecording}
					aria-label="发布更新"
				>
					<span className="material-symbols-outlined text-[18px]">publish</span>
					发布更新
				</button>
				<button
					type="button"
					className="px-5 h-10 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 group"
					onClick={onStartLive}
					aria-label="开始直播"
				>
					<span className="material-symbols-outlined text-[20px] group-hover:animate-pulse">videocam</span>
					开始直播
				</button>
			</div>
		</div>
	)
}

export default CourseOverview
