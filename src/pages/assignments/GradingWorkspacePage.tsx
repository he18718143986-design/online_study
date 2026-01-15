import React from 'react'
import { useParams } from 'react-router-dom'
import GradingWorkspace from '../../modules/assignments/grading/GradingWorkspace'

const GradingWorkspacePage: React.FC = () => {
	const params = useParams()
	const assignmentId = (params as { assignmentId?: string }).assignmentId ?? 'assignment-001'

	return <GradingWorkspace assignmentId={assignmentId} />
}

export default GradingWorkspacePage
