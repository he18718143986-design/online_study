import React from 'react'

export interface ReportDefinition {
	id: string
	name: string
	description: string
	category: 'dashboard' | 'activity' | 'questions' | 'exams'
}

export interface ScheduledExport {
	id: string
	reportId: string
	frequency: 'daily' | 'weekly' | 'monthly'
	nextRun: string
}

export interface UseReportsResult {
	reports: ReportDefinition[]
	scheduled: ScheduledExport[]
	isLoading: boolean
	error?: Error
	generateReport: (reportId: string) => Promise<string>
	scheduleExport: (reportId: string, frequency: ScheduledExport['frequency']) => Promise<ScheduledExport>
	refetch: () => Promise<void>
}

const mockReports: ReportDefinition[] = [
	{ id: 'dashboard', name: '驾驶舱', description: '课堂与作业综合概览', category: 'dashboard' },
	{ id: 'logins', name: '登录榜', description: '登录活跃度排行', category: 'activity' },
	{ id: 'practice', name: '刷题榜', description: '刷题数量与正确率', category: 'questions' },
	{ id: 'tests', name: '在线测试榜', description: '在线测验参与与成绩', category: 'questions' },
	{ id: 'exams', name: '考试分析', description: '考试成绩与分布', category: 'exams' }
]

const mockScheduled: ScheduledExport[] = [
	{ id: 'sched-1', reportId: 'dashboard', frequency: 'weekly', nextRun: '周一 08:00' },
	{ id: 'sched-2', reportId: 'exams', frequency: 'monthly', nextRun: '每月1日 09:00' }
]

export function useReports(): UseReportsResult {
	const [reports, setReports] = React.useState<ReportDefinition[]>(mockReports)
	const [scheduled, setScheduled] = React.useState<ScheduledExport[]>(mockScheduled)
	const [isLoading, setIsLoading] = React.useState(false)
	const [error, setError] = React.useState<Error | undefined>(undefined)

	const refetch = React.useCallback(async () => {
		setIsLoading(true)
		setError(undefined)
		await new Promise((resolve) => setTimeout(resolve, 120))
		setReports(mockReports)
		setScheduled(mockScheduled)
		setIsLoading(false)
	}, [])

	const generateReport = React.useCallback(async (reportId: string) => {
		await new Promise((resolve) => setTimeout(resolve, 80))
		const fileUrl = `/exports/${reportId}-${Date.now()}.csv`
		console.log('generate report stub', reportId, fileUrl)
		return fileUrl
	}, [])

	const scheduleExport = React.useCallback(async (reportId: string, frequency: ScheduledExport['frequency']) => {
		await new Promise((resolve) => setTimeout(resolve, 80))
		const next: ScheduledExport = {
			id: `sched-${Date.now()}`,
			reportId,
			frequency,
			nextRun: '待计算'
		}
		setScheduled((prev) => [...prev, next])
		console.log('schedule export stub', next)
		return next
	}, [])

	return { reports, scheduled, isLoading, error, generateReport, scheduleExport, refetch }
}

export default useReports
