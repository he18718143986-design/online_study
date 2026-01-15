import React from 'react'
import { Outlet } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'

const PublicShellPage: React.FC = () => {
	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	)
}

export default PublicShellPage
