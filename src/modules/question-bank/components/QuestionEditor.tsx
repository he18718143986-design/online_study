// 来源 HTML: online_study/题库与试题管理
import React from 'react'
import type { Question } from '@/types/models/question'

export interface QuestionEditorProps {
	question?: Question | null
	onSave: (payload: Partial<Question> & { title: string; content: string }) => Promise<void> | void
}

const versions = [
	{ id: 'v1.1', time: '10:42', summary: '修复 LaTeX 格式，补充解析', current: true },
	{ id: 'v1.0', time: '昨天 16:20', summary: '初始创建，OCR 导入', current: false }
]

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onSave }) => {
	const [title, setTitle] = React.useState(question?.title ?? '')
	const [content, setContent] = React.useState(question?.content ?? '')
	const [status, setStatus] = React.useState<Question['status']>(question?.status ?? 'draft')
	const [saving, setSaving] = React.useState(false)

	React.useEffect(() => {
		setTitle(question?.title ?? '')
		setContent(question?.content ?? '')
		setStatus(question?.status ?? 'draft')
	}, [question])

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		setSaving(true)
		await onSave({ title, content, status })
		setSaving(false)
	}

	const handleUpload = () => {
		// Placeholder for upload logic
		alert('图片上传占位：待接入上传接口')
	}

	return (
		<div className="flex flex-col h-full">
			<form className="flex-1 flex flex-col gap-4" onSubmit={handleSubmit}>
				<input className="w-full text-xl font-bold bg-transparent border border-border-light rounded-lg px-3 py-2 focus:border-primary focus:ring-0" placeholder="输入题目名称..." value={title} onChange={(e) => setTitle(e.target.value)} />
				<div className="flex gap-2">
					<button type="button" className="px-3 h-9 rounded-lg border border-border-light text-xs text-text-secondary hover:border-primary" onClick={handleUpload}>
						上传图片 (占位)
					</button>
					<select className="h-9 px-3 rounded-lg border border-border-light text-sm" value={status} onChange={(e) => setStatus(e.target.value as Question['status'])}>
						<option value="draft">草稿</option>
						<option value="review">审核中</option>
						<option value="published">已发布</option>
					</select>
				</div>
				<div className="flex flex-col lg:flex-row gap-3">
					<div className="flex-1 flex flex-col bg-white rounded-lg border border-border-light shadow-sm">
						<div className="p-2 flex items-center gap-2 border-b border-border-light text-xs text-text-secondary">
							<span className="material-symbols-outlined text-[18px]">functions</span>
							<span>LaTeX 输入</span>
						</div>
						<textarea className="flex-1 min-h-[220px] p-3 text-sm font-mono border-0 focus:ring-0" value={content} onChange={(e) => setContent(e.target.value)} placeholder="输入题干，支持 LaTeX" />
					</div>
					<div className="flex-1 flex flex-col bg-white rounded-lg border border-border-light shadow-sm">
						<div className="p-2 flex items-center gap-2 border-b border-border-light text-xs text-text-secondary">
							<span className="material-symbols-outlined text-[18px]">visibility</span>
							<span>实时预览</span>
							<span className="ml-auto text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">LaTeX 渲染占位</span>
						</div>
						<div className="flex-1 p-3 text-sm text-text-main bg-background-light/60">{content || '预览区域（占位）'}</div>
					</div>
				</div>
				<div className="rounded-lg border border-border-light bg-white p-3 shadow-sm">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">版本快照</h3>
						<button type="button" className="text-xs text-primary">查看全部</button>
					</div>
					<div className="space-y-3">
						{versions.map((v) => (
							<div key={v.id} className="flex items-start gap-2">
								<div className={`size-2.5 rounded-full mt-1 ${v.current ? 'bg-primary' : 'bg-slate-300'}`} aria-hidden />
								<div className="flex-1">
									<div className="flex justify-between text-xs">
										<span className={`font-semibold ${v.current ? 'text-text-main' : 'text-text-secondary'}`}>{v.id}{v.current ? ' (当前)' : ''}</span>
										<span className="text-text-tertiary font-mono">{v.time}</span>
									</div>
									<p className="text-xs text-text-secondary">{v.summary}</p>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="flex items-center justify-end gap-2">
					<button type="button" className="px-3 h-10 rounded-lg border border-border-light">保存草稿</button>
					<button type="submit" className="px-4 h-10 rounded-lg bg-primary text-white shadow" disabled={saving}>
						{saving ? '保存中...' : '提交审核'}
					</button>
				</div>
			</form>
		</div>
	)
}

export default QuestionEditor
