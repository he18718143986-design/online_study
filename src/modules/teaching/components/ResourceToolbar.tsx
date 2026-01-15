import React from 'react'

interface ResourceToolbarProps {
	search: string
	onSearchChange: (value: string) => void
}

const ResourceToolbar: React.FC<ResourceToolbarProps> = ({ search, onSearchChange }) => (
	<div className="px-6 pt-5 pb-0">
		<div className="flex items-center text-sm text-text-secondary mb-3">
			<span className="hover:text-primary cursor-pointer">首页</span>
			<span className="mx-2">/</span>
			<span className="text-text-main font-medium">教学资源库</span>
		</div>
		<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
			<div>
				<h1 className="text-2xl font-bold text-text-main tracking-tight">资源库</h1>
				<p className="text-sm text-text-secondary mt-1">管理和分发您的数学竞赛教学材料</p>
			</div>
			<div className="flex gap-3">
				<button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-light rounded-lg text-text-main text-sm font-medium hover:bg-slate-50 shadow-sm" type="button">
					<span className="material-symbols-outlined text-[18px]">sort</span>
					排序
				</button>
				<button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-light rounded-lg text-text-main text-sm font-medium hover:bg-slate-50 shadow-sm" type="button">
					<span className="material-symbols-outlined text-[18px]">view_module</span>
					视图
				</button>
			</div>
		</div>
		<div className="bg-white rounded-xl border border-border-light p-2 flex flex-wrap items-center gap-3 shadow-sm mb-4">
			<div className="flex-1 min-w-[240px] relative">
				<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">search</span>
				<input
					type="text"
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					className="w-full pl-10 pr-4 py-2 bg-background-light border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white placeholder-text-secondary"
					placeholder="搜索资源名称、标签、或上传者..."
				/>
			</div>
			<div className="h-6 w-px bg-border-light hidden md:block" aria-hidden />
			<div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
				<select className="bg-background-light border border-border-light text-sm rounded-lg py-2 pl-3 pr-8 text-text-main cursor-pointer hover:bg-white focus:ring-0">
					<option>所有类型</option>
					<option>文档</option>
					<option>视频</option>
					<option>源码</option>
				</select>
				<select className="bg-background-light border border-border-light text-sm rounded-lg py-2 pl-3 pr-8 text-text-main cursor-pointer hover:bg-white focus:ring-0">
					<option>所有模块</option>
					<option>代数</option>
					<option>几何</option>
					<option>数论</option>
				</select>
			</div>
		</div>
	</div>
)

export default ResourceToolbar
