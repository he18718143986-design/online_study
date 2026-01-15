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
	const [noticeType, setNoticeType] = React.useState<'info' | 'success' | 'error'>('info')

	const handleChange = (studentId: string, assignmentId: string, value: number | undefined) => {
		setGrades((prev) => ({ ...prev, [studentId]: { ...(prev[studentId] ?? {}), [assignmentId]: value } }))
	}

	const handleSave = (studentId: string, assignmentId: string, value: number | undefined) => {
		setNoticeType('info')
		setNotice(`已保存 ${studentId} 的 ${assignmentId} 分数: ${value ?? '--'}`)
	}

	const handleExportCsv = () => {
		try {
			// 转义 CSV 字段中的特殊字符
			const escapeCsv = (value: unknown): string => {
				if (value == null || value === undefined) return ''
				const str = String(value)
				// 如果包含逗号、引号或换行符，需要用引号包裹并转义引号
				if (/[,\n\r"]/.test(str)) {
					return `"${str.replace(/"/g, '""')}"`
				}
				return str
			}

			// 构建 CSV 内容
			const headers = ['学生姓名', '学号', ...mockAssignments.map((a) => `${a.title} (满分${a.totalPoints ?? 100})`)]
			const rows: string[] = [headers.map(escapeCsv).join(',')]

			// 为每个学生添加一行
			for (const student of mockStudents) {
				const row = [
					escapeCsv(student.name),
					escapeCsv((student as any).studentNumber || ''),
					...mockAssignments.map((a) => {
						const score = grades[student.id]?.[a.id]
						return escapeCsv(score ?? '')
					})
				]
				rows.push(row.join(','))
			}

			const csvContent = rows.join('\n')
			const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' }) // 添加 BOM 以支持 Excel 中文显示
			const url = URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = `成绩册_${new Date().toISOString().slice(0, 10)}.csv`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			URL.revokeObjectURL(url)

			setNoticeType('success')
			setNotice('CSV 导出成功！')
			setTimeout(() => setNotice(null), 3000)
		} catch (error) {
			console.error('导出 CSV 失败:', error)
			setNoticeType('error')
			setNotice('导出失败，请重试')
			setTimeout(() => setNotice(null), 3000)
		}
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
				<div
					className={`flex items-start justify-between gap-2 rounded-lg border px-3 py-2 text-xs ${
						noticeType === 'success'
							? 'border-green-200 bg-green-50 text-green-800'
							: noticeType === 'error'
								? 'border-red-200 bg-red-50 text-red-800'
								: 'border-amber-200 bg-amber-50 text-amber-800'
					}`}
				>
					<p>{notice}</p>
					<button
						className={`hover:opacity-70 ${
							noticeType === 'success'
								? 'text-green-700'
								: noticeType === 'error'
									? 'text-red-700'
									: 'text-amber-700'
						}`}
						onClick={() => setNotice(null)}
						aria-label="关闭提示"
					>
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
