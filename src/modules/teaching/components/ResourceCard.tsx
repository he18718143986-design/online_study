import React from 'react'
import type { ResourceItem } from '../hooks/useResources'

export interface ResourceCardProps {
	resource: ResourceItem
	onPreview?: (resource: ResourceItem) => void
	onInsert?: (resource: ResourceItem) => void
	onShare?: (resource: ResourceItem) => void
	onDelete?: (resource: ResourceItem) => void
}

const iconForType = (type: ResourceItem['type']) => {
	switch (type) {
		case 'pdf':
			return 'picture_as_pdf'
		case 'video':
			return 'play_circle'
		case 'doc':
			return 'description'
		case 'tex':
			return 'code'
		default:
			return 'insert_drive_file'
	}
}

const badgeColor = (type: ResourceItem['type']) => {
	if (type === 'pdf') return 'bg-red-50 text-red-600 border-red-100'
	if (type === 'video') return 'bg-purple-50 text-purple-600 border-purple-100'
	if (type === 'tex') return 'bg-slate-100 text-slate-600 border-slate-200'
	if (type === 'doc') return 'bg-blue-50 text-blue-600 border-blue-100'
	return 'bg-slate-50 text-slate-600 border-slate-100'
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onPreview, onInsert, onShare, onDelete }) => {
	const icon = iconForType(resource.type)
	const badge = badgeColor(resource.type)

	return (
		<div className="group relative flex flex-col bg-white dark:bg-surface-dark rounded-xl border border-border-light shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
			<div className="relative h-40 bg-slate-100 rounded-t-xl overflow-hidden flex items-center justify-center">
				<span className={`material-symbols-outlined text-6xl text-slate-300 group-hover:text-primary transition-colors`}>
					{icon}
				</span>
				{resource.durationLabel ? (
					<span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded">{resource.durationLabel}</span>
				) : null}
				<button
					type="button"
					className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity"
					onClick={(e) => {
						e.stopPropagation()
						onPreview?.(resource)
					}}
				>
					<span className="material-symbols-outlined text-[20px] text-white drop-shadow">visibility</span>
				</button>
			</div>
			<div className="p-4 flex flex-col gap-1.5">
				<div className="flex justify-between items-start gap-2">
					<h3 className="font-bold text-text-main text-sm leading-snug line-clamp-2">{resource.title}</h3>
					<div className="flex gap-1">
						<button
							type="button"
							className="text-text-secondary hover:text-text-main"
							onClick={(e) => {
								e.stopPropagation()
								onDelete?.(resource)
							}}
							aria-label="删除资源"
						>
							<span className="material-symbols-outlined text-[20px]">delete</span>
						</button>
					</div>
				</div>
				<div className="flex flex-wrap gap-2 mt-1">
					{resource.tags.map((tag) => (
						<span key={tag} className={`px-2 py-0.5 rounded text-[10px] font-medium border ${badge}`}>
							{tag}
						</span>
					))}
					{resource.module ? (
						<span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100">{resource.module}</span>
					) : null}
				</div>
				<div className="flex items-center justify-between mt-3 pt-3 border-t border-border-light">
					<div className="flex items-center gap-2 text-xs text-text-secondary">
						<span>{resource.uploader ?? '未知上传者'}</span>
						{resource.version ? <span className="text-[10px] font-mono">{resource.version}</span> : null}
						{resource.sizeLabel ? <span className="text-[10px]">{resource.sizeLabel}</span> : null}
					</div>
					<div className="flex items-center gap-2 text-text-secondary">
						<button
							type="button"
							className="hover:text-primary"
							onClick={(e) => {
								e.stopPropagation()
								onInsert?.(resource)
							}}
						>
							<span className="material-symbols-outlined text-[18px]">add_link</span>
						</button>
						<button
							type="button"
							className="hover:text-primary"
							onClick={(e) => {
								e.stopPropagation()
								onShare?.(resource)
							}}
						>
							<span className="material-symbols-outlined text-[18px]">share</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ResourceCard
