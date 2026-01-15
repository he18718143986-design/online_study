import React from 'react'

export interface ErrorStateProps {
	title?: string
	message: string
	onRetry?: () => void
	retryLabel?: string
	className?: string
}

const ErrorState: React.FC<ErrorStateProps> = ({
	title = '出错了',
	message,
	onRetry,
	retryLabel = '重试',
	className = ''
}) => {
	return (
		<div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
			<div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
				<span className="material-symbols-outlined text-3xl text-red-500">error_outline</span>
			</div>
			<h3 className="text-base font-semibold text-text-main dark:text-white mb-1">{title}</h3>
			<p className="text-sm text-text-secondary max-w-sm mb-4">{message}</p>
			{onRetry && (
				<button
					type="button"
					className="px-4 h-9 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 text-text-main dark:text-white text-sm font-medium hover:border-primary transition-colors flex items-center gap-2"
					onClick={onRetry}
				>
					<span className="material-symbols-outlined text-lg">refresh</span>
					{retryLabel}
				</button>
			)}
		</div>
	)
}

export default ErrorState
