import React from 'react'
import type { SubmissionAttachment } from '../hooks/useGradingQueue'

export interface SubmissionViewerProps {
	attachments: SubmissionAttachment[]
	title?: string
}

const SubmissionViewer: React.FC<SubmissionViewerProps> = ({ attachments, title = '作答内容预览' }) => {
	const [activeId, setActiveId] = React.useState<string | undefined>(attachments[0]?.id)

	React.useEffect(() => {
		setActiveId((prev) => (attachments.some((item) => item.id === prev) ? prev : attachments[0]?.id))
	}, [attachments])

	const active = attachments.find((item) => item.id === activeId) ?? attachments[0]

	return (
		<div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm h-full flex flex-col">
			<div className="flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark">
				<div className="flex items-center gap-3">
					<h3 className="text-sm font-semibold text-text-main dark:text-white">{title}</h3>
					<span className="text-xs text-text-secondary">{attachments.length} 页</span>
				</div>
				<div className="flex items-center gap-2 text-text-secondary">
					<button className="h-9 px-3 rounded-lg border border-border-light bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700" type="button">画笔</button>
					<button className="h-9 px-3 rounded-lg border border-border-light bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700" type="button">文本</button>
					<button className="h-9 px-3 rounded-lg border border-border-light bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700" type="button">标注</button>
				</div>
			</div>

			<div className="flex flex-1 overflow-hidden">
				<div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900/40 p-4 flex items-center justify-center">
					{active ? (
						<div className="bg-white dark:bg-gray-800 rounded-lg shadow-inner border border-border-light dark:border-border-dark max-w-3xl w-full min-h-[520px] flex items-center justify-center overflow-hidden">
							{active.type === 'pdf' ? (
								<div className="text-center text-text-secondary text-sm p-8">PDF 预览占位（{active.label}）</div>
							) : (
								<img src={active.src} alt={active.label} className="w-full h-full object-contain" />
							)}
						</div>
					) : (
						<div className="text-text-secondary text-sm">暂无附件</div>
					)}
				</div>

				<aside className="w-28 border-l border-border-light dark:border-border-dark bg-white dark:bg-surface-dark overflow-y-auto p-3 space-y-2">
					{attachments.map((attachment) => (
						<button
							key={attachment.id}
							type="button"
							onClick={() => setActiveId(attachment.id)}
							className={`w-full rounded-lg border text-left overflow-hidden ${attachment.id === active?.id ? 'border-primary bg-primary/5' : 'border-border-light dark:border-border-dark hover:border-primary/40'}`}
						>
							<div className="aspect-[3/4] w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
								<img src={attachment.src} alt={attachment.label} className="w-full h-full object-cover" />
							</div>
							<div className="px-2 py-2 flex items-center justify-between text-[11px] text-text-secondary">
								<span className="truncate">{attachment.label}</span>
								{attachment.page ? <span className="text-text-tertiary">P{attachment.page}</span> : null}
							</div>
						</button>
					))}
				</aside>
			</div>
		</div>
	)
}

export default SubmissionViewer
