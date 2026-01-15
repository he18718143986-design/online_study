// 来源 HTML: online_study/考试管理
import React from 'react'
import type { Exam } from '@/types/models/exam'
import type { ExamFilters } from '../hooks/useExams'

export interface ExamListProps {
	exams: Exam[]
	onSelect?: (id: string) => void
	onPublish?: (ids: string[]) => void
	onClose?: (ids: string[]) => void
	onFilterChange?: (filters: ExamFilters) => void
}

const statusLabel: Record<Exam['status'], string> = {
	draft: '草稿',
	scheduled: '未开始',
	ongoing: '进行中',
	completed: '已结束',
	review: '待审核',
	closed: '已关闭'
}

const ExamList: React.FC<ExamListProps> = ({ exams, onSelect, onPublish, onClose, onFilterChange }) => {
	const [selectedIds, setSelectedIds] = React.useState<string[]>([])
	const [status, setStatus] = React.useState<Exam['status'] | ''>('')
	const [query, setQuery] = React.useState('')
	const [classLabel, setClassLabel] = React.useState('')

	React.useEffect(() => {
		onFilterChange?.({ status: (status as Exam['status']) || undefined, query: query || undefined, classLabel: classLabel || undefined })
	}, [status, query, classLabel, onFilterChange])

	const toggleSelect = (id: string) => {
		setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
	}

	const bulkPublish = () => {
		onPublish?.(selectedIds)
	}

	const bulkClose = () => {
		onClose?.(selectedIds)
	}

	return (
		<section className="space-y-4">
			<div className="flex flex-col sm:flex-row sm:items-center gap-3">
				<div className="flex-1 min-w-[200px] relative">
					<input className="w-full pl-3 pr-3 py-2 bg-background-light border border-border-light rounded-lg text-sm" placeholder="搜索考试名称" value={query} onChange={(e) => setQuery(e.target.value)} />
				</div>
				<select className="h-10 px-3 rounded-lg border border-border-light bg-white text-sm" value={status} onChange={(e) => setStatus((e.target.value as Exam['status']) || '')}>
					<option value="">全部状态</option>
					<option value="ongoing">进行中</option>
					<option value="scheduled">未开始</option>
					<option value="completed">已结束</option>
					<option value="review">待审核</option>
					<option value="draft">草稿</option>
					<option value="closed">已关闭</option>
				</select>
				<input className="h-10 px-3 rounded-lg border border-border-light bg-white text-sm" placeholder="班级/年级" value={classLabel} onChange={(e) => setClassLabel(e.target.value)} />
				<div className="flex items-center gap-2">
					<button className="px-3 h-10 rounded-lg border border-border-light bg-white text-sm" onClick={bulkPublish} disabled={!selectedIds.length}>
						批量发布
					</button>
					<button className="px-3 h-10 rounded-lg border border-border-light bg-white text-sm" onClick={bulkClose} disabled={!selectedIds.length}>
						批量关闭
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
				{exams.map((exam) => (
					<article key={exam.id} className="bg-white rounded-xl border border-border-light shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
						<div className="p-4 flex flex-col gap-3">
							<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
								<div>
									<div className="flex items-center gap-2 mb-1">
										<span className="bg-gray-100 text-gray-700 text-[11px] font-bold px-2 py-0.5 rounded">{statusLabel[exam.status]}</span>
										{exam.classLabel ? <span className="text-xs text-text-secondary">{exam.classLabel}</span> : null}
									</div>
									<h3 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors cursor-pointer" onClick={() => onSelect?.(exam.id)}>
										{exam.title}
									</h3>
								</div>
								<div className="flex items-center gap-2">
									<label className="flex items-center gap-2 text-xs text-text-secondary">
										<input type="checkbox" className="rounded" checked={selectedIds.includes(exam.id)} onChange={() => toggleSelect(exam.id)} />
										<span>选择</span>
									</label>
								</div>
							</div>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-text-secondary">
								<div>
									<p className="text-[11px]">开始时间</p>
									<p className="font-medium text-text-main">{exam.startAt ?? '待定'}</p>
								</div>
								<div>
									<p className="text-[11px]">结束时间</p>
									<p className="font-medium text-text-main">{exam.endAt ?? '未结束'}</p>
								</div>
								<div>
									<p className="text-[11px]">时长</p>
									<p className="font-medium text-text-main">{exam.durationMinutes ? `${exam.durationMinutes} 分钟` : '未设置'}</p>
								</div>
								<div>
									<p className="text-[11px]">监考</p>
									<p className="font-medium text-text-main">{exam.proctor ?? '未分配'}</p>
								</div>
							</div>

							<div className="flex items-center justify-between text-xs text-text-secondary">
								{exam.token ? (
									<div className="flex items-center gap-2 px-2 py-1 rounded bg-background-light border border-border-light">
										<span className="uppercase font-bold tracking-wide">Token</span>
										<code className="text-sm text-primary font-bold">{exam.token}</code>
									</div>
								) : (
									<span className="text-[11px]">保存后自动生成 Token</span>
								)}
								<div className="flex items-center gap-2">
									{exam.participants ? <span>参与 {exam.participants.current}/{exam.participants.total}</span> : null}
								</div>
							</div>
						</div>
					</article>
				))}
			</div>

			{!exams.length ? <div className="text-sm text-text-secondary">暂无考试，调整筛选或新建。</div> : null}
		</section>
	)
}

export default ExamList
