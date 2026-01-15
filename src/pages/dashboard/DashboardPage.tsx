/**
 * 教学总览（仪表盘）页面
 * 
 * 来源 HTML: screen_id: e2ff3e9e9b5148b28a6741d0c8901e64
 * Generated from Stitch export
 */
import React from 'react'
import AppLayout from '../../layouts/AppLayout'
import TodayCoursesSection from '../../modules/dashboard/components/TodayCoursesSection'
import RealtimeClassStats from '../../modules/dashboard/components/RealtimeClassStats'
import PendingAssignments from '../../modules/dashboard/components/PendingAssignments'
import useDashboardData from '../../modules/dashboard/hooks/useDashboardData'
import type { MetricColor } from '../../components/widgets/MetricCard'
import { useNavigate } from 'react-router-dom'
import { 
  ROUTES, 
  getLiveTeachingUrl, 
  getCourseDetailUrl,
  getAssignmentGradingUrl
} from '../../app/routes'

const DashboardPage: React.FC = () => {
  // TODO: replace useDashboardData mock with real API (modules/dashboard/services)
  const {
    data,
    actions: { refresh }
  } = useDashboardData()

  const navigate = useNavigate()

  // 安全地解构数据，提供默认值
  const courses = data?.courses ?? []
  const assignments = data?.assignments ?? []
  const metrics = data?.metrics ?? []

  // ========================================
  // 导航处理函数（全部使用 URL helpers）
  // ========================================

  const handleCourseDetail = (courseId: string) => {
    navigate(getCourseDetailUrl(courseId))
  }

  const handleEnterClass = (courseId: string) => {
    navigate(getLiveTeachingUrl(courseId))
  }

  const handleViewAllCourses = () => {
    navigate(ROUTES.courseSchedule)
  }

  const handleGradeAssignment = (assignmentId: string) => {
    // 使用新的参数化路由 /assignments/:assignmentId/grading
    navigate(getAssignmentGradingUrl(assignmentId))
  }

  const handleViewAllAssignments = () => {
    navigate(ROUTES.assignmentManagement)
  }

  const handleStartLive = () => {
    navigate(ROUTES.liveTeaching)
  }

  const handleAddCourseSchedule = () => {
    navigate(ROUTES.courseScheduleNew)
  }

  const handleCreateTask = () => {
    navigate(ROUTES.assignmentNew)
  }

  const handleUploadResources = () => {
    navigate(ROUTES.resourceUpload)
  }

  const palette: MetricColor[] = ['blue', 'orange', 'purple']
  const metricsWithColor = metrics.map((metric, index) => ({
    ...metric,
    color: metric.color ?? palette[index % palette.length]
  }))

  return (
    <AppLayout>
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        <div className="max-w-[1280px] mx-auto p-6 lg:p-10 space-y-8">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div>
              <h2 className="text-[28px] font-bold text-text-main dark:text-white leading-tight">下午好，张老师 👋</h2>
              <p className="text-text-secondary text-sm mt-1">
                您今天的工作重点是 <span className="text-text-main dark:text-white font-medium">{courses.length} 节直播课</span> 和{' '}
                <span className="text-text-main dark:text-white font-medium">{assignments.length} 份加急作业</span>。
              </p>
            </div>
            <div className="flex flex-wrap gap-3" role="group" aria-label="快捷操作">
              <button onClick={() => handleCreateTask()} className="flex items-center gap-2 px-4 py-2 bg-surface-light dark:bg-surface-dark border border-border-color dark:border-slate-600 rounded-lg shadow-sm hover:border-primary/50 text-text-main dark:text-white text-sm font-bold transition-all" aria-label="新建任务">
                <span className="material-symbols-outlined text-lg text-primary">add_circle</span>
                新建任务
              </button>
              <button onClick={() => handleUploadResources()} className="flex items-center gap-2 px-4 py-2 bg-surface-light dark:bg-surface-dark border border-border-color dark:border-slate-600 rounded-lg shadow-sm hover:border-primary/50 text-text-main dark:text-white text-sm font-bold transition-all" aria-label="上传资源">
                <span className="material-symbols-outlined text-lg text-primary">cloud_upload</span>
                上传资源
              </button>
              <button onClick={() => handleStartLive()} className="flex items-center gap-2 px-4 py-2 bg-primary text-white border border-primary rounded-lg shadow-md shadow-primary/20 hover:bg-blue-600 text-sm font-bold transition-all active:scale-95 select-none" aria-label="开始直播">
                <span className="material-symbols-outlined text-lg">videocam</span>
                开始直播
              </button>
            </div>
          </header>

          <section>
            <TodayCoursesSection
              courses={courses}
              onCourseDetail={handleCourseDetail}
              onEnter={handleEnterClass}
              onViewAll={handleViewAllCourses}
            />
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" aria-label="课堂数据与待办">
            <div className="xl:col-span-2 space-y-6">
              <RealtimeClassStats metrics={metricsWithColor} />
            </div>
            <div className="xl:col-span-1">
              <PendingAssignments assignments={assignments} onGrade={handleGradeAssignment} onViewAll={handleViewAllAssignments} />
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}

export default DashboardPage
