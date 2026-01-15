/**
 * 来源 HTML: screen_id: db7e4a443f6545ee97956546f94f340d
 * Generated from Stitch export
 */
import React from 'react'
import AssignmentItem from '../../../components/cards/AssignmentItem'
import type { Assignment } from '@/types/models/assignment'

export interface CourseAssignmentsPanelProps {
	assignments: Assignment[]
	onOpenAssignment?: (assignmentId: string) => void
}

const CourseAssignmentsPanel: React.FC<CourseAssignmentsPanelProps> = ({ assignments, onOpenAssignment }) => {
	return (
		<div className="space-y-3">
			{assignments.map((assignment) => (
				<AssignmentItem
					key={assignment.id}
					id={assignment.id}
					title={assignment.title}
					classLabel={assignment.classLabel}
					size={assignment.size}
					note={assignment.note}
					status={assignment.status}
					submittedAt={assignment.dueAt ? `上传于 ${assignment.dueAt}` : undefined}
					onAction={() => onOpenAssignment?.(assignment.id)}
				/>
			))}
		</div>
	)
}

export default CourseAssignmentsPanel
