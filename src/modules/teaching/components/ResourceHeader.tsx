import React from 'react'

interface ResourceHeaderProps {
	onRefresh: () => void
	onOpenUpload: () => void
}

const ResourceHeader: React.FC<ResourceHeaderProps> = ({ onRefresh, onOpenUpload }) => (
	<header className="h-16 flex items-center justify-between border-b border-border-light bg-white px-6 shrink-0">
		<div className="flex items-center gap-3">
			<div className="size-8 rounded bg-primary text-white flex items-center justify-center">
				<span className="material-symbols-outlined">calculate</span>
			</div>
			<div>
				<h2 className="text-lg font-bold text-text-main">数学竞赛在线学习平台</h2>
				<p className="text-xs text-text-secondary">教师端 · 教学资源库</p>
			</div>
		</div>
		<div className="flex items-center gap-3 text-sm">
			<button
				type="button"
				className="flex items-center gap-2 px-4 py-2 bg-white border border-border-light rounded-lg text-text-main font-medium hover:bg-slate-50 shadow-sm"
				onClick={onRefresh}
			>
				<span className="material-symbols-outlined text-[18px]">history</span>
				操作历史
			</button>
			<button
				type="button"
				className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover shadow-md"
				onClick={onOpenUpload}
			>
				<span className="material-symbols-outlined text-[20px]">cloud_upload</span>
				上传资源
			</button>
		</div>
	</header>
)

export default ResourceHeader
