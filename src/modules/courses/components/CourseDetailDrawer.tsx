/**
 * 来源 HTML: screen_id: 20847ab41b7142b3af7881f060f5c328
 * Generated from Stitch export
 */
import React from 'react'
import type { CourseSession } from '@/types/models/course'

export interface CourseDetailDrawerProps {
	course?: CourseSession
	open: boolean
	onClose: () => void
	children?: React.ReactNode
}

const CourseDetailDrawer: React.FC<CourseDetailDrawerProps> = ({ course, open, onClose, children }) => {
	const statusLabel: Record<CourseSession['status'], string> = {
		live: '直播中',
		ongoing: '进行中',
		upcoming: '即将开始',
		completed: '已结束',
		pending: '待排课'
	}

	return (
		<aside
			className={`absolute inset-y-0 right-0 w-[480px] bg-white shadow-drawer border-l border-border-light z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${
				open ? 'translate-x-0' : 'translate-x-full'
			}`}
			role="dialog"
			aria-modal="true"
			aria-label="课程详情"
		>
			<div className="flex items-start justify-between p-6 border-b border-border-light bg-slate-50">
				<div className="flex-1">
					{course ? (
						<>
							<div className="flex items-center gap-3 mb-2">
								<span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
									{statusLabel[course.status]}
								</span>
								<span className="text-text-secondary text-sm">
									{course.dayLabel} {course.startTime} - {course.endTime}
								</span>
							</div>
							<h2 className="text-xl font-bold text-text-main leading-tight mb-1">{course.title}</h2>
							<p className="text-text-secondary text-sm">{course.className}</p>
						</>
					) : (
						<div className="text-text-secondary text-sm">请选择课程查看详情</div>
					)}
				</div>
				<button
					type="button"
					className="text-text-secondary hover:text-text-main hover:bg-black/5 rounded-full p-1 transition-colors"
					onClick={onClose}
					aria-label="关闭课程详情"
				>
					<span className="material-symbols-outlined">close</span>
				</button>
			</div>

			<div className="grid grid-cols-2 gap-3 p-6 border-b border-border-light">
				<button className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all active:scale-95" aria-label="开始直播">
					<span className="material-symbols-outlined">videocam</span>
					开始直播
				</button>
				<button className="flex items-center justify-center gap-2 bg-white border border-border-light hover:bg-slate-50 text-text-main font-medium py-2.5 px-4 rounded-lg transition-colors" aria-label="编辑课程">
					<span className="material-symbols-outlined">edit</span>
					编辑课程
				</button>
				<button className="col-span-2 flex items-center justify-center gap-2 bg-white border border-border-light hover:bg-slate-50 text-text-secondary font-medium py-2 px-4 rounded-lg text-sm transition-colors border-dashed" aria-label="上传课件">
					<span className="material-symbols-outlined text-[18px]">upload_file</span>
					上传课件 / 讲义 / 作业
				</button>
			</div>

			{children ? <div className="flex-1 flex flex-col overflow-hidden">{children}</div> : null}
		</aside>
	)
}

export default CourseDetailDrawer
