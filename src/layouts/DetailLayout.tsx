import React from 'react'
import Breadcrumb, { type BreadcrumbItem } from '../components/breadcrumb/Breadcrumb'
import Header from '../components/header/Header'
import Sidebar from '../components/sidebar/Sidebar'

interface Props {
	children?: React.ReactNode
	onNavigate?: (to: string) => void
	breadcrumbItems: BreadcrumbItem[]
}

const DetailLayout: React.FC<Props> = ({ children, onNavigate, breadcrumbItems }) => {
	return (
		<div className="flex min-h-screen bg-background-light text-text-main" role="application">
			<Sidebar onNavigate={onNavigate} />
			<div className="flex-1 flex flex-col">
				<Header />
				<main className="flex-1 overflow-y-auto p-6" role="main">
					<Breadcrumb items={breadcrumbItems} onNavigate={onNavigate} />
					{children}
				</main>
			</div>
		</div>
	)
}

export default DetailLayout
