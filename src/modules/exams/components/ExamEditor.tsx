// 来源 HTML: online_study/考试管理
import React from 'react'
import Modal from '../../../components/ui/Modal'
import type { Exam, ExamStatus, ExamSegment, AntiCheatLevel } from '@/types/models/exam'

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
	const [segments, setSegments] = React.useState<ExamSegment[]>([])
	const [antiCheatLevel, setAntiCheatLevel] = React.useState<AntiCheatLevel>('medium')
	const [timeWindow, setTimeWindow] = React.useState('')
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
			setSegments(initialExam.segments ?? [])
			setAntiCheatLevel(initialExam.antiCheatLevel ?? 'medium')
			setTimeWindow(initialExam.timeWindow ? String(initialExam.timeWindow) : '')
		} else {
			setTitle('')
			setStatus('draft')
			setClassLabel('')
			setStartAt('')
			setEndAt('')
			setDuration('')
			setProctor('')
			setNote('')
			setSegments([])
			setAntiCheatLevel('medium')
			setTimeWindow('')
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
			note: note || undefined,
			segments: segments.length > 0 ? segments : undefined,
			antiCheatLevel,
			timeWindow: timeWindow ? Number(timeWindow) : undefined
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
						描述/备注
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
				<div className="space-y-3 rounded-lg border border-border-light p-4 bg-background-light/50">
					<div className="flex items-center justify-between">
						<label className="text-xs font-semibold text-text-main">分段设置</label>
					</div>
					
					{/* 反作弊等级 */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<label className="flex flex-col gap-1 text-xs text-text-secondary">
							反作弊等级
							<select className="h-10 px-3 rounded-lg border border-border-light bg-white" value={antiCheatLevel} onChange={(e) => setAntiCheatLevel(e.target.value as AntiCheatLevel)}>
								<option value="low">低 - 基础检测</option>
								<option value="medium">中 - 标准检测（推荐）</option>
								<option value="high">高 - 严格检测</option>
								<option value="strict">严格 - 最高级别</option>
							</select>
						</label>
						<label className="flex flex-col gap-1 text-xs text-text-secondary">
							时间窗（分钟）
							<input 
								className="h-10 px-3 rounded-lg border border-border-light" 
								type="number" 
								value={timeWindow} 
								onChange={(e) => setTimeWindow(e.target.value)} 
								placeholder="允许在此时间范围内开始考试"
								min="0"
							/>
						</label>
					</div>

					{/* 题段管理 */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-xs text-text-secondary">题段配置</span>
							<button
								type="button"
								className="px-2 h-7 text-xs rounded border border-border-light bg-white hover:bg-background-light"
								onClick={() => {
									const newSegment: ExamSegment = {
										id: `segment-${Date.now()}`,
										name: `题段 ${segments.length + 1}`,
										startTime: 0,
										duration: 30,
										questionCount: 10
									}
									setSegments([...segments, newSegment])
								}}
							>
								+ 添加题段
							</button>
						</div>
						{segments.length === 0 ? (
							<p className="text-[11px] text-text-tertiary py-2">暂无题段，点击"添加题段"开始配置</p>
						) : (
							<div className="space-y-2">
								{segments.map((segment, index) => (
									<div key={segment.id} className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-2 rounded border border-border-light bg-white">
										<input
											className="h-8 px-2 rounded border border-border-light text-xs"
											value={segment.name}
											onChange={(e) => {
												const updated = [...segments]
												updated[index] = { ...updated[index], name: e.target.value }
												setSegments(updated)
											}}
											placeholder="题段名称"
										/>
										<input
											className="h-8 px-2 rounded border border-border-light text-xs"
											type="number"
											value={segment.startTime ?? ''}
											onChange={(e) => {
												const updated = [...segments]
												updated[index] = { ...updated[index], startTime: e.target.value ? Number(e.target.value) : undefined }
												setSegments(updated)
											}}
											placeholder="开始时间(分)"
											min="0"
										/>
										<input
											className="h-8 px-2 rounded border border-border-light text-xs"
											type="number"
											value={segment.duration ?? ''}
											onChange={(e) => {
												const updated = [...segments]
												updated[index] = { ...updated[index], duration: e.target.value ? Number(e.target.value) : undefined }
												setSegments(updated)
											}}
											placeholder="时长(分)"
											min="1"
										/>
										<input
											className="h-8 px-2 rounded border border-border-light text-xs"
											type="number"
											value={segment.questionCount ?? ''}
											onChange={(e) => {
												const updated = [...segments]
												updated[index] = { ...updated[index], questionCount: e.target.value ? Number(e.target.value) : undefined }
												setSegments(updated)
											}}
											placeholder="题目数"
											min="1"
										/>
										<button
											type="button"
											className="h-8 px-2 text-xs rounded border border-red-200 text-red-600 hover:bg-red-50"
											onClick={() => {
												setSegments(segments.filter((_, i) => i !== index))
											}}
										>
											删除
										</button>
									</div>
								))}
							</div>
						)}
					</div>
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
