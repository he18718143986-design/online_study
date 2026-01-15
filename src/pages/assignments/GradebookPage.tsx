// 来源 HTML: online_study/成绩册
import React from 'react'
import GradeTable from '../../modules/assignments/gradebook/GradeTable'
import GradeStats from '../../modules/assignments/gradebook/GradeStats'
import type { Student } from '@/types/models/student'
import type { Assignment } from '@/types/models/assignment'

const mockStudents: Student[] = [
	{ id: 's1', name: '张伟', onlineStatus: 'online', attendance: 'present' },
	{ id: 's2', name: '李明', onlineStatus: 'offline', attendance: 'present' },
	{ id: 's3', name: '王芳', onlineStatus: 'online', attendance: 'absent' }
]

const mockAssignments: Assignment[] = [
	{ id: 'a1', courseId: 'c1', title: '函数与导数专题', totalPoints: 100, status: 'published' },
	{ id: 'a2', courseId: 'c1', title: '几何专题训练', totalPoints: 100, status: 'published' },
	{ id: 'a3', courseId: 'c1', title: '数列小测', totalPoints: 50, status: 'published' }
]

const GradebookPage: React.FC = () => {
	const [grades, setGrades] = React.useState<Record<string, Record<string, number | undefined>>>(
		{
			s1: { a1: 95, a2: 88, a3: 42 },
			s2: { a1: 82, a2: 90 },
			s3: { a1: 76 }
		}
	)
	const [notice, setNotice] = React.useState<string | null>(null)

	const handleChange = (studentId: string, assignmentId: string, value: number | undefined) => {
		setGrades((prev) => ({ ...prev, [studentId]: { ...(prev[studentId] ?? {}), [assignmentId]: value } }))
	}

	const handleSave = (studentId: string, assignmentId: string, value: number | undefined) => {
		setNotice(`已保存 ${studentId} 的 ${assignmentId} 分数: ${value ?? '--'}`)
	}

	const handleExportCsv = () => {
		setNotice('CSV 导出占位：待接入后端导出接口')
	}

	return (
		<div className="p-6 space-y-6">
			<header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-xl font-bold text-text-main">成绩册</h1>
					<p className="text-sm text-text-secondary">编辑学生分数、查看统计并支持导出。</p>
				</div>
				<div className="flex items-center gap-2">
					<button className="px-3 h-10 rounded-lg border border-border-light bg-white text-sm" onClick={handleExportCsv}>
						导出 CSV
					</button>
				</div>
			</header>

			{notice ? (
				<div className="flex items-start justify-between gap-2 rounded-lg border border-border-light bg-amber-50 px-3 py-2 text-xs text-amber-800">
					<p>{notice}</p>
					<button className="text-amber-700 hover:text-amber-900" onClick={() => setNotice(null)} aria-label="关闭提示">
						<span className="material-symbols-outlined text-[18px]">close</span>
					</button>
				</div>
			) : null}

			<GradeStats students={mockStudents} assignments={mockAssignments} grades={grades} />
			<GradeTable students={mockStudents} assignments={mockAssignments} grades={grades} onChange={handleChange} onSave={handleSave} />
		</div>
	)
}

export default GradebookPage
