import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import ImmersiveLayout from '@/layouts/ImmersiveLayout'

const ImmersiveShellPage: React.FC = () => {
	const navigate = useNavigate()

	return (
		<ImmersiveLayout onBack={() => navigate(-1)}>
			<Outlet />
		</ImmersiveLayout>
	)
}

export default ImmersiveShellPage
