/**
 * 来源 HTML: screen_id: 20847ab41b7142b3af7881f060f5c328
 * Generated from Stitch export
 */
import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import CourseCard from '../../components/cards/CourseCard'
import CourseCalendar from '../../modules/courses/components/CourseCalendar'
import CourseDetailDrawer from '../../modules/courses/components/CourseDetailDrawer'
import ClassRoster from '../../modules/courses/components/ClassRoster'
import useCourseScheduleData from '../../modules/courses/hooks/useCourseScheduleData'

const CourseSchedulePage: React.FC = () => {
	const params = useParams()
	const [searchParams] = useSearchParams()
	const initialCourseId = React.useMemo(() => {
		const searchValue = typeof searchParams?.get === 'function' ? searchParams.get('courseId') : undefined
		const paramValue = (params as Record<string, string | undefined>)?.courseId
		return searchValue ?? paramValue
	}, [params, searchParams])

	// TODO: replace useCourseScheduleData mock with real API (modules/courses/services)
	const {
		data: { courses, students, selectedCourseId },
		actions: { setSelectedCourse, markAttendance }
	} = useCourseScheduleData(initialCourseId)
	const [view, setView] = React.useState<'day' | 'week' | 'month'>('week')

	const selectedCourse = React.useMemo(() => courses.find((course) => course.id === selectedCourseId), [courses, selectedCourseId])

	return (
		<div className="flex min-h-screen bg-background-light text-text-main relative">
			<div className="flex-1 flex flex-col gap-6 p-4">
				<CourseCalendar courses={courses} view={view} onSelectCourse={setSelectedCourse} onViewChange={setView} />
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{courses.map((course) => (
						<CourseCard
							key={course.id}
							id={course.id}
							title={course.title}
							description={course.description}
							classLabel={course.classLabel ?? course.className}
							timeRange={course.timeRange}
							studentsCount={course.students?.length || 0}
							status={course.status}
							onEnter={() => setSelectedCourse(course.id)}
							onMore={() => setSelectedCourse(course.id)}
						/>
					))}
				</div>
			</div>
			<CourseDetailDrawer course={selectedCourse} open={Boolean(selectedCourse)} onClose={() => setSelectedCourse(undefined)}>
				<ClassRoster students={students} onAttendanceChange={markAttendance} />
			</CourseDetailDrawer>
		</div>
	)
}

export default CourseSchedulePage
