import React from 'react'

interface StudentProfileHeaderProps {
	onRefresh: () => void
}

const StudentProfileHeader: React.FC<StudentProfileHeaderProps> = ({ onRefresh }) => (
	<div className="flex items-center justify-between">
		<div>
			<h1 className="text-xl font-bold text-text-main">学生档案与进度</h1>
			<p className="text-sm text-text-secondary">查看学生档案、掌握度与提交历史</p>
		</div>
		<button
			type="button"
			className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border-light text-sm font-medium text-text-main hover:bg-background-light"
			onClick={onRefresh}
		>
			<span className="material-symbols-outlined text-[18px]">refresh</span>
			刷新
		</button>
	</div>
)

export default StudentProfileHeader
