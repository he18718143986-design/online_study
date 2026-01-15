import React from 'react'
import AppLayout from '../../layouts/AppLayout'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAssignmentsUrl } from '../../app/routes'
import assignmentsService from '../../services/assignments.service'

const NewAssignmentPage: React.FC = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [totalPoints, setTotalPoints] = useState<number | ''>('')
  const [publishing, setPublishing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const courseIdFromQuery = React.useMemo(() => {
    try {
      const search = typeof window !== 'undefined' ? window.location.search : ''
      const params = new URLSearchParams(search)
      return params.get('courseId') || ''
    } catch {
      return ''
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!title.trim()) {
      alert('请填写作业标题')
      return
    }

    setSaving(true)
    try {
      await assignmentsService.create({
        title: title.trim(),
        note: description.trim() ? description.trim() : undefined,
        dueAt: dueDate ? new Date(dueDate).toISOString() : undefined,
        totalPoints: totalPoints === '' ? undefined : totalPoints,
        status: publishing ? 'published' : 'draft',
        courseId: courseIdFromQuery || 'unknown-course'
      })
      const notice = publishing ? 'published' : 'draft'
      // 使用 URL helper 生成带通知参数的作业列表 URL
      navigate(getAssignmentsUrl(notice))
    } catch (err) {
      setError((err as Error)?.message || '保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppLayout>
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        <div className="max-w-[900px] mx-auto p-6 lg:p-10">
          <h2 className="text-2xl font-bold text-text-main">新建作业</h2>
          <p className="text-sm text-text-secondary mt-2">在此创建新的作业并配置发布范围、截止时间和评分设置。</p>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">作业标题</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="请输入标题" />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">作业描述</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded h-28" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">截止日期</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">总分</label>
                <input type="number" value={totalPoints} onChange={(e) => setTotalPoints(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="flex items-end">
                <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
                  <input type="checkbox" checked={publishing} onChange={(e) => setPublishing(e.target.checked)} />
                  立即发布
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded" disabled={saving}>
                {saving ? '保存中...' : '保存并返回'}
              </button>
              <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">取消</button>
            </div>
          </form>
        </div>
      </main>
    </AppLayout>
  )
}

export default NewAssignmentPage
