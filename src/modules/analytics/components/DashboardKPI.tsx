import React from 'react'

export interface KPIItem {
	id: string
	label: string
	value: string
	sublabel?: string
	badge?: string
	trend?: 'up' | 'down' | 'flat'
}

export interface DashboardKPIProps {
	items: KPIItem[]
}

const trendIcon = (trend?: KPIItem['trend']) => {
	if (trend === 'up') return { icon: 'trending_up', color: 'text-green-600' }
	if (trend === 'down') return { icon: 'trending_down', color: 'text-red-600' }
	return { icon: 'drag_handle', color: 'text-slate-400' }
}

const DashboardKPI: React.FC<DashboardKPIProps> = ({ items }) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
			{items.map((item) => {
				const trend = trendIcon(item.trend)
				return (
					<div key={item.id} className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-1">
						<div className="flex items-center justify-between text-xs text-text-secondary">
							<span>{item.label}</span>
							{item.badge ? <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{item.badge}</span> : null}
						</div>
						<div className="flex items-center gap-2">
							<p className="text-2xl font-bold text-text-main">{item.value}</p>
							<span className={`material-symbols-outlined text-[18px] ${trend.color}`}>{trend.icon}</span>
						</div>
						{item.sublabel ? <p className="text-xs text-text-secondary">{item.sublabel}</p> : null}
					</div>
				)
			})}
		</div>
	)
}

export default DashboardKPI
