import React from 'react'

interface ResourceUploadDropzoneProps {
	onUploadRequest: () => void
}

const ResourceUploadDropzone: React.FC<ResourceUploadDropzoneProps> = ({ onUploadRequest }) => (
	<div
		className="mb-6 rounded-xl border-2 border-dashed border-border-light bg-background-light hover:bg-primary/5 hover:border-primary/40 transition-colors p-8 flex flex-col items-center justify-center text-center cursor-pointer"
		onClick={onUploadRequest}
	>
		<div className="p-3 bg-white rounded-full shadow-sm mb-3">
			<span className="material-symbols-outlined text-primary text-[32px]">upload_file</span>
		</div>
		<h3 className="text-text-main font-medium">点击或拖拽文件到此处上传</h3>
		<p className="text-text-secondary text-sm mt-1">支持 PDF, DOCX, MP4, TEX 格式，单个文件最大 500MB</p>
	</div>
)

export default ResourceUploadDropzone
