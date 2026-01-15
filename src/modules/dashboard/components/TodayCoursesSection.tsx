// 来源 HTML: screen_id: e2ff3e9e9b5148b28a6741d0c8901e64 — Generated from Stitch export
import React from 'react'
import CourseCard from '../../../components/cards/CourseCard'
import { type Course } from '@/types/models/course'

interface Props {
	courses: Course[]
	onCourseDetail?: (courseId: string) => void
	onEnter?: (courseId: string) => void
	onViewAll?: () => void
	onAddCourse?: () => void
}

const TodayCoursesSection: React.FC<Props> = ({ courses, onCourseDetail, onEnter, onViewAll, onAddCourse }) => {
	return (
		<div>
			<div className="flex items-center justify-between mb-4 px-1">
				<h3 className="text-lg font-bold text-text-main dark:text-white">今日课程</h3>
				<div className="flex gap-2" aria-label="今日课程切换">
					<button className="size-8 flex items-center justify-center rounded-full bg-input-bg dark:bg-slate-700 text-text-secondary hover:text-text-main disabled:opacity-50" aria-label="上一项" disabled>
						<span className="material-symbols-outlined text-sm">arrow_back_ios_new</span>
					</button>
					<button className="size-8 flex items-center justify-center rounded-full bg-input-bg dark:bg-slate-700 text-text-secondary hover:text-text-main" aria-label="下一项">
						<span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
					</button>
					<button type="button" className="ml-3 text-xs text-primary hover:underline" onClick={() => onViewAll?.()}>
						查看全部课程
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="今日课程列表">
				{courses.map((course) => (
					<CourseCard
						key={course.id}
						id={course.id}
						title={course.title}
						description={course.description}
						classLabel={course.classLabel}
						timeRange={course.timeRange || ''}
						studentsCount={course.studentsCount ?? 0}
						status={course.status}
						onEnter={() => onEnter?.(course.id)}
						onMore={() => onCourseDetail?.(course.id)}
					/>
				))}

				<button
					className="bg-transparent rounded-xl border-2 border-dashed border-border-color dark:border-slate-700 flex flex-col items-center justify-center p-5 text-center group hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
					aria-label="添加课程安排"
					onClick={() => onAddCourse?.()}
				>
					<div className="size-12 rounded-full bg-input-bg dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors text-text-secondary">
						<span className="material-symbols-outlined">edit_calendar</span>
					</div>
					<h4 className="font-bold text-text-main dark:text-white text-sm">添加课程安排</h4>
					<p className="text-xs text-text-secondary mt-1">今天没有更多课程了，去备课吧</p>
				</button>
			</div>
		</div>
	)
}

export default TodayCoursesSection
