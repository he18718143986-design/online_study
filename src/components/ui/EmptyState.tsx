import React from 'react'

export interface EmptyStateProps {
	icon?: string
	title: string
	description?: string
	actionLabel?: string
	onAction?: () => void
	className?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({
	icon = 'inbox',
	title,
	description,
	actionLabel,
	onAction,
	className = ''
}) => {
	return (
		<div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
			<div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
				<span className="material-symbols-outlined text-3xl text-text-secondary">{icon}</span>
			</div>
			<h3 className="text-base font-semibold text-text-main dark:text-white mb-1">{title}</h3>
			{description && (
				<p className="text-sm text-text-secondary max-w-sm">{description}</p>
			)}
			{actionLabel && onAction && (
				<button
					type="button"
					className="mt-4 px-4 h-9 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"
					onClick={onAction}
				>
					<span className="material-symbols-outlined text-lg">add</span>
					{actionLabel}
				</button>
			)}
		</div>
	)
}

export default EmptyState
