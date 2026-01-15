import React from 'react'

interface ResourceUploadModalProps {
	visible: boolean
	onClose: () => void
	onUpload: () => void
}

const ResourceUploadModal: React.FC<ResourceUploadModalProps> = ({ visible, onClose, onUpload }) => {
	if (!visible) return null

	return (
		<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl w-full max-w-xl p-6 relative">
				<button className="absolute right-4 top-4 text-text-secondary hover:text-text-main" onClick={onClose}>
					<span className="material-symbols-outlined">close</span>
				</button>
				<h3 className="text-lg font-bold text-text-main mb-2">上传资源</h3>
				<p className="text-sm text-text-secondary mb-4">拖拽或点击选择文件，提交后将调用上传占位逻辑。</p>
				<div
					className="border-2 border-dashed border-border-light rounded-lg p-6 text-center bg-background-light hover:border-primary/60 hover:bg-primary/5 transition-colors cursor-pointer"
					onClick={onUpload}
				>
					<span className="material-symbols-outlined text-primary text-4xl">upload</span>
					<p className="mt-2 text-text-main font-medium">点击触发上传 (stub)</p>
					<p className="text-xs text-text-secondary">当前上传逻辑为占位，待接入真实上传接口</p>
				</div>
			</div>
		</div>
	)
}

export default ResourceUploadModal
