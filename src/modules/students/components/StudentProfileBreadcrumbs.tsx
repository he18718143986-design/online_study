import React from 'react'

export interface BreadcrumbItem {
	label: string
	onClick?: () => void
}

interface StudentProfileBreadcrumbsProps {
	items: BreadcrumbItem[]
}

const StudentProfileBreadcrumbs: React.FC<StudentProfileBreadcrumbsProps> = ({ items }) => (
	<nav aria-label="面包屑" className="text-sm text-text-secondary flex items-center gap-2">
		{items.map((crumb, idx) => {
			const isLast = idx === items.length - 1
			return (
				<span key={crumb.label} className="inline-flex items-center gap-1">
					{crumb.onClick && !isLast ? (
						<button type="button" onClick={crumb.onClick} className="hover:text-primary">
							{crumb.label}
						</button>
					) : (
						<span className="text-text-main">{crumb.label}</span>
					)}
					{!isLast ? <span className="text-text-secondary">/</span> : null}
				</span>
			)
		})}
	</nav>
)

export default StudentProfileBreadcrumbs
