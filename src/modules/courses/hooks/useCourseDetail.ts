/**
 * 来源 HTML: screen_id: db7e4a443f6545ee97956546f94f340d
 * Generated from Stitch export
 */
import React from 'react'
import { type Assignment } from '@/types/models/assignment'
import { type Course } from '@/types/models/course'
import { type Recording } from '@/types/models/recording'
import { type Student } from '@/types/models/student'
import coursesService from '@/services/courses.service'
import studentsService from '@/services/students.service'
import assignmentsService from '@/services/assignments.service'
import recordingsService from '@/services/recordings.service'

export interface CourseDetailData {
	readonly course: Course
	readonly students: Student[]
	readonly assignments: Assignment[]
	readonly recordings: Recording[]
}

export interface CourseDetailActions {
	refresh: () => Promise<void>
}

export interface CourseDetailResult {
	data: CourseDetailData
	isLoading: boolean
	error?: Error
	actions: CourseDetailActions
}

export function useCourseDetail(courseId: string): CourseDetailResult {
	const [data, setData] = React.useState<CourseDetailData>(() => ({
		course: {
			id: courseId,
			title: '课程加载中…',
			status: 'upcoming'
		},
		students: [],
		assignments: [],
		recordings: []
	}))
	const [isLoading, setIsLoading] = React.useState<boolean>(true)
	const [error, setError] = React.useState<Error | undefined>(undefined)

	const fetchAll = React.useCallback(async () => {
		setIsLoading(true)
		setError(undefined)
		try {
			const course = (await coursesService.get(courseId)) ?? (await coursesService.list()).find((c) => c.id === courseId)
			if (!course) throw new Error('Course not found')
			const [students, assignments, recordings] = await Promise.all([
				studentsService.list({ courseId: course.id }),
				assignmentsService.list({ courseId: course.id }),
				recordingsService.list(course.id)
			])
			setData({ course, students, assignments, recordings })
		} catch (err) {
			setError(err as Error)
		} finally {
			setIsLoading(false)
		}
	}, [courseId])

	React.useEffect(() => {
		void fetchAll()
	}, [fetchAll])

	return {
		data,
		isLoading,
		error,
		actions: { refresh: fetchAll }
	}
}

export default useCourseDetail
