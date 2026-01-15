import React from 'react'
import { Outlet, useMatches, useNavigate } from 'react-router-dom'
import DetailLayout from '@/layouts/DetailLayout'
import type { BreadcrumbItem } from '@/components/breadcrumb/Breadcrumb'

const DetailShellPage: React.FC = () => {
	const navigate = useNavigate()
	const matches = (useMatches?.() ?? []) as any[]

	const breadcrumbItems = React.useMemo<BreadcrumbItem[]>(() => {
		const crumbs = matches.filter((m) => m?.handle?.title)
		return crumbs.map((m, idx) => {
			const isLast = idx === crumbs.length - 1
			return {
				label: String(m.handle.title),
				to: !isLast && m.pathname ? String(m.pathname) : undefined
			}
		})
	}, [matches])

	return (
		<DetailLayout onNavigate={(to) => navigate(to)} breadcrumbItems={breadcrumbItems}>
			<Outlet />
		</DetailLayout>
	)
}

export default DetailShellPage
