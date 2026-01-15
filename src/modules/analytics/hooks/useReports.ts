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
		await new Promise((resolve) => setTimeout(resolve, 500))
		
		// 根据报表类型生成不同的 CSV 内容
		const report = reports.find((r) => r.id === reportId)
		if (!report) throw new Error('报表不存在')

		// 生成 CSV 内容（示例数据）
		let csvContent = ''
		let filename = ''

		switch (reportId) {
			case 'dashboard':
				csvContent = '日期,课程数,作业数,参与率,平均分\n2026-01-10,5,12,92%,85\n2026-01-11,3,8,88%,82'
				filename = `驾驶舱报表_${new Date().toISOString().slice(0, 10)}.csv`
				break
			case 'logins':
				csvContent = '排名,学生姓名,登录次数,最后登录时间\n1,张三,45,2026-01-12 08:30\n2,李四,38,2026-01-12 09:15'
				filename = `登录榜_${new Date().toISOString().slice(0, 10)}.csv`
				break
			case 'practice':
				csvContent = '排名,学生姓名,刷题数,正确率\n1,王五,156,92%\n2,赵六,142,88%'
				filename = `刷题榜_${new Date().toISOString().slice(0, 10)}.csv`
				break
			case 'tests':
				csvContent = '排名,学生姓名,测试次数,平均分\n1,孙七,8,95\n2,周八,7,92'
				filename = `在线测试榜_${new Date().toISOString().slice(0, 10)}.csv`
				break
			case 'exams':
				csvContent = '考试名称,平均分,及格率,最高分,最低分\n数学竞赛,85,92%,98,65'
				filename = `考试分析_${new Date().toISOString().slice(0, 10)}.csv`
				break
			default:
				csvContent = '数据\n示例数据'
				filename = `报表_${reportId}_${new Date().toISOString().slice(0, 10)}.csv`
		}

		// 创建并下载文件
		const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = filename
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		URL.revokeObjectURL(url)

		console.log('报表已生成并下载', filename)
		return filename
	}, [reports])

	// 计算下次运行时间
	const calculateNextRun = React.useCallback((frequency: ScheduledExport['frequency']): string => {
		const now = new Date()
		const next = new Date(now)

		switch (frequency) {
			case 'daily':
				next.setDate(next.getDate() + 1)
				next.setHours(8, 0, 0, 0)
				return `每日 ${next.getHours().toString().padStart(2, '0')}:${next.getMinutes().toString().padStart(2, '0')}`
			case 'weekly':
				// 计算下周一
				const daysUntilMonday = (8 - now.getDay()) % 7 || 7
				next.setDate(next.getDate() + daysUntilMonday)
				next.setHours(8, 0, 0, 0)
				const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
				return `${weekdays[next.getDay()]} ${next.getHours().toString().padStart(2, '0')}:${next.getMinutes().toString().padStart(2, '0')}`
			case 'monthly':
				// 计算下个月1号
				next.setMonth(next.getMonth() + 1, 1)
				next.setHours(9, 0, 0, 0)
				return `每月${next.getDate()}日 ${next.getHours().toString().padStart(2, '0')}:${next.getMinutes().toString().padStart(2, '0')}`
			default:
				return '待计算'
		}
	}, [])

	const scheduleExport = React.useCallback(async (reportId: string, frequency: ScheduledExport['frequency']) => {
		await new Promise((resolve) => setTimeout(resolve, 80))
		const next: ScheduledExport = {
			id: `sched-${Date.now()}`,
			reportId,
			frequency,
			nextRun: calculateNextRun(frequency)
		}
		setScheduled((prev) => [...prev, next])
		console.log('schedule export', next)
		return next
	}, [calculateNextRun])

	return { reports, scheduled, isLoading, error, generateReport, scheduleExport, refetch }
}

export default useReports
