import React from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
	id: string
	type: ToastType
	message: string
	duration?: number
	onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({
	id,
	type,
	message,
	duration = 4000,
	onClose
}) => {
	React.useEffect(() => {
		if (duration > 0) {
			const timer = setTimeout(() => {
				onClose(id)
			}, duration)
			return () => clearTimeout(timer)
		}
	}, [id, duration, onClose])

	const getStyles = () => {
		switch (type) {
			case 'success':
				return {
					bg: 'bg-green-50 dark:bg-green-900/30',
					border: 'border-green-200 dark:border-green-800',
					icon: 'check_circle',
					iconColor: 'text-green-600 dark:text-green-400',
					textColor: 'text-green-800 dark:text-green-200'
				}
			case 'error':
				return {
					bg: 'bg-red-50 dark:bg-red-900/30',
					border: 'border-red-200 dark:border-red-800',
					icon: 'error',
					iconColor: 'text-red-600 dark:text-red-400',
					textColor: 'text-red-800 dark:text-red-200'
				}
			case 'warning':
				return {
					bg: 'bg-amber-50 dark:bg-amber-900/30',
					border: 'border-amber-200 dark:border-amber-800',
					icon: 'warning',
					iconColor: 'text-amber-600 dark:text-amber-400',
					textColor: 'text-amber-800 dark:text-amber-200'
				}
			case 'info':
			default:
				return {
					bg: 'bg-blue-50 dark:bg-blue-900/30',
					border: 'border-blue-200 dark:border-blue-800',
					icon: 'info',
					iconColor: 'text-blue-600 dark:text-blue-400',
					textColor: 'text-blue-800 dark:text-blue-200'
				}
		}
	}

	const styles = getStyles()

	return (
		<div
			className={`flex items-start gap-3 p-4 rounded-lg border shadow-md animate-slide-down ${styles.bg} ${styles.border}`}
			role="alert"
		>
			<span className={`material-symbols-outlined text-xl flex-shrink-0 ${styles.iconColor}`}>
				{styles.icon}
			</span>
			<p className={`text-sm font-medium flex-1 ${styles.textColor}`}>{message}</p>
			<button
				type="button"
				className={`flex-shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${styles.textColor}`}
				onClick={() => onClose(id)}
				aria-label="关闭通知"
			>
				<span className="material-symbols-outlined text-lg">close</span>
			</button>
		</div>
	)
}

export interface ToastContainerProps {
	toasts: Array<{ id: string; type: ToastType; message: string; duration?: number }>
	onClose: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
	if (toasts.length === 0) return null

	return (
		<div
			className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
			aria-live="polite"
			aria-label="通知区域"
		>
			{toasts.map((toast) => (
				<div key={toast.id} className="pointer-events-auto">
					<Toast
						id={toast.id}
						type={toast.type}
						message={toast.message}
						duration={toast.duration}
						onClose={onClose}
					/>
				</div>
			))}
		</div>
	)
}

// Toast hook for managing toasts
export function useToast() {
	const [toasts, setToasts] = React.useState<Array<{
		id: string
		type: ToastType
		message: string
		duration?: number
	}>>([])

	const addToast = React.useCallback((type: ToastType, message: string, duration?: number) => {
		const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
		setToasts((prev) => [...prev, { id, type, message, duration }])
		return id
	}, [])

	const removeToast = React.useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id))
	}, [])

	const success = React.useCallback((message: string, duration?: number) => addToast('success', message, duration), [addToast])
	const error = React.useCallback((message: string, duration?: number) => addToast('error', message, duration), [addToast])
	const warning = React.useCallback((message: string, duration?: number) => addToast('warning', message, duration), [addToast])
	const info = React.useCallback((message: string, duration?: number) => addToast('info', message, duration), [addToast])

	return {
		toasts,
		addToast,
		removeToast,
		success,
		error,
		warning,
		info
	}
}

export default Toast
