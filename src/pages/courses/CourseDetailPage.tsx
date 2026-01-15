/**
 * 来源 HTML: screen_id: db7e4a443f6545ee97956546f94f340d
 * Generated from Stitch export
 */
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CourseOverview from '../../modules/courses/components/CourseOverview'
import CourseTabs from '../../modules/courses/components/CourseTabs'
import CourseStudentsPanel from '../../modules/courses/components/CourseStudentsPanel'
import CourseAssignmentsPanel from '../../modules/courses/components/CourseAssignmentsPanel'
import CourseRecordingsPanel from '../../modules/courses/components/CourseRecordingsPanel'
import { type MetricPreview } from '../../modules/courses/types'
import useCourseDetail from '../../modules/courses/hooks/useCourseDetail'
import MetricCard from '../../components/widgets/MetricCard'
import { ROUTES } from '../../app/routes'
import recordingsService from '@/services/recordings.service'

const CourseDetailPage: React.FC = () => {
	const params = useParams()
	const courseId = (params as any)?.courseId || 'course-1'
	const navigate = useNavigate()

	// TODO: integrate real API via modules/courses/services
	const {
		data: { course, students, assignments, recordings },
		actions
	} = useCourseDetail(courseId)
	const [activeTab, setActiveTab] = React.useState<'overview' | 'students' | 'assignments' | 'recordings' | 'settings'>('overview')

	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

	const pollRecordingBeforeNavigate = React.useCallback(
		async (recordingId: string) => {
			// Quick pre-poll so the target page is more likely to see a ready recording.
			// No extra UI here; bounded retries keep the click responsive.
			const maxAttempts = 6
			for (let attempt = 0; attempt < maxAttempts; attempt++) {
				const rec = await recordingsService.get(recordingId)
				if (!rec) break
				if (rec.status && rec.status !== 'processing') break
				await sleep(700)
			}
		},
		[]
	)

	React.useEffect(() => {
		if (activeTab !== 'recordings') return
		if (!recordings.some((r) => r.status === 'processing')) return

		let cancelled = false
		let ticks = 0
		const timer = window.setInterval(() => {
			ticks += 1
			if (cancelled) return
			void actions.refresh()
			// Stop after a short window; recordings.service will eventually flip status anyway.
			if (ticks >= 8) window.clearInterval(timer)
		}, 1200)

		return () => {
			cancelled = true
			window.clearInterval(timer)
		}
	}, [activeTab, recordings, actions])

	const breadcrumb = ['教学总览', '课程管理', course.title]
	const stats = course.stats || { studentsTotal: 0, participationRate: 0, homeworkSubmissionRate: 0 }
	const metrics: MetricPreview[] = [
		{ key: 'students', label: '学生总数', value: stats.studentsTotal, unit: '人', color: 'blue', progress: 100 },
		{ key: 'participation', label: '参与率', value: stats.participationRate, unit: '%', color: 'purple', progress: stats.participationRate },
		{ key: 'homework', label: '作业提交率', value: stats.homeworkSubmissionRate, unit: '%', color: 'orange', progress: stats.homeworkSubmissionRate }
	]

	const renderTabContent = () => {
		switch (activeTab) {
			case 'students':
				return <CourseStudentsPanel students={students} />
			case 'assignments':
				return <CourseAssignmentsPanel assignments={assignments} />
			case 'recordings':
				return <CourseRecordingsPanel recordings={recordings} />
			case 'settings':
				return <div className="text-sm text-text-secondary">课程设置功能即将上线，敬请期待。</div>
			case 'overview':
			default:
				return <CourseAssignmentsPanel assignments={assignments.slice(0, 3)} />
		}
	}

	const handleStartLive = () => {
		navigate(`${ROUTES.liveTeaching}?courseId=${encodeURIComponent(courseId)}`)
	}

	const handleViewRecording = async (recordingId?: string) => {
		if (!recordingId) {
			navigate(`${ROUTES.recordings}?courseId=${encodeURIComponent(courseId)}`)
			return
		}
		await pollRecordingBeforeNavigate(recordingId)
		navigate(`${ROUTES.recordings}?courseId=${encodeURIComponent(courseId)}&recordingId=${encodeURIComponent(recordingId)}`)
	}

	const handleGoToAssignments = () => {
		navigate(ROUTES.assignmentManagement)
	}

	const handleEditCourse = () => {
		navigate(ROUTES.courseEdit.replace(':courseId', courseId))
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
			<nav className="flex items-center text-sm text-text-secondary" aria-label="Breadcrumb">
				{breadcrumb.map((item, idx) => (
					<span key={item} className="flex items-center">
						<span className={idx === breadcrumb.length - 1 ? 'text-text-main font-medium dark:text-gray-200' : 'hover:text-primary transition-colors cursor-pointer'}>{item}</span>
						{idx < breadcrumb.length - 1 ? <span className="mx-2 text-gray-400" aria-hidden>/</span> : null}
					</span>
				))}
			</nav>

			<CourseOverview
				course={course}
				onStartLive={handleStartLive}
				onViewRecording={() => void handleViewRecording(recordings[0]?.id)}
				onEdit={handleEditCourse}
			/>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{metrics.map((metric) => (
					<MetricCard
						key={metric.key}
						keyName={metric.key}
						label={metric.label}
						value={metric.value}
						unit={metric.unit}
						color={metric.color}
						progress={metric.progress}
					/>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				<div className="lg:col-span-4 xl:col-span-3 space-y-6">
					<div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-5">
						<h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">课程概况</h3>
						<div className="space-y-6">
							<div>
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm text-text-secondary">学生总数</span>
									<span className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">+5 本周</span>
								</div>
								<div className="text-3xl font-bold text-text-main dark:text-white">
									{stats.studentsTotal} <span className="text-sm font-normal text-text-secondary">人</span>
								</div>
							</div>
							<div>
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm text-text-secondary">近30日参与率</span>
									<span className="text-sm font-medium text-text-main dark:text-white">{stats.participationRate}%</span>
								</div>
								<div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
									<div className="bg-primary h-2 rounded-full" style={{ width: `${stats.participationRate}%` }} aria-label="参与率" />
								</div>
							</div>
							<div>
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm text-text-secondary">作业提交率</span>
									<span className="text-sm font-medium text-text-main dark:text-white">{stats.homeworkSubmissionRate}%</span>
								</div>
								<div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
									<div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${stats.homeworkSubmissionRate}%` }} aria-label="作业提交率" />
								</div>
							</div>
						</div>
					</div>

					<div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors">
						<div className="relative h-32 bg-gray-900 flex items-center justify-center overflow-hidden">
							<div className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${recordings[0]?.preview || ''})` }} aria-hidden />
							<div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" aria-hidden />
							<div className="relative z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/50 text-white group-hover:bg-primary group-hover:border-primary transition-all">
								<span className="material-symbols-outlined">play_arrow</span>
							</div>
							<span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">{recordings[0]?.duration}</span>
						</div>
						<div className="p-4">
							<div className="flex items-start justify-between gap-2">
								<div>
									<h4 className="text-sm font-bold text-text-main dark:text-white line-clamp-1">{recordings[0]?.title}</h4>
									<p className="text-xs text-text-secondary mt-1">录播已生成</p>
								</div>
							</div>
							<button type="button" onClick={() => void handleViewRecording(recordings[0]?.id)} className="mt-3 w-full py-1.5 text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded border border-primary/20 transition-colors" aria-label="查看回放数据">
								查看回放数据
							</button>
						</div>
					</div>

					<div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-2 space-y-2">
						<button type="button" onClick={() => handleGoToAssignments()} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group" aria-label="批改作业">
							<div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center" aria-hidden>
								<span className="material-symbols-outlined text-[18px]">add_task</span>
							</div>
							<div>
								<p className="text-sm font-medium text-text-main dark:text-white group-hover:text-primary transition-colors">批改作业</p>
								<p className="text-xs text-text-secondary">3 份待批改 (含手写公式)</p>
							</div>
						</button>
						<button type="button" className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group" aria-label="答疑讨论区">
							<div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center" aria-hidden>
								<span className="material-symbols-outlined text-[18px]">forum</span>
							</div>
							<div>
								<p className="text-sm font-medium text-text-main dark:text-white group-hover:text-primary transition-colors">答疑讨论区</p>
								<p className="text-xs text-text-secondary">5 条新回复</p>
							</div>
						</button>
					</div>
				</div>

				<div className="lg:col-span-8 xl:col-span-9 flex flex-col h-full">
					<div className="bg-surface-light dark:bg-surface-dark rounded-t-xl border-b border-border-light dark:border-border-dark px-2 sticky top-0 z-20">
						<CourseTabs activeTab={activeTab} onTabChange={setActiveTab} />
					</div>
					<div className="bg-surface-light dark:bg-surface-dark rounded-b-xl border border-t-0 border-border-light dark:border-border-dark shadow-sm min-h-[400px] p-6">
						{renderTabContent()}
					</div>
				</div>
			</div>
		</div>
	)
}

export default CourseDetailPage
