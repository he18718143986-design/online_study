/**
 * 来源 HTML: screen_id: db7e4a443f6545ee97956546f94f340d
 * Generated from Stitch export
 */
import React from 'react'
import type { Student } from '@/types/models/student'
import StudentRow from '../../../components/table/StudentRow'

export interface CourseStudentsPanelProps {
	students: Student[]
	onViewStudent?: (studentId: string) => void
}

const CourseStudentsPanel: React.FC<CourseStudentsPanelProps> = ({ students, onViewStudent }) => {
	return (
		<div className="space-y-2">
			{students.map((student) => (
				<StudentRow key={student.id} student={student} onAttendanceChange={() => {}} onViewProfile={() => onViewStudent?.(student.id)} />
			))}
		</div>
	)
}

export default CourseStudentsPanel
