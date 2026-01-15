import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'

const MainShellPage: React.FC = () => {
	const navigate = useNavigate()

	return (
		<MainLayout onNavigate={(to) => navigate(to)}>
			<Outlet />
		</MainLayout>
	)
}

export default MainShellPage
