import React from 'react'
import Header from '../components/header/Header'
import Sidebar from '../components/sidebar/Sidebar'

interface Props {
	children?: React.ReactNode
	onNavigate?: (to: string) => void
}

const MainLayout: React.FC<Props> = ({ children, onNavigate }) => {
	return (
		<div className="flex min-h-screen bg-background-light text-text-main" role="application">
			<Sidebar onNavigate={onNavigate} />
			<div className="flex-1 flex flex-col">
				<Header />
				<main className="flex-1 overflow-y-auto" role="main">
					{children}
				</main>
			</div>
		</div>
	)
}

export default MainLayout
