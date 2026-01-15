import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StudentProfileBreadcrumbs from '../../modules/students/components/StudentProfileBreadcrumbs'
import StudentProfileHeader from '../../modules/students/components/StudentProfileHeader'
import ProgressTimeline from '../../modules/students/components/ProgressTimeline'
import StudentProfileSummary from '../../modules/students/components/StudentProfileSummary'
import useStudentProfile from '../../modules/students/hooks/useStudentProfile'
import { ROUTES } from '../../app/routes'

const StudentProfilePage: React.FC = () => {
	const { studentId } = useParams()
	const navigate = useNavigate()
	const { profile, submissions, mastery, isLoading, error, refetch } = useStudentProfile(studentId)

	const handleExportReport = () => {
		console.log('export report stub', profile?.id)
		// TODO: replace with real download logic
	}

	const breadcrumbs = profile
		? [
			{ label: 'Students', onClick: () => navigate(ROUTES.studentList) },
			{ label: profile.className, onClick: () => navigate(ROUTES.studentList) },
			{ label: profile.name }
		]
		: [{ label: 'Students', onClick: () => navigate(ROUTES.studentList) }]

	const handleAssignmentSelect = (assignmentId: string) => {
		navigate(`${ROUTES.assignmentManagement}?assignmentId=${assignmentId}`)
	}

	return (
		<div className="space-y-4">
			<StudentProfileBreadcrumbs items={breadcrumbs} />
			<StudentProfileHeader onRefresh={() => void refetch()} />

			{error ? <div className="text-sm text-red-600">{error.message}</div> : null}
			{isLoading && !profile ? <div className="text-sm text-text-secondary">加载中...</div> : null}

			{profile ? <StudentProfileSummary profile={profile} onExportReport={handleExportReport} /> : null}
			{profile ? <ProgressTimeline mastery={mastery} submissions={submissions} onAssignmentSelect={handleAssignmentSelect} /> : null}
		</div>
	)
}

export default StudentProfilePage
