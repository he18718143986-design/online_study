import React from 'react'
import type { ReportDefinition, ScheduledExport } from '../hooks/useReports'

export interface ReportsLibraryProps {
	reports: ReportDefinition[]
	scheduled: ScheduledExport[]
	onGenerate: (reportId: string) => void | Promise<void>
	onSchedule: (reportId: string, frequency: ScheduledExport['frequency']) => void | Promise<void>
}

const ReportsLibrary: React.FC<ReportsLibraryProps> = ({ reports, scheduled, onGenerate, onSchedule }) => {
	const [active, setActive] = React.useState<string>(reports[0]?.id ?? '')

	const handleGenerate = () => {
		if (!active) return
		void onGenerate(active)
	}

	const handleSchedule = (frequency: ScheduledExport['frequency']) => {
		if (!active) return
		void onSchedule(active, frequency)
	}

	const activeReport = reports.find((r) => r.id === active)

	return (
		<div className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-4 flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-bold text-text-main">报表库</h3>
					<p className="text-sm text-text-secondary">选择报表类型并生成或计划导出</p>
				</div>
				<div className="flex gap-2 text-sm">
					<div className="flex items-center gap-1">
						<button
							type="button"
							className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border-light text-text-main hover:bg-background-light"
							onClick={() => handleSchedule('daily')}
							title="每日导出"
						>
							<span className="material-symbols-outlined text-[16px]">schedule_send</span>
							每日
						</button>
						<button
							type="button"
							className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border-light text-text-main hover:bg-background-light"
							onClick={() => handleSchedule('weekly')}
							title="每周导出"
						>
							<span className="material-symbols-outlined text-[16px]">schedule_send</span>
							每周
						</button>
						<button
							type="button"
							className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border-light text-text-main hover:bg-background-light"
							onClick={() => handleSchedule('monthly')}
							title="每月导出"
						>
							<span className="material-symbols-outlined text-[16px]">schedule_send</span>
							每月
						</button>
					</div>
					<button
						type="button"
						className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border-light text-text-main hover:bg-background-light"
						onClick={() => handleGenerate()}
					>
						<span className="material-symbols-outlined text-[16px]">download</span>
						生成报表
					</button>
				</div>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
				{reports.map((report) => (
					<button
						key={report.id}
						type="button"
						onClick={() => setActive(report.id)}
						className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-border-light dark:border-border-dark hover:border-primary hover:shadow-md transition-all h-full ${
							active === report.id ? 'bg-primary/5 border-primary' : 'bg-surface-light dark:bg-surface-dark'
						}`}
					>
						<div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
							<span className="material-symbols-outlined">analytics</span>
						</div>
						<span className="text-xs font-medium text-text-main text-center">{report.name}</span>
						<p className="text-[11px] text-text-secondary text-center">{report.description}</p>
					</button>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="lg:col-span-2 bg-background-light dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark p-4">
					<p className="text-sm font-semibold text-text-main mb-2">{activeReport?.name ?? '报表预览'}</p>
					<p className="text-xs text-text-secondary mb-3">{activeReport?.description ?? '选择报表类型查看预览'}</p>
					<div className="h-48 bg-white/50 dark:bg-background-dark rounded border border-border-light dark:border-border-dark flex items-center justify-center text-text-secondary text-sm">
						{activeReport ? (
							<div className="text-center">
								<span className="material-symbols-outlined text-4xl text-primary/30 mb-2">bar_chart</span>
								<p className="text-xs">点击"生成报表"按钮下载 {activeReport.name}</p>
							</div>
						) : (
							'请选择报表类型'
						)}
					</div>
				</div>
				<div className="bg-background-light dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark p-4">
					<p className="text-sm font-semibold text-text-main mb-3">已计划导出</p>
					<ul className="space-y-2 text-sm text-text-secondary">
						{scheduled.length === 0 ? <li>暂无计划</li> : null}
						{scheduled.map((item) => (
							<li key={item.id} className="flex items-center justify-between">
								<span>{reports.find((r) => r.id === item.reportId)?.name ?? item.reportId}</span>
								<span className="text-xs text-text-secondary">{item.frequency} · {item.nextRun}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}

export default ReportsLibrary
