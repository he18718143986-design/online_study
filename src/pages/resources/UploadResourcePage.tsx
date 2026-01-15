import React from 'react'
import AppLayout from '../../layouts/AppLayout'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../app/routes'

const UploadResourcePage: React.FC = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!files || files.length === 0) {
      alert('请选择要上传的文件')
      return
    }

    // Simulate upload
    const fileNames = Array.from(files).map((f) => f.name)
    console.log('Uploading resources', { title, description, fileNames })

    navigate(ROUTES.resourceLibrary)
  }

  return (
    <AppLayout>
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        <div className="max-w-[900px] mx-auto p-6 lg:p-10">
          <h2 className="text-2xl font-bold text-text-main">上传资源</h2>
          <p className="text-sm text-text-secondary mt-2">将教学材料或媒体上传到资源库。</p>

          <form onSubmit={handleSubmit} className="mt-6 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">资源标题</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="资源标题（可选）" />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">说明</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded h-24" />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">选择文件</label>
              <input type="file" multiple onChange={(e) => setFiles(e.target.files)} className="w-full" />
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded">上传并返回</button>
              <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">取消</button>
            </div>
          </form>
        </div>
      </main>
    </AppLayout>
  )
}

export default UploadResourcePage
