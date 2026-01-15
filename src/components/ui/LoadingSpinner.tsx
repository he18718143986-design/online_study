import React from 'react'

export interface LoadingSpinnerProps {
	size?: 'sm' | 'md' | 'lg'
	label?: string
	fullScreen?: boolean
	className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	size = 'md',
	label = '加载中...',
	fullScreen = false,
	className = ''
}) => {
	const sizeClasses = {
		sm: 'w-4 h-4 border-2',
		md: 'w-8 h-8 border-2',
		lg: 'w-12 h-12 border-3'
	}

	const spinner = (
		<div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
			<div
				className={`${sizeClasses[size]} border-primary border-r-transparent rounded-full animate-spin`}
				role="status"
				aria-label={label}
			/>
			{label && (
				<p className="text-sm text-text-secondary">{label}</p>
			)}
		</div>
	)

	if (fullScreen) {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
				{spinner}
			</div>
		)
	}

	return spinner
}

export default LoadingSpinner
