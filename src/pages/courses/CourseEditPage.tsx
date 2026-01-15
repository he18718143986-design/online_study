/**
 * 课程编辑页面
 * 
 * 路由：/courses/:courseId/edit
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCourseId } from '@/hooks/useRouteId'
import { getCourseDetailUrl } from '@/app/routes'

const CourseEditPage: React.FC = () => {
  // 使用统一的路由参数获取 hook
  const { id: courseId } = useCourseId('course-1')
  const navigate = useNavigate()

  const [title, setTitle] = React.useState(`课程 ${courseId}`)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('课程已更新:', { courseId, title })
    // 保存后返回课程详情
    navigate(getCourseDetailUrl(courseId!))
  }

  const handleCancel = () => {
    // 取消后返回课程详情
    navigate(getCourseDetailUrl(courseId!))
  }

  return (
    <div className="p-6" data-testid="course-edit-page">
      <h1 className="text-xl font-bold mb-4">编辑课程</h1>
      <p className="text-sm text-text-secondary mb-4" data-testid="course-id-display">
        课程 ID: {courseId}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">课程标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded">
            保存
          </button>
          <button type="button" onClick={handleCancel} className="px-4 py-2 rounded border">
            取消
          </button>
        </div>
      </form>
    </div>
  )
}

export default CourseEditPage
