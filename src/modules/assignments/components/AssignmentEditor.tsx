// 来源 HTML: online_study/作业管理
import React from 'react'
import Modal from '../../../components/ui/Modal'
import type { Assignment } from '@/types/models/assignment'

export interface AssignmentEditorProps {
	open: boolean
	onClose: () => void
	onSave: (payload: Partial<Assignment> & { title: string }) => Promise<void> | void
	initialAssignment?: Assignment | null
}

const AssignmentEditor: React.FC<AssignmentEditorProps> = ({ open, onClose, onSave, initialAssignment }) => {
	const [title, setTitle] = React.useState('')
	const [description, setDescription] = React.useState('')
	const [dueAt, setDueAt] = React.useState('')
	const [courseId, setCourseId] = React.useState('')
	const [resources, setResources] = React.useState<string>('')
	const [questionIds, setQuestionIds] = React.useState<string>('')
	const [status, setStatus] = React.useState<Assignment['status']>('draft')
	const [saving, setSaving] = React.useState(false)

	React.useEffect(() => {
		if (initialAssignment) {
			setTitle(initialAssignment.title)
			setDescription(initialAssignment.note ?? '')
			setDueAt(initialAssignment.dueAt ?? '')
			setCourseId(initialAssignment.courseId ?? '')
			setResources(initialAssignment.size ?? '')
			setQuestionIds('')
			setStatus(initialAssignment.status)
		} else {
			setTitle('')
			setDescription('')
			setDueAt('')
			setCourseId('')
			setResources('')
			setQuestionIds('')
			setStatus('draft')
		}
	}, [initialAssignment])

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		setSaving(true)
		await onSave({
			title,
			note: description,
			dueAt: dueAt || undefined,
			courseId: courseId || 'unknown-course',
			size: resources || undefined,
			status,
			// Placeholder for resource + question picker integrations
		})
		setSaving(false)
		onClose()
	}

	const handlePullQuestions = () => {
		setQuestionIds('Q-101, Q-205')
	}

	return (
		<Modal open={open} onClose={onClose} title={initialAssignment ? '编辑作业' : '新建作业'}>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<div className="flex flex-col gap-1">
					<label className="text-xs text-text-secondary">标题</label>
					<input className="h-10 px-3 rounded-lg border border-border-light" value={title} onChange={(e) => setTitle(e.target.value)} required />
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-xs text-text-secondary">描述</label>
					<textarea className="min-h-[80px] px-3 py-2 rounded-lg border border-border-light" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="布置要求、评分标准等" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<label className="flex flex-col gap-1 text-xs text-text-secondary">
						课程 ID
						<input className="h-10 px-3 rounded-lg border border-border-light" value={courseId} onChange={(e) => setCourseId(e.target.value)} placeholder="course-001" />
					</label>
					<label className="flex flex-col gap-1 text-xs text-text-secondary">
						截止日期
						<input className="h-10 px-3 rounded-lg border border-border-light" type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
					</label>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<label className="flex flex-col gap-1 text-xs text-text-secondary">
						状态
						<select className="h-10 px-3 rounded-lg border border-border-light" value={status} onChange={(e) => setStatus(e.target.value as Assignment['status'])}>
							<option value="draft">草稿</option>
							<option value="published">已发布</option>
							<option value="closed">已关闭</option>
							<option value="pending">待处理</option>
							<option value="review">待复核</option>
							<option value="completed">已完成</option>
							<option value="urgent">加急</option>
							<option value="normal">普通</option>
						</select>
					</label>
					<label className="flex flex-col gap-1 text-xs text-text-secondary">
						资源附件（占位）
						<input className="h-10 px-3 rounded-lg border border-border-light" value={resources} onChange={(e) => setResources(e.target.value)} placeholder="如：PPT、PDF" />
					</label>
				</div>
				<div className="flex flex-col gap-1 text-xs text-text-secondary">
					题目选择（占位）
					<div className="flex items-center gap-2">
						<input className="h-10 px-3 rounded-lg border border-border-light flex-1" value={questionIds} onChange={(e) => setQuestionIds(e.target.value)} placeholder="题目 ID 列表" />
						<button type="button" className="px-3 h-10 rounded-lg border border-border-light bg-white text-xs" onClick={handlePullQuestions}>
							拉取题库
						</button>
					</div>
					<p className="text-[11px] text-text-tertiary">TODO: 打开题库选择弹窗并回填题目列表。</p>
				</div>
				<div className="flex items-center justify-end gap-2 pt-2">
					<button type="button" className="px-3 h-10 rounded-lg border border-border-light" onClick={onClose}>
						取消
					</button>
					<button type="submit" className="px-4 h-10 rounded-lg bg-primary text-white shadow" disabled={saving}>
						{saving ? '保存中...' : '保存作业'}
					</button>
				</div>
			</form>
		</Modal>
	)
}

export default AssignmentEditor
