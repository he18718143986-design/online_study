import React from 'react'

interface ResourceSidebarProps {
	folders: string[]
	selectedFolder: string
	onSelectFolder: (folder: string) => void
}

const ResourceSidebar: React.FC<ResourceSidebarProps> = ({ folders, selectedFolder, onSelectFolder }) => (
	<aside className="w-64 flex-shrink-0 border-r border-border-light bg-white overflow-y-auto p-4">
		<h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">文件夹</h3>
		<ul className="space-y-1 text-sm">
			{folders.map((folder) => (
				<li key={folder}>
					<button
						type="button"
						className={`w-full text-left px-3 py-2 rounded-lg hover:bg-background-light transition-colors ${
							selectedFolder === folder ? 'bg-primary/10 text-primary font-semibold' : 'text-text-main'
						}`}
						onClick={() => onSelectFolder(folder)}
					>
						{folder}
					</button>
				</li>
			))}
		</ul>
		<div className="mt-6 text-xs text-text-secondary">侧边栏树为占位，待接入真实目录结构。</div>
	</aside>
)

export default ResourceSidebar
