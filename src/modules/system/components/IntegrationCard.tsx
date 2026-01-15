import React from 'react'

interface IntegrationCardProps {
	title: string
	description: string
	actionLabel: string
	onAction: () => void
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ title, description, actionLabel, onAction }) => (
	<div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm">
		<h3 className="text-base font-bold text-text-main-light dark:text-text-main-dark mb-2">{title}</h3>
		<p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">{description}</p>
		<button
			type="button"
			className="px-3 py-2 rounded-lg bg-white dark:bg-background-dark border border-border-light dark:border-border-dark text-sm font-semibold text-text-main-light dark:text-text-main-dark hover:bg-gray-50 dark:hover:bg-gray-800"
			onClick={onAction}
		>
			{actionLabel}
		</button>
	</div>
)

export default IntegrationCard
