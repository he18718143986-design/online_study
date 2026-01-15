import React from 'react'

const ResourceExtractorPanel: React.FC = () => (
	<aside className="w-80 bg-white border-l border-border-light shadow-xl flex flex-col">
		<div className="p-4 border-b border-border-light flex items-center justify-between bg-background-light">
			<div className="flex items-center gap-2">
				<span className="material-symbols-outlined text-primary">output</span>
				<h3 className="font-bold text-text-main">资源抽取器</h3>
			</div>
			<span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-bold">占位</span>
		</div>
		<div className="flex-1 overflow-y-auto p-4 text-sm text-text-secondary">
			<div className="p-3 bg-primary/5 border border-primary/20 rounded-lg mb-3">将来在此列出已选择的资源。</div>
			<p>插入到课程动作目前触发 console 日志，后续可替换为实际回调。</p>
		</div>
		<div className="p-4 border-t border-border-light bg-background-light">
			<button className="w-full py-2.5 bg-primary text-white rounded-lg font-bold text-sm shadow hover:bg-primary-hover transition-colors flex items-center justify-center gap-2" type="button">
				<span>插入到课程</span>
				<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
			</button>
		</div>
	</aside>
)

export default ResourceExtractorPanel
