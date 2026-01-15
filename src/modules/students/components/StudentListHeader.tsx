import React from 'react'

interface StudentListHeaderProps {
	onExportTemplate: () => void
	onCreateStudent: () => void
}

const StudentListHeader: React.FC<StudentListHeaderProps> = ({ onExportTemplate, onCreateStudent }) => (
	<header className="w-full h-16 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark px-6 flex items-center justify-between shrink-0">
		<div>
			<h2 className="text-xl font-bold text-text-main-light dark:text-text-main-dark tracking-tight">学生管理</h2>
			<p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">管理班级学生，查看出勤与成绩，并执行批量操作</p>
		</div>
		<div className="flex items-center gap-2">
			<button
				type="button"
				className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-main-light dark:text-text-main-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
				onClick={onExportTemplate}
			>
				<span className="material-symbols-outlined text-[18px]">download</span>
				导出模板
			</button>
			<button
				type="button"
				className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white transition-colors text-sm font-medium shadow-sm"
				onClick={onCreateStudent}
			>
				<span className="material-symbols-outlined text-[18px]">add</span>
				新建学生
			</button>
		</div>
	</header>
)

export default StudentListHeader
