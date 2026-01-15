import React from 'react'

export type BreadcrumbItem = {
	label: string
	to?: string
}

export interface BreadcrumbProps {
	items: BreadcrumbItem[]
	onNavigate?: (to: string) => void
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
	return (
		<nav aria-label="面包屑" className="text-sm text-text-secondary mb-4">
			{items.map((item, idx) => {
				const isLast = idx === items.length - 1
				return (
					<span key={`${item.label}-${idx}`} className="inline-flex items-center">
						{!isLast && item.to ? (
							<button type="button" className="hover:text-primary" onClick={() => onNavigate?.(item.to)}>
								{item.label}
							</button>
						) : (
							<span className="text-text-main">{item.label}</span>
						)}
						{!isLast ? <span className="mx-2" aria-hidden>/</span> : null}
					</span>
				)
			})}
		</nav>
	)
}

export default Breadcrumb
