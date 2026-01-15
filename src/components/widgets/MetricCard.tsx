/**
 * 来源 HTML: screen_id: e2ff3e9e9b5148b28a6741d0c8901e64
 * Generated from Stitch export
 */
import React from 'react'

export type MetricColor = 'blue' | 'orange' | 'purple'

export interface MetricCardProps {
	keyName: string
	label: string
	value: number
	unit?: string
	color: MetricColor
	progress?: number
	icon?: string
}

// TODO: share icon/color maps across KPI widgets if new variants appear
const colorMap: Record<MetricColor, string> = {
	blue: 'from-blue-50 to-white dark:from-slate-800 dark:to-slate-750 border-blue-100 dark:border-slate-700 text-blue-500',
	orange: 'from-orange-50 to-white dark:from-slate-800 dark:to-slate-750 border-orange-100 dark:border-slate-700 text-orange-500',
	purple: 'from-purple-50 to-white dark:from-slate-800 dark:to-slate-750 border-purple-100 dark:border-slate-700 text-purple-500'
}

const barColor: Record<MetricColor, string> = {
	blue: 'bg-blue-500',
	orange: 'bg-orange-500',
	purple: 'bg-purple-500'
}

const defaultIcon: Record<MetricColor, string> = {
	blue: 'person_check',
	orange: 'check_circle',
	purple: 'pan_tool'
}

const MetricCard: React.FC<MetricCardProps> = ({ keyName, label, value, unit, color, progress, icon }) => {
	return (
		<article className={`p-5 bg-gradient-to-br rounded-xl border flex flex-col justify-between ${colorMap[color]}`} role="listitem" aria-label={label}>
			<div className="flex justify-between items-start">
				<p className="text-xs font-bold text-text-secondary uppercase">{label}</p>
				<span className="material-symbols-outlined text-lg" aria-hidden>
					{icon || defaultIcon[color]}
				</span>
			</div>
			<div>
				<div className="flex items-baseline gap-1 mt-2">
					<p className="text-3xl font-bold text-text-main dark:text-white font-display tracking-tight">{value}</p>
					{unit ? <span className="text-sm font-bold text-text-secondary">{unit}</span> : null}
				</div>
				{typeof progress === 'number' ? (
					<div className="w-full h-1.5 rounded-full mt-3 overflow-hidden" aria-label={`${label}进度`}>
						<div className={`h-full rounded-full ${barColor[color]}`} style={{ width: `${progress}%` }} />
					</div>
				) : null}
			</div>
		</article>
	)
}

export default MetricCard
