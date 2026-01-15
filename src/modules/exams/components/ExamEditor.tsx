// 来源 HTML: online_study/考试管理
import React from 'react'
import Modal from '../../../components/ui/Modal'
import type { Exam, ExamStatus } from '@/types/models/exam'

export interface ExamEditorProps {
	open: boolean
	onClose: () => void
	onSave: (payload: Partial<Exam> & { title: string }) => Promise<void> | void
	initialExam?: Exam | null
}

const ExamEditor: React.FC<ExamEditorProps> = ({ open, onClose, onSave, initialExam }) => {
	const [title, setTitle] = React.useState('')
	const [status, setStatus] = React.useState<ExamStatus>('draft')
	const [classLabel, setClassLabel] = React.useState('')
	const [startAt, setStartAt] = React.useState('')
	const [endAt, setEndAt] = React.useState('')
	const [duration, setDuration] = React.useState('')
	const [proctor, setProctor] = React.useState('')
	const [note, setNote] = React.useState('')
	const [saving, setSaving] = React.useState(false)

	React.useEffect(() => {
		if (initialExam) {
			setTitle(initialExam.title)
			setStatus(initialExam.status)
			setClassLabel(initialExam.classLabel ?? '')
			setStartAt(initialExam.startAt ?? '')
			setEndAt(initialExam.endAt ?? '')
			setDuration(initialExam.durationMinutes ? String(initialExam.durationMinutes) : '')
			setProctor(initialExam.proctor ?? '')
			setNote(initialExam.note ?? '')
		} else {
			setTitle('')
			setStatus('draft')
			setClassLabel('')
			setStartAt('')
			setEndAt('')
			setDuration('')
			setProctor('')
			setNote('')
		}
	}, [initialExam])

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		setSaving(true)
		await onSave({
			title,
			status,
			classLabel: classLabel || undefined,
			startAt: startAt || undefined,
			endAt: endAt || undefined,
			durationMinutes: duration ? Number(duration) : undefined,
			proctor: proctor || undefined,
			note: note || undefined
		})
		setSaving(false)
		onClose()
	}

	return (
		<Modal open={open} onClose={onClose} title={initialExam ? '编辑考试' : '新建考试'}>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 gap-3">
					<label className="flex flex-col gap-1 text-xs text-text-secondary">
						考试名称
						<input className="h-10 px-3 rounded-lg border border-border-light" value={title} onChange={(e) => setTitle(e.target.value)} required />
					</label>
					<label className="flex flex-col gap-1 text-xs text-text-secondary">
						描述/备注（占位）
						<textarea className="min-h-[80px] px-3 py-2 rounded-lg border border-border-light" value={note} onChange={(e) => setNote(e.target.value)} placeholder="考纲、监考要求等" />
					</label>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<label className="flex flex-col gap-1 text-xs text-text-secondary">
						状态
						<select className="h-10 px-3 rounded-lg border border-border-light" value={status} onChange={(e) => setStatus(e.target.value as ExamStatus)}>
							<option value="draft">草稿</option>
							<option value="scheduled">未开始</option>
							<option value="ongoing">进行中</option>
							<option value="completed">已结束</option>
							<option value="review">待审核</option>
							<option value="closed">已关闭</option>
						</select>
					</label>
					<label className="flex flex-col gap-1 text-xs text-text-secondary">
						班级/年级
						<input className="h-10 px-3 rounded-lg border border-border-light" value={classLabel} onChange={(e) => setClassLabel(e.target.value)} placeholder="高二(3)班" />
					</label>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<label className="flex flex-col gap-1 text-xs text-text-secondary">
						开始时间
						<input className="h-10 px-3 rounded-lg border border-border-light" type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
					</label>
					<label className="flex flex-col gap-1 text-xs text-text-secondary">
						结束时间
						<input className="h-10 px-3 rounded-lg border border-border-light" type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
					</label>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<label className="flex flex-col gap-1 text-xs text-text-secondary">
						考试时长 (分钟)
						<input className="h-10 px-3 rounded-lg border border-border-light" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
					</label>
					<label className="flex flex-col gap-1 text-xs text-text-secondary">
						监考老师
						<input className="h-10 px-3 rounded-lg border border-border-light" value={proctor} onChange={(e) => setProctor(e.target.value)} placeholder="李老师" />
					</label>
				</div>
				<div className="flex flex-col gap-1 text-xs text-text-secondary">
					分段设置（占位）
					<p className="text-[11px] text-text-tertiary">TODO: 添加题段、时间窗和反作弊等级等详细配置。</p>
				</div>
				<div className="flex items-center justify-end gap-2 pt-2">
					<button type="button" className="px-3 h-10 rounded-lg border border-border-light" onClick={onClose}>
						取消
					</button>
					<button type="submit" className="px-4 h-10 rounded-lg bg-primary text-white shadow" disabled={saving}>
						{saving ? '保存中...' : '保存考试'}
					</button>
				</div>
			</form>
		</Modal>
	)
}

export default ExamEditor
