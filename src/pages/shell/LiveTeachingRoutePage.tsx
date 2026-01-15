import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import LiveTeachingPage from '@/pages/live/LiveTeachingPage'

const LiveTeachingRoutePage: React.FC = () => {
	const navigate = useNavigate()

	return (
		<LiveTeachingPage
			onBackToCourse={(courseId) => {
				navigate(ROUTES.courseDetail.replace(':courseId', courseId))
			}}
		/>
	)
}

export default LiveTeachingRoutePage
