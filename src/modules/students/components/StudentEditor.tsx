import React from 'react'
import Modal from '../../../components/ui/Modal'
import type { Student } from '@/types/models/student'

export interface StudentEditorProps {
	open: boolean
	onClose: () => void
	onSave: (payload: Partial<Student> & { name: string }) => Promise<void> | void
	initialStudent?: Student | null
}

const StudentEditor: React.FC<StudentEditorProps> = ({ open, onClose, onSave, initialStudent }) => {
	const [studentNumber, setStudentNumber] = React.useState('')
	const [grade, setGrade] = React.useState('高一')
	const [className, setClassName] = React.useState('高一 (1) 班')
	const [classId, setClassId] = React.useState('')
	const [name, setName] = React.useState('')
	const [courseId, setCourseId] = React.useState('')
	const [group, setGroup] = React.useState('')
	const [attendance, setAttendance] = React.useState<Student['attendance']>('absent')
	const [onlineStatus, setOnlineStatus] = React.useState<Student['onlineStatus']>('offline')
	const [saving, setSaving] = React.useState(false)

	React.useEffect(() => {
		if (!open) return
		if (initialStudent) {
			setStudentNumber(initialStudent.studentNumber ?? initialStudent.id)
			setGrade(initialStudent.grade ?? '高一')
			setClassName(initialStudent.className ?? '高一 (1) 班')
			setClassId(initialStudent.classId ?? '')
			setName(initialStudent.name ?? '')
			setCourseId(initialStudent.courseId ?? '')
			setGroup((initialStudent as any).group ?? '')
			setAttendance(initialStudent.attendance ?? 'absent')
			setOnlineStatus(initialStudent.onlineStatus ?? 'offline')
		} else {
			setStudentNumber('')
			setGrade('高一')
			setClassName('高一 (1) 班')
			setClassId('')
			setName('')
			setCourseId('')
			setGroup('')
			setAttendance('absent')
			setOnlineStatus('offline')
		}
	}, [initialStudent, open])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		await onSave({
			studentNumber: studentNumber || undefined,
			grade: grade || undefined,
			className: className || undefined,
			classId: classId || undefined,
			name,
			courseId: courseId || undefined,
			group: group || undefined,
			attendance,
			onlineStatus
		})
		setSaving(false)
		onClose()
	}

	return (
		<Modal open={open} onClose={onClose} title={initialStudent ? '编辑学生' : '新建学生'}>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div className="flex flex-col gap-1">
						<label className="text-xs text-text-secondary" htmlFor="student-editor-number">
							学号
						</label>
						<input
							id="student-editor-number"
							name="studentNumber"
							aria-label="学号"
							className="h-10 px-3 rounded-lg border border-border-light"
							value={studentNumber}
							onChange={(e) => setStudentNumber(e.target.value)}
							placeholder="例如：20260001"
						/>
					</div>
					<label className="flex flex-col gap-1 text-xs text-text-secondary">
						年级
						<select aria-label="年级" className="h-10 px-3 rounded-lg border border-border-light" value={grade} onChange={(e) => setGrade(e.target.value)}>
							<option value="高一">高一</option>
							<option value="高二">高二</option>
							<option value="高三">高三</option>
						</select>
					</label>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<label className="flex flex-col gap-1 text-xs text-text-secondary">
						班级
						<select aria-label="班级" className="h-10 px-3 rounded-lg border border-border-light" value={className} onChange={(e) => setClassName(e.target.value)}>
							<option value="高一 (1) 班">高一 (1) 班</option>
							<option value="高一 (2) 班">高一 (2) 班</option>
							<option value="高一 (3) 班">高一 (3) 班</option>
							<option value="高二 (1) 班">高二 (1) 班</option>
							<option value="高二 (2) 班">高二 (2) 班</option>
						</select>
					</label>
					<div className="flex flex-col gap-1">
						<label className="text-xs text-text-secondary" htmlFor="student-editor-classid">
							班级 ID（可选）
						</label>
						<input
							id="student-editor-classid"
							name="classId"
							aria-label="班级 ID"
							className="h-10 px-3 rounded-lg border border-border-light"
							value={classId}
							onChange={(e) => setClassId(e.target.value)}
							placeholder="例如：class-A"
						/>
					</div>
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-xs text-text-secondary" htmlFor="student-editor-name">
						姓名
					</label>
					<input
						id="student-editor-name"
						name="name"
						aria-label="姓名"
						className="h-10 px-3 rounded-lg border border-border-light"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						placeholder="例如：王小明"
					/>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<label className="flex flex-col gap-1 text-xs text-text-secondary">
						课程 ID（可选）
						<input className="h-10 px-3 rounded-lg border border-border-light" value={courseId} onChange={(e) => setCourseId(e.target.value)} placeholder="course-001" />
					</label>
					<label className="flex flex-col gap-1 text-xs text-text-secondary">
						分组（可选）
						<input className="h-10 px-3 rounded-lg border border-border-light" value={group} onChange={(e) => setGroup(e.target.value)} placeholder="直播听课" />
					</label>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<label className="flex flex-col gap-1 text-xs text-text-secondary">
						出勤
						<select className="h-10 px-3 rounded-lg border border-border-light" value={attendance} onChange={(e) => setAttendance(e.target.value as Student['attendance'])}>
							<option value="present">全勤</option>
							<option value="absent">缺勤</option>
						</select>
					</label>
					<label className="flex flex-col gap-1 text-xs text-text-secondary">
						在线状态
						<select className="h-10 px-3 rounded-lg border border-border-light" value={onlineStatus} onChange={(e) => setOnlineStatus(e.target.value as Student['onlineStatus'])}>
							<option value="online">在线</option>
							<option value="offline">离线</option>
						</select>
					</label>
				</div>
				<div className="flex items-center justify-end gap-2 pt-2">
					<button type="button" className="px-3 h-10 rounded-lg border border-border-light" onClick={onClose}>
						取消
					</button>
					<button type="submit" className="px-4 h-10 rounded-lg bg-primary text-white shadow" disabled={saving}>
						{saving ? '保存中...' : initialStudent ? '保存修改' : '创建学生'}
					</button>
				</div>
			</form>
		</Modal>
	)
}

export default StudentEditor
