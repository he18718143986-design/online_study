// 来源 HTML: online_study/考试管理
import React from 'react'
import ExamList from '../../modules/exams/components/ExamList'
import ExamEditor from '../../modules/exams/components/ExamEditor'
import useExams from '../../modules/exams/hooks/useExams'
import type { Exam } from '@/types/models/exam'

const ExamManagementPage: React.FC = () => {
	const { exams, isLoading, error, filters, setFilters, createExam, updateExam, refetch } = useExams()
	const [editorOpen, setEditorOpen] = React.useState(false)
	const [editing, setEditing] = React.useState<Exam | null>(null)
	const [notice, setNotice] = React.useState<string | null>(null)

	const handleNew = () => {
		setEditing(null)
		setEditorOpen(true)
	}

	const handleSave = async (payload: Partial<Exam> & { title: string }) => {
		if (editing) {
			await updateExam(editing.id, payload)
			setNotice('已更新考试配置')
		} else {
			await createExam(payload)
			setNotice('已创建考试草稿')
		}
	}

	const handleSelect = (id: string) => {
		const found = exams.find((exam) => exam.id === id)
		setEditing(found ?? null)
		setEditorOpen(true)
	}

	const handlePublish = (ids: string[]) => {
		ids.forEach((id) => {
			void updateExam(id, { status: 'scheduled' })
		})
		setNotice(`已提交发布 ${ids.length} 场考试`)
	}

	const handleClose = (ids: string[]) => {
		ids.forEach((id) => {
			void updateExam(id, { status: 'closed' })
		})
		setNotice(`已关闭 ${ids.length} 场考试`)
	}

	return (
		<div className="p-6 space-y-6">
			<header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-xl font-bold text-text-main">考试管理</h1>
					<p className="text-sm text-text-secondary">管理考试配置、批量发布/关闭，支持草稿与计划时间。</p>
				</div>
				<div className="flex items-center gap-2">
					<button className="px-3 h-10 rounded-lg border border-border-light bg-white text-sm" onClick={() => void refetch()}>
						刷新
					</button>
					<button className="px-3 h-10 rounded-lg bg-primary text-white text-sm shadow" onClick={handleNew}>
						新建考试
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

			{error ? <div className="text-sm text-red-600">{error.message}</div> : null}
			{isLoading ? <div className="text-sm text-text-secondary">加载中...</div> : null}

			<ExamList exams={exams} onSelect={handleSelect} onPublish={handlePublish} onClose={handleClose} onFilterChange={setFilters} />

			<div className="text-xs text-text-secondary">筛选：{filters.status ?? '全部状态'} / {filters.classLabel ?? '全部班级'}</div>

			<ExamEditor open={editorOpen} onClose={() => setEditorOpen(false)} onSave={handleSave} initialExam={editing} />
		</div>
	)
}

export default ExamManagementPage
