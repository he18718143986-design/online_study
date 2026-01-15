import React from 'react'
import type { StudentProfileData } from '../hooks/useStudentProfile'

export interface StudentProfileSummaryProps {
	profile: StudentProfileData
	onExportReport?: () => void
}

const StatItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
	<div className="bg-background-light dark:bg-background-dark rounded-lg p-3 flex-1 min-w-[140px]">
		<p className="text-xs text-text-secondary">{label}</p>
		<p className="text-lg font-semibold text-text-main mt-1">{value}</p>
	</div>
)

const StudentProfileSummary: React.FC<StudentProfileSummaryProps> = ({ profile, onExportReport }) => {
	return (
		<div className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-4 flex flex-col gap-4">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
				<div className="flex items-center gap-3">
					<div
						className="size-14 rounded-full bg-cover bg-center border border-border-light"
						style={profile.avatar ? { backgroundImage: `url(${profile.avatar})` } : undefined}
						aria-hidden
					/>
					<div>
						<h1 className="text-xl font-bold text-text-main">{profile.name}</h1>
						<p className="text-sm text-text-secondary">{profile.className} · {profile.grade}</p>
						<p className="text-xs text-primary">{profile.handle ?? `@${profile.id}`}</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<button
						type="button"
						className="px-4 py-2 rounded-lg border border-border-light text-sm font-medium text-text-main hover:bg-background-light"
						onClick={onExportReport}
					>
						<span className="material-symbols-outlined text-[18px] align-middle">download</span>
						导出报告
					</button>
					<button
						type="button"
						className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium shadow-sm hover:bg-primary-hover"
					>
						<span className="material-symbols-outlined text-[18px] align-middle">edit</span>
						编辑档案
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				<StatItem label="出勤率" value={`${Math.round(profile.attendanceRate * 100)}%`} />
				<StatItem label="平均分" value={`${Math.round(profile.averageScore)}`} />
				<StatItem label="最后活跃" value={profile.lastActive} />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
				<div className="space-y-1">
					<p className="text-xs text-text-secondary">联系信息</p>
					<p className="text-text-main">邮箱：{profile.email ?? '—'}</p>
					<p className="text-text-main">电话：{profile.phone ?? '—'}</p>
				</div>
				<div className="space-y-1">
					<p className="text-xs text-text-secondary">监护/分组</p>
					<p className="text-text-main">{profile.guardian ?? '—'}</p>
					<p className="text-text-main">分组：{profile.group ?? '—'}</p>
				</div>
			</div>
		</div>
	)
}

export default StudentProfileSummary
