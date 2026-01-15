/**
 * Course edit page — simple form to edit basic course fields and navigate back.
 */
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '../../app/routes'
import useCourseDetail from '../../modules/courses/hooks/useCourseDetail'

const CourseEditPage: React.FC = () => {
  const params = useParams()
  const courseId = (params as any)?.courseId || 'course-1'
  const navigate = useNavigate()

  const { data: { course } } = useCourseDetail(courseId)

  const [title, setTitle] = React.useState(course.title || '')
  const [teacher, setTeacher] = React.useState(course.teacher || '')
  const [schedule, setSchedule] = React.useState(course.schedule || '')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: call save API via modules/courses/services
    // Simulate save then navigate back to course detail
    navigate(ROUTES.courseDetail.replace(':courseId', courseId))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">编辑课程</h1>
      <form onSubmit={handleSave} className="space-y-4 bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
        <div>
          <label className="text-sm text-text-secondary block mb-1">课程名称</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded border border-border-light" />
        </div>
        <div>
          <label className="text-sm text-text-secondary block mb-1">主讲教师</label>
          <input value={teacher} onChange={(e) => setTeacher(e.target.value)} className="w-full px-3 py-2 rounded border border-border-light" />
        </div>
        <div>
          <label className="text-sm text-text-secondary block mb-1">上课时间</label>
          <input value={schedule} onChange={(e) => setSchedule(e.target.value)} className="w-full px-3 py-2 rounded border border-border-light" />
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded">保存</button>
          <button type="button" onClick={() => navigate(ROUTES.courseDetail.replace(':courseId', courseId))} className="px-4 py-2 rounded border">取消</button>
        </div>
      </form>
    </div>
  )
}

export default CourseEditPage
