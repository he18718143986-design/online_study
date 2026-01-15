// 来源 HTML: screen_id: e2ff3e9e9b5148b28a6741d0c8901e64 — Generated from Stitch export
import React from 'react'
import CourseCard from '../../../components/cards/CourseCard'
import { type Course } from '@/types/models/course'

interface Props {
	courses: Course[]
	isLoading?: boolean
	error?: Error | null
	onCourseDetail?: (courseId: string) => void
	onEnter?: (courseId: string) => void
	onViewAll?: () => void
	onAddCourse?: () => void
	onRetry?: () => void
}

const TodayCoursesSection: React.FC<Props> = ({
	courses,
	isLoading = false,
	error = null,
	onCourseDetail,
	onEnter,
	onViewAll,
	onAddCourse,
	onRetry
}) => {
	// Loading state
	if (isLoading) {
		return (
			<div>
				<div className="flex items-center justify-between mb-4 px-1">
					<h3 className="text-lg font-bold text-text-main dark:text-white">今日课程</h3>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[1, 2, 3].map((i) => (
						<div key={i} className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-5 animate-pulse">
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
							<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
							<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
						</div>
					))}
				</div>
			</div>
		)
	}

	// Error state
	if (error) {
		return (
			<div>
				<div className="flex items-center justify-between mb-4 px-1">
					<h3 className="text-lg font-bold text-text-main dark:text-white">今日课程</h3>
				</div>
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
					<span className="material-symbols-outlined text-3xl text-red-500 mb-2">error_outline</span>
					<p className="text-sm text-red-600 dark:text-red-400 mb-3">{error.message || '加载课程失败'}</p>
					{onRetry && (
						<button
							type="button"
							className="px-4 h-9 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
							onClick={onRetry}
						>
							重试
						</button>
					)}
				</div>
			</div>
		)
	}

	// Empty state
	if (courses.length === 0) {
		return (
			<div>
				<div className="flex items-center justify-between mb-4 px-1">
					<h3 className="text-lg font-bold text-text-main dark:text-white">今日课程</h3>
					<button type="button" className="text-xs text-primary hover:underline" onClick={() => onViewAll?.()}>
						查看全部课程
					</button>
				</div>
				<div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-8 text-center">
					<div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
						<span className="material-symbols-outlined text-3xl text-text-secondary">event_available</span>
					</div>
					<h4 className="text-base font-semibold text-text-main dark:text-white mb-1">今天没有课程安排</h4>
					<p className="text-sm text-text-secondary mb-4">休息一下，或者去备课吧</p>
					{onAddCourse && (
						<button
							type="button"
							className="px-4 h-9 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-600 transition-colors inline-flex items-center gap-2"
							onClick={onAddCourse}
						>
							<span className="material-symbols-outlined text-lg">add</span>
							添加课程安排
						</button>
					)}
				</div>
			</div>
		)
	}

	// Ready state (normal)
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
					className="bg-transparent rounded-xl border-2 border-dashed border-border-color dark:border-slate-700 flex flex-col items-center justify-center p-5 text-center group hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer min-h-[180px]"
					aria-label="添加课程安排"
					onClick={() => onAddCourse?.()}
				>
					<div className="size-12 rounded-full bg-input-bg dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors text-text-secondary">
						<span className="material-symbols-outlined">edit_calendar</span>
					</div>
					<h4 className="font-bold text-text-main dark:text-white text-sm">添加课程安排</h4>
					<p className="text-xs text-text-secondary mt-1">安排更多课程</p>
				</button>
			</div>
		</div>
	)
}

export default TodayCoursesSection
