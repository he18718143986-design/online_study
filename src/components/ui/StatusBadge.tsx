/**
 * 来源 HTML: screen_id: e2ff3e9e9b5148b28a6741d0c8901e64
 * Generated from Stitch export
 */
import React from 'react'

export type StatusTone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral'

export interface StatusBadgeProps {
	label: string
	tone?: StatusTone
	icon?: string
	className?: string
}

// TODO: map these to design tokens if available
const toneClass: Record<StatusTone, string> = {
	primary: 'bg-primary/10 text-primary',
	success: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
	warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
	danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
	neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ label, tone = 'neutral', icon, className = '' }) => {
	return (
		<span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${toneClass[tone]} ${className}`}>
			{icon ? <span className="material-symbols-outlined text-[14px] mr-1" aria-hidden>{icon}</span> : null}
			{label}
		</span>
	)
}

export default StatusBadge
