// 来源 HTML: online_study/作业管理
import React from 'react'
import AssignmentList from '../../modules/assignments/components/AssignmentList'
import AssignmentEditor from '../../modules/assignments/components/AssignmentEditor'
import useAssignments from '../../modules/assignments/hooks/useAssignments'
import type { Assignment } from '@/types/models/assignment'
import assignmentsService from '@/services/assignments.service'

const AssignmentManagementPage: React.FC = () => {
	const { assignments, isLoading, error, filters, setFilters, pagination, setPage, setPageSize, createAssignment, updateAssignment, refetch } = useAssignments()
	const [editorOpen, setEditorOpen] = React.useState(false)
	const [editing, setEditing] = React.useState<Assignment | null>(null)
	const [notice, setNotice] = React.useState<string | null>(null)
	const fileInputRef = React.useRef<HTMLInputElement | null>(null)

	React.useEffect(() => {
		try {
			const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
			const q = params.get('notice')
			if (!q) return
			if (q === 'published') setNotice('已发布作业')
			else if (q === 'draft') setNotice('已保存作业草稿')
			else setNotice(decodeURIComponent(q))
		} catch {
			// ignore
		}
	}, [])

	const handleCreate = () => {
		setEditing(null)
		setEditorOpen(true)
	}

	const handleSave = async (payload: Partial<Assignment> & { title: string }) => {
		if (editing) {
			await updateAssignment(editing.id, payload)
			setNotice('已更新作业草稿')
		} else {
			await createAssignment(payload)
			setNotice('已新建作业草稿')
		}
	}

	const handleSelect = (id: string) => {
		const found = assignments.find((a) => a.id === id)
		setEditing(found ?? null)
		setEditorOpen(true)
	}

	const handleImportCsv = () => {
		fileInputRef.current?.click()
	}

	const handleFilePicked = async (file: File | null) => {
		if (!file) return
		try {
			const csvText = await file.text()
			const res = await assignmentsService.importCsv({ csvText, defaultCourseId: filters.courseId })
			setNotice(`CSV 导入成功：新增 ${res.imported} 条作业`)
			await refetch()
		} catch (err) {
			setNotice(`CSV 导入失败：${(err as Error)?.message || '未知错误'}`)
		}
	}

	const handleExportCsv = async () => {
		try {
			const { filename, csv } = await assignmentsService.exportCsv({ courseId: filters.courseId, status: filters.status })
			const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = filename
			a.click()
			URL.revokeObjectURL(url)
			setNotice('已导出 CSV')
		} catch (err) {
			setNotice(`CSV 导出失败：${(err as Error)?.message || '未知错误'}`)
		}
	}

	return (
		<div className="p-6 space-y-6">
			<input
				ref={fileInputRef}
				type="file"
				accept=".csv,text/csv"
				className="hidden"
				aria-label="导入 CSV 文件"
				onChange={(e) => void handleFilePicked(e.target.files?.item(0) ?? null)}
			/>
			<header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-xl font-bold text-text-main">作业管理</h1>
					<p className="text-sm text-text-secondary">创建、筛选和编辑班级作业，支持导入/导出与题库占位。</p>
				</div>
				<div className="flex items-center gap-2">
					<button className="px-3 h-10 rounded-lg border border-border-light bg-white text-sm" onClick={handleImportCsv}>
						<span className="material-symbols-outlined text-[18px] align-middle">upload</span>
						<span className="ml-1">CSV 导入</span>
					</button>
					<button className="px-3 h-10 rounded-lg border border-border-light bg-white text-sm" onClick={handleExportCsv}>
						<span className="material-symbols-outlined text-[18px] align-middle">download</span>
						<span className="ml-1">导出 CSV</span>
					</button>
					<button className="px-3 h-10 rounded-lg bg-primary text-white text-sm shadow" onClick={handleCreate}>
						<span className="material-symbols-outlined text-[18px] align-middle">add</span>
						<span className="ml-1">新建作业</span>
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

			<AssignmentList
				assignments={assignments}
				onSelect={handleSelect}
				onAction={handleSelect}
				onFilterChange={setFilters}
				pagination={pagination}
				onPageChange={setPage}
			/>

			<div className="flex items-center justify-between text-xs text-text-secondary">
				<div>筛选：{filters.courseId ? `课程 ${filters.courseId}` : '全部课程'} / {filters.status ?? '全部状态'}</div>
				<div className="flex items-center gap-2">
					<label className="flex items-center gap-1">
						<span>每页</span>
						<select className="h-8 px-2 rounded border border-border-light" value={pagination.pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
							<option value={6}>6</option>
							<option value={8}>8</option>
							<option value={12}>12</option>
						</select>
						<span>条</span>
					</label>
					<button className="px-3 h-8 rounded-lg border border-border-light bg-white text-xs" onClick={() => void refetch()}>
						刷新
					</button>
				</div>
			</div>

			<AssignmentEditor open={editorOpen} onClose={() => setEditorOpen(false)} onSave={handleSave} initialAssignment={editing} />
		</div>
	)
}

export default AssignmentManagementPage
