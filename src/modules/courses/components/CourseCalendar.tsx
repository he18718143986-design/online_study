/**
 * 来源 HTML: screen_id: 20847ab41b7142b3af7881f060f5c328
 * Generated from Stitch export
 */
import React from 'react'
import type { CourseSession } from '@/types/models/course'

export interface CourseCalendarProps {
	courses: CourseSession[]
	view: 'day' | 'week' | 'month'
	onSelectCourse?: (courseId: string) => void
	onViewChange?: (view: 'day' | 'week' | 'month') => void
}

const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
const WEEK_HEADERS = [
	{ label: '周一', date: '23' },
	{ label: '周二', date: '24', isToday: true },
	{ label: '周三', date: '25' },
	{ label: '周四', date: '26' },
	{ label: '周五', date: '27' },
	{ label: '周六', date: '28' },
	{ label: '周日', date: '29' }
]

const statusClasses: Record<CourseSession['status'], string> = {
	live: 'bg-primary text-white shadow-lg ring-2 ring-white',
	ongoing: 'bg-primary text-white shadow-lg ring-2 ring-white',
	upcoming: 'bg-orange-50 text-orange-900 border border-orange-200',
	completed: 'bg-slate-100 text-text-main border border-slate-200',
	pending: 'bg-slate-100 text-text-secondary border border-slate-200'
}

const statusIcon: Record<CourseSession['status'], string> = {
	live: 'videocam',
	ongoing: 'videocam',
	upcoming: 'schedule',
	completed: 'check_circle',
	pending: 'event_busy'
}

const viewTabs: Array<{ value: CourseCalendarProps['view']; label: string }> = [
	{ value: 'day', label: '日' },
	{ value: 'week', label: '周' },
	{ value: 'month', label: '月' }
]

const hourHeightPx = 64 // 4rem height per hour just like the Stitch export
const startMinutes = 8 * 60

const parseMinutes = (value: string) => {
	const [h, m] = value.split(':').map(Number)
	return h * 60 + m
}

const getBlockStyle = (course: CourseSession) => {
	const start = parseMinutes(course.startTime)
	const end = parseMinutes(course.endTime)
	const top = Math.max(0, start - startMinutes)
	const duration = Math.max(30, end - start)
	return {
		top: `${(top / 60) * hourHeightPx}px`,
		height: `${(duration / 60) * hourHeightPx}px`
	}
}

