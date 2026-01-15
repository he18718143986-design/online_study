import React from 'react'
import DashboardKPI from '../../modules/analytics/components/DashboardKPI'
import ReportsLibrary from '../../modules/analytics/components/ReportsLibrary'
import useReports from '../../modules/analytics/hooks/useReports'

const TeachingAnalyticsPage: React.FC = () => {
	const { reports, scheduled, isLoading, error, generateReport, scheduleExport, refetch } = useReports()
	const [timeRange, setTimeRange] = React.useState('本周')
	const [classFilter, setClassFilter] = React.useState('全部班级')
	const [courseFilter, setCourseFilter] = React.useState('全部课程')
	const [topicFilter, setTopicFilter] = React.useState('全部知识点')
	const [notice, setNotice] = React.useState<string | null>(null)

	// TODO: 从 API 获取真实数据
	const kpis = React.useMemo(
		() => [
			{ id: 'pending', label: '批改积压', value: '12', sublabel: '待批改作业', badge: '紧急', trend: 'up' as const },
			{ id: 'participation', label: '班级参与率', value: '68%', sublabel: '较上周 -5%', trend: 'down' as const },
			{ id: 'warnings', label: '低分告警', value: '15', sublabel: '人数', trend: 'up' as const },
			{ id: 'average', label: '平均正确率', value: '82%', sublabel: '本周', trend: 'flat' as const }
		],
		[]
	)

	const handleFilter = () => {
		setNotice(`已应用筛选：${timeRange} / ${classFilter} / ${courseFilter} / ${topicFilter}`)
		setTimeout(() => setNotice(null), 3000)
		// TODO: 调用 API 获取筛选后的数据
	}

	const handleGenerateReport = async (reportId: string) => {
		try {
			await generateReport(reportId)
			setNotice('报表已生成并下载')
			setTimeout(() => setNotice(null), 3000)
		} catch (err) {
			setNotice('报表生成失败，请重试')
			setTimeout(() => setNotice(null), 3000)
		}
	}

	const trendData = [
		{ label: '周一', value: 45, studentId: '20230105' },
		{ label: '周二', value: 60, studentId: '20230108' },
		{ label: '周三', value: 35, studentId: '20230112' },
		{ label: '周四', value: 75, studentId: '20230120' },
		{ label: '周五', value: 80, studentId: '20230126' },
		{ label: '周六', value: 55, studentId: '20230130' },
		{ label: '周日', value: 40, studentId: '20230132' }
	]

	const handleBarClick = (studentId: string) => {
		console.log('datapoint clicked for student', studentId)
		// navigate(`/students/${studentId}`) // Hook into router when wiring navigation
	}

	return (
		<div className="space-y-6">
			<header className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-3xl font-black tracking-tight text-text-main">报表与教学分析</h1>
					<p className="text-text-secondary text-sm">实时监控学生学习数据、考试成绩及班级教学健康度</p>
				</div>
				<div className="flex gap-3 text-sm">
					<button
						type="button"
						className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-border-light bg-white text-text-main font-bold hover:bg-slate-50"
						onClick={() => void refetch()}
					>
						<span className="material-symbols-outlined text-[18px]">history</span>
						历史记录
					</button>
					<button
						type="button"
						className="flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-primary text-white text-sm font-bold shadow-md hover:bg-primary-hover"
						onClick={() => void handleGenerateReport('dashboard')}
					>
						<span className="material-symbols-outlined text-[18px]">add_chart</span>
						生成自定义报表
					</button>
				</div>
			</header>

			{notice ? (
				<div className="flex items-start justify-between gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
					<p>{notice}</p>
					<button className="text-green-700 hover:opacity-70" onClick={() => setNotice(null)} aria-label="关闭提示">
						<span className="material-symbols-outlined text-[18px]">close</span>
					</button>
				</div>
			) : null}

			<section className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-4 shadow-sm">
				<div className="flex flex-wrap items-end gap-4 mb-4">
					<div className="flex flex-col gap-1.5 w-52">
						<label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">时间范围</label>
						<select 
							className="w-full h-10 rounded-lg border border-border-light bg-background-light px-3 text-sm text-text-main focus:ring-2 focus:ring-primary/50" 
							value={timeRange}
							onChange={(e) => setTimeRange(e.target.value)}
						>
							<option>本周</option>
							<option>本月</option>
							<option>本学期</option>
							<option>自定义...</option>
						</select>
					</div>
					<div className="flex flex-col gap-1.5 w-52">
						<label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">班级</label>
						<select 
							className="w-full h-10 rounded-lg border border-border-light bg-background-light px-3 text-sm text-text-main focus:ring-2 focus:ring-primary/50"
							value={classFilter}
							onChange={(e) => setClassFilter(e.target.value)}
						>
							<option>全部班级</option>
							<option>高一(1)班</option>
							<option>高一(3)班</option>
						</select>
					</div>
					<div className="flex flex-col gap-1.5 w-52">
						<label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">课程</label>
						<select 
							className="w-full h-10 rounded-lg border border-border-light bg-background-light px-3 text-sm text-text-main focus:ring-2 focus:ring-primary/50"
							value={courseFilter}
							onChange={(e) => setCourseFilter(e.target.value)}
						>
							<option>全部课程</option>
							<option>高中数学联赛一轮</option>
							<option>解析几何专题</option>
						</select>
					</div>
					<div className="flex flex-col gap-1.5 w-52">
						<label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">知识点</label>
						<select 
							className="w-full h-10 rounded-lg border border-border-light bg-background-light px-3 text-sm text-text-main focus:ring-2 focus:ring-primary/50"
							value={topicFilter}
							onChange={(e) => setTopicFilter(e.target.value)}
						>
							<option>全部知识点</option>
							<option>三角函数</option>
							<option>数列与极限</option>
						</select>
					</div>
					<button 
						className="h-10 px-4 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-bold transition-colors"
						onClick={handleFilter}
					>
						筛选
					</button>
				</div>
				<DashboardKPI items={kpis} />
			</section>

			<section className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-4 flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="material-symbols-outlined text-orange-500">warning</span>
						<h3 className="text-lg font-bold text-text-main">教学预警</h3>
					</div>
					<div className="text-sm text-text-secondary">数据示意，不包含真实计算</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					{[
						{ title: '批改积压', value: '12 份作业', tone: 'text-red-600', pill: '紧急', description: '超过3天未批改的作业' },
						{ title: '参与率异常', value: '<60% 高一(3)班', tone: 'text-orange-600', pill: '需关注', description: '本周参与率低于平均水平' },
						{ title: '低分告警', value: '15 人不及格', tone: 'text-blue-600', pill: '提醒', description: '最近一次考试不及格人数' }
					].map((card) => (
						<div key={card.title} className="rounded-xl border border-border-light dark:border-border-dark bg-background-light/60 dark:bg-surface-dark p-4 shadow-sm">
							<div className="flex items-center justify-between mb-2">
								<p className="text-xs text-text-secondary">{card.title}</p>
								<span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">{card.pill}</span>
							</div>
							<p className={`text-lg font-bold ${card.tone}`}>{card.value}</p>
							<p className="text-xs text-text-secondary mt-1">{card.description}</p>
						</div>
					))}
				</div>
			</section>

			<section className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm">
				<div className="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="material-symbols-outlined text-primary">folder_open</span>
						<h3 className="text-lg font-bold text-text-main">报表库与导出</h3>
					</div>
					{isLoading ? <span className="text-sm text-text-secondary">加载中...</span> : null}
					{error ? <span className="text-sm text-red-600">{error.message}</span> : null}
				</div>
				<div className="p-4">
					<ReportsLibrary
						reports={reports}
						scheduled={scheduled}
						onGenerate={(id) => void handleGenerateReport(id)}
						onSchedule={(id, freq) => {
							void scheduleExport(id, freq).then(() => {
								setNotice('已添加计划导出')
								setTimeout(() => setNotice(null), 3000)
							})
						}}
					/>
				</div>
			</section>

			<section className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-4">
				<h4 className="text-base font-bold text-text-main mb-4">近7日刷题量趋势</h4>
				<div className="relative h-64 w-full mt-2 flex items-end justify-between gap-4 px-2 pb-6" role="img" aria-label="近7日刷题量趋势图">
					{trendData.map((point) => (
						<button
							key={point.label}
							type="button"
							className="group relative flex-1 h-full flex flex-col items-center justify-end"
							onClick={() => handleBarClick(point.studentId)}
						>
							<div className="w-full max-w-[40px] bg-primary/20 group-hover:bg-primary/30 rounded-t-sm transition-all" style={{ height: `${point.value}%` }}>
								<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
									{point.value} 题
								</div>
							</div>
							<span className="text-xs text-text-secondary mt-2">{point.label}</span>
						</button>
					))}
				</div>
				<p className="text-xs text-text-secondary mt-2">提示：点击柱状图可查看该日期的详细数据</p>
			</section>
		</div>
	)
}

export default TeachingAnalyticsPage
