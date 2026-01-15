/**
 * 来源 HTML: screen_id: 20847ab41b7142b3af7881f060f5c328
 * Generated from Stitch export
 */
import React, { type ReactNode } from 'react'

export interface DrawerProps {
	open: boolean
	width?: number | string
	onClose: () => void
	children?: ReactNode
	ariaLabel?: string
}

// TODO: extend with focus trapping when integrating a11y utilities
const Drawer = ({ open, width = 480, onClose, children, ariaLabel = '侧边抽屉' }: DrawerProps) => {
	return (
		<aside
			className={`absolute inset-y-0 right-0 bg-white shadow-drawer border-l border-border-light dark:bg-surface-dark dark:border-border-dark z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}
			style={{ width: typeof width === 'number' ? `${width}px` : width }}
			role="dialog"
			aria-modal="true"
			aria-label={ariaLabel}
		>
			<div className="flex items-start justify-end p-3">
				<button type="button" className="text-text-secondary hover:text-text-main hover:bg-black/5 rounded-full p-1 transition-colors" aria-label="关闭抽屉" onClick={onClose}>
					<span className="material-symbols-outlined">close</span>
				</button>
			</div>
			<div className="flex-1 flex flex-col overflow-hidden">{children}</div>
		</aside>
	)
}

export default Drawer
