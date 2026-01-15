/**
 * 来源 HTML: screen_id: db7e4a443f6545ee97956546f94f340d
 * Generated from Stitch export
 */
import React, { type ReactNode } from 'react'

export interface ModalProps {
	open: boolean
	onClose: () => void
	title?: string
	children?: ReactNode
}

// TODO: add portal/focus-trap when wiring real modal infra
const Modal = ({ open, onClose, title, children }: ModalProps) => {
	if (!open) return null
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10">
			<div className="absolute inset-0 bg-gray-500 bg-opacity-60" aria-hidden onClick={onClose} />
			<div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-border-light dark:border-border-dark w-full max-w-lg overflow-hidden">
				<div className="px-4 pt-4 pb-2 sm:px-6 flex items-start justify-between">
					{title ? <h3 className="text-lg font-medium text-text-main dark:text-white">{title}</h3> : <span />}
					<button type="button" className="text-text-secondary hover:text-text-main hover:bg-black/5 rounded-full p-1 transition-colors" aria-label="关闭" onClick={onClose}>
						<span className="material-symbols-outlined">close</span>
					</button>
				</div>
				<div className="px-4 pb-4 sm:px-6">{children}</div>
			</div>
		</div>
	)
}

export default Modal
