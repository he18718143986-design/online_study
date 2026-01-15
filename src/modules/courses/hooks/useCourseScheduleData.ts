/**
 * 来源 HTML: screen_id: 20847ab41b7142b3af7881f060f5c328
 * Generated from Stitch export
 */
import React from 'react'
import { type Course, type CourseSession } from '@/types/models/course'
import { type Student } from '@/types/models/student'
import { type Assignment } from '@/types/models/assignment'
import { type Recording } from '@/types/models/recording'
import coursesService from '@/services/courses.service'
import studentsService from '@/services/students.service'
import assignmentsService from '@/services/assignments.service'
import recordingsService from '@/services/recordings.service'

export type CourseScheduleSession = CourseSession & { classLabel?: string; timeRange?: string }

export interface CourseScheduleData {
	readonly courses: CourseScheduleSession[]
	readonly students: Student[]
	readonly selectedCourseId?: string
}

export interface CourseScheduleActions {
	setSelectedCourse: (courseId?: string) => void
	markAttendance: (studentId: string, status: Student['attendance']) => void
}

export interface CourseScheduleResult {
	data: CourseScheduleData
	isLoading: boolean
	error?: Error
	actions: CourseScheduleActions
}

export function useCourseScheduleData(initialCourseId?: string): CourseScheduleResult {
	const [isLoading, setIsLoading] = React.useState(false)
	const [error, setError] = React.useState<Error | undefined>(undefined)
	const [coursesRaw, setCoursesRaw] = React.useState<Course[]>([])
	const [students, setStudents] = React.useState<Student[]>([])
	const [assignmentsRaw, setAssignmentsRaw] = React.useState<Assignment[]>([])
	const [recordingsRaw, setRecordingsRaw] = React.useState<Recording[]>([])

	const refetch = React.useCallback(async () => {
		setIsLoading(true)
		setError(undefined)
		try {
			const [courses, baseStudents, assignments, recordings] = await Promise.all([
				coursesService.list(),
				studentsService.list(),
				assignmentsService.list(),
				recordingsService.list()
			])
			// 确保所有数据都是数组
			setCoursesRaw(Array.isArray(courses) ? courses : [])
			setStudents(Array.isArray(baseStudents) ? baseStudents : [])
			setAssignmentsRaw(Array.isArray(assignments) ? assignments : [])
			setRecordingsRaw(Array.isArray(recordings) ? recordings : [])
		} catch (err) {
			setError(err as Error)
		} finally {
			setIsLoading(false)
		}
	}, [])

	React.useEffect(() => {
		void refetch()
	}, [refetch])

	const courses = React.useMemo<CourseScheduleSession[]>(() => {
		// 确保 coursesRaw 是数组
		if (!Array.isArray(coursesRaw)) {
			return []
		}
		return coursesRaw.map((course, index) => {
			const [startTime = '00:00', endTime = '01:00'] = (course.timeRange ?? '00:00 - 01:00')
				.split('-')
				.map((value) => value.trim())
			const dayLabel = course.schedule?.split(' ')[0] ?? `周${((index % 7) + 1).toString()}`
			const dateLabel = `${24 + index}`
			const tag =
				course.status === 'live'
					? '直播中'
					: course.status === 'upcoming'
						? '即将开始'
						: course.status === 'completed'
							? '已结束'
							: '待排课'
			const mode: CourseSession['mode'] = course.status === 'completed' ? 'recorded' : 'live'
			return {
				...course,
				className: course.classLabel ?? course.title,
				description: course.description,
				dayLabel,
				dateLabel,
				weekday: (index % 7) + 1,
				startTime,
				endTime,
				tag,
				mode,
				students: students.filter((student) => !student.courseId || student.courseId === course.id),
				assignments: assignmentsRaw.filter((assignment) => assignment.courseId === course.id),
				recordings: recordingsRaw.filter((recording) => recording.courseId === course.id)
			}
		})
	}, [assignmentsRaw, coursesRaw, recordingsRaw, students])

	const defaultCourseId = courses.find((course) => course.status === 'live')?.id ?? courses[0]?.id
	const [selectedCourseId, setSelectedCourseId] = React.useState<string | undefined>(undefined)

	React.useEffect(() => {
		const target = initialCourseId ?? defaultCourseId
		setSelectedCourseId((prev) => prev ?? target)
	}, [initialCourseId, defaultCourseId])

	const markAttendance = React.useCallback((studentId: string, status: Student['attendance']) => {
		setStudents((prev) => prev.map((student) => (student.id === studentId ? { ...student, attendance: status } : student)))
	}, [])

	return {
		data: { courses, students, selectedCourseId },
		isLoading,
		error,
		actions: {
			setSelectedCourse: setSelectedCourseId,
			markAttendance
		}
	}
}

export default useCourseScheduleData
