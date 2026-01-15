import React from 'react'

export interface ConfirmDialogProps {
	open: boolean
	title: string
	message: string
	confirmLabel?: string
	cancelLabel?: string
	variant?: 'default' | 'danger' | 'warning'
	isLoading?: boolean
	onConfirm: () => void | Promise<void>
	onCancel: () => void
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	open,
	title,
	message,
	confirmLabel = '确认',
	cancelLabel = '取消',
	variant = 'default',
	isLoading = false,
	onConfirm,
	onCancel
}) => {
	const dialogRef = React.useRef<HTMLDivElement>(null)
	const confirmButtonRef = React.useRef<HTMLButtonElement>(null)

	// Focus management
	React.useEffect(() => {
		if (open && confirmButtonRef.current) {
			confirmButtonRef.current.focus()
		}
	}, [open])

	// Handle escape key
	React.useEffect(() => {
		if (!open) return

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && !isLoading) {
				onCancel()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [open, isLoading, onCancel])

	// Prevent body scroll when open
	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
		}
	}, [open])

	if (!open) return null

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget && !isLoading) {
			onCancel()
		}
	}

	const handleConfirm = async () => {
		await onConfirm()
	}

	const getIconAndColor = () => {
		switch (variant) {
			case 'danger':
				return {
					icon: 'warning',
					iconBg: 'bg-red-100 dark:bg-red-900/30',
					iconColor: 'text-red-600 dark:text-red-400',
					buttonClass: 'bg-red-600 hover:bg-red-700 text-white'
				}
			case 'warning':
				return {
					icon: 'help',
					iconBg: 'bg-amber-100 dark:bg-amber-900/30',
					iconColor: 'text-amber-600 dark:text-amber-400',
					buttonClass: 'bg-amber-600 hover:bg-amber-700 text-white'
				}
			default:
				return {
					icon: 'help_outline',
					iconBg: 'bg-primary/10',
					iconColor: 'text-primary',
					buttonClass: 'bg-primary hover:bg-primary-600 text-white'
				}
		}
	}

	const { icon, iconBg, iconColor, buttonClass } = getIconAndColor()

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
			onClick={handleBackdropClick}
			role="dialog"
			aria-modal="true"
			aria-labelledby="confirm-dialog-title"
			aria-describedby="confirm-dialog-message"
		>
			<div
				ref={dialogRef}
				className="w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-xl shadow-modal animate-scale-in"
			>
				<div className="p-6">
					{/* Icon */}
					<div className={`w-12 h-12 mx-auto rounded-full ${iconBg} flex items-center justify-center mb-4`}>
						<span className={`material-symbols-outlined text-2xl ${iconColor}`}>{icon}</span>
					</div>

					{/* Title */}
					<h2
						id="confirm-dialog-title"
						className="text-lg font-bold text-text-main dark:text-white text-center mb-2"
					>
						{title}
					</h2>

					{/* Message */}
					<p
						id="confirm-dialog-message"
						className="text-sm text-text-secondary text-center mb-6"
					>
						{message}
					</p>

					{/* Actions */}
					<div className="flex gap-3">
						<button
							type="button"
							className="flex-1 h-10 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 text-text-main dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
							onClick={onCancel}
							disabled={isLoading}
						>
							{cancelLabel}
						</button>
						<button
							ref={confirmButtonRef}
							type="button"
							className={`flex-1 h-10 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${buttonClass}`}
							onClick={handleConfirm}
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<span className="spinner" aria-hidden="true"></span>
									<span>处理中...</span>
								</>
							) : (
								confirmLabel
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ConfirmDialog