const CourseCalendar: React.FC<CourseCalendarProps> = ({ courses, view, onSelectCourse, onViewChange }) => {
	return (
		<div className="flex-1 flex flex-col bg-background-light relative">
			<div className="flex items-center justify-between px-6 py-4 bg-background-light shrink-0">
				<div className="flex items-center gap-4">
					<h1 className="text-2xl font-display font-bold text-text-main tracking-tight">2023年 10月</h1>
					<div className="flex items-center bg-white rounded-lg shadow-sm border border-border-light p-0.5">
						<button
							type="button"
							className="p-1 hover:bg-background-light rounded transition-colors text-text-secondary"
							aria-label="上一周"
						>
							<span className="material-symbols-outlined">chevron_left</span>
						</button>
						<button type="button" className="px-2 text-sm font-bold text-text-main" aria-label="跳转到今天">
							今天
						</button>
						<button
							type="button"
							className="p-1 hover:bg-background-light rounded transition-colors text-text-secondary"
							aria-label="下一周"
						>
							<span className="material-symbols-outlined">chevron_right</span>
						</button>
					</div>
				</div>
				<div className="flex bg-white rounded-lg shadow-sm border border-border-light p-1" role="group" aria-label="日/周/月视图切换">
					{viewTabs.map((tab) => (
						<button
								key={tab.value}
								type="button"
								className={`px-3 py-1 text-sm rounded-md transition-colors ${
									view === tab.value
										? 'text-primary font-bold bg-primary/10 shadow-sm'
										: 'text-text-secondary hover:bg-background-light'
								}`}
								aria-pressed={view === tab.value}
								onClick={() => onViewChange?.(tab.value)}
							>
								{tab.label}
							</button>
						))}
				</div>
			</div>

			<div className="flex-1 overflow-y-auto px-6 pb-6 relative custom-scroll">
				<div className="bg-white rounded-xl shadow-sm border border-border-light min-h-[800px] flex flex-col relative">
					<div className="grid grid-cols-8 border-b border-border-light sticky top-0 bg-white z-10 rounded-t-xl">
						<div className="p-3 text-center border-r border-border-light/50 text-xs font-bold text-text-secondary">时间</div>
						{WEEK_HEADERS.map((day, index) => (
							<div
								key={day.label}
								className={`p-3 text-center border-r border-border-light/50 ${index === WEEK_HEADERS.length - 1 ? '' : ''} ${day.isToday ? 'bg-primary/5' : ''}`}
							>
								<div
									className={`text-xs font-medium ${day.isToday ? 'text-primary font-bold' : 'text-text-secondary'}`}
								>
									{day.label}
								</div>
								<div
									className={`text-lg font-bold font-display mx-auto w-8 h-8 flex items-center justify-center rounded-full ${
										day.isToday ? 'bg-primary text-white' : 'text-text-main'
									}`}
								>
									{day.date}
								</div>
							</div>
						))}
					</div>

					<div className="flex-1 grid grid-cols-8 relative">
						<div className="absolute w-full border-t-2 border-primary z-10 flex items-center pointer-events-none" style={{ top: '32%' }}>
							<div className="absolute -left-1 w-2 h-2 bg-primary rounded-full" aria-hidden />
						</div>

						<div className="col-span-1 border-r border-border-light/50 text-xs text-text-secondary font-medium">
							{HOURS.map((hour) => (
								<div key={hour} className="h-16 border-b border-border-light/30 flex items-start justify-center pt-2">
									{hour}
								</div>
							))}
						</div>

						<div className="col-span-7 grid grid-cols-7 absolute inset-0 left-[12.5%] h-full pointer-events-none">
							{Array.from({ length: 7 }).map((_, dayIndex) => (
								<div key={dayIndex} className={`border-r border-border-light/30 h-full ${dayIndex === 1 ? 'bg-primary/5' : ''} grid grid-rows-[repeat(11,4rem)]`}>
									{Array.from({ length: 11 }).map((__ , row) => (
										<div key={row} className="border-b border-border-light/30" />
									))}
								</div>
							))}
						</div>

						<div className="absolute inset-0 left-[12.5%] right-0">
							<div className="grid grid-cols-7 h-full">
								{courses.map((course) => {
									const style = getBlockStyle(course)
									const column = Math.min(Math.max(course.weekday, 1), 7)
									return (
										<div key={course.id} className="relative px-1" style={{ gridColumnStart: column }}>
											<button
												type="button"
												className={`absolute inset-x-1 text-left rounded-lg p-3 text-xs cursor-pointer transition-transform hover:scale-[1.02] flex flex-col justify-between ${statusClasses[course.status]}`}
												style={style}
												onClick={() => onSelectCourse?.(course.id)}
												aria-label={`${course.title} ${course.startTime}-${course.endTime}`}
											>
												<div>
													<div className="flex justify-between items-start mb-1 gap-2">
														<span className="font-bold line-clamp-2 leading-snug text-sm">{course.title}</span>
														{course.status === 'live' ? (
															<span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-[11px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
																直播中
															</span>
														) : null}
													</div>
													<p className="opacity-80 line-clamp-1">{course.className}</p>
												</div>
												<div className="flex items-center gap-1 opacity-80">
													<span className="material-symbols-outlined text-[16px]">{statusIcon[course.status]}</span>
													<span>
														{course.startTime} - {course.endTime}
													</span>
												</div>
											</button>
										</div>
									)
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CourseCalendar
