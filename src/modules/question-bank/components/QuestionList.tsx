// 来源 HTML: online_study/题库与试题管理
import React from 'react'
import type { Question } from '@/types/models/question'
import type { QuestionFilters } from '../hooks/useQuestions'

export interface QuestionListProps {
	questions: Question[]
	onSelect?: (id: string) => void
	onFilterChange?: (filters: QuestionFilters) => void
}

const statusTone: Record<Question['status'], string> = {
	draft: 'bg-amber-100 text-amber-700',
	review: 'bg-blue-100 text-blue-700',
	published: 'bg-emerald-100 text-emerald-700'
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, onSelect, onFilterChange }) => {
	const [query, setQuery] = React.useState('')
	const [knowledgePoint, setKnowledgePoint] = React.useState('')
	const [difficulty, setDifficulty] = React.useState('')
	const [type, setType] = React.useState('')
	const [status, setStatus] = React.useState<Question['status'] | ''>('')

	React.useEffect(() => {
		onFilterChange?.({
			query: query || undefined,
			knowledgePoint: knowledgePoint || undefined,
			difficulty: difficulty ? Number(difficulty) : undefined,
			type: type || undefined,
			status: (status as Question['status']) || undefined
		})
	}, [difficulty, knowledgePoint, onFilterChange, query, status, type])

	return (
		<section className="space-y-3">
			<div className="space-y-2">
				<div className="relative">
					<span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">search</span>
					<input className="pl-9 pr-3 py-2 w-full rounded-lg border border-border-light bg-white text-sm" placeholder="搜索题目、ID、标签" value={query} onChange={(e) => setQuery(e.target.value)} />
				</div>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
					<select className="h-9 px-3 rounded-lg border border-border-light bg-white text-sm" value={knowledgePoint} onChange={(e) => setKnowledgePoint(e.target.value)}>
						<option value="">所有知识点</option>
						<option value="数论">数论</option>
						<option value="代数">代数</option>
						<option value="几何">几何</option>
						<option value="函数">函数</option>
					</select>
					<select className="h-9 px-3 rounded-lg border border-border-light bg-white text-sm" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
						<option value="">所有难度</option>
						<option value="1">⭐</option>
						<option value="2">⭐⭐</option>
						<option value="3">⭐⭐⭐</option>
						<option value="4">⭐⭐⭐⭐</option>
						<option value="5">⭐⭐⭐⭐⭐</option>
					</select>
					<select className="h-9 px-3 rounded-lg border border-border-light bg-white text-sm" value={type} onChange={(e) => setType(e.target.value)}>
						<option value="">所有题型</option>
						<option value="证明题">证明题</option>
						<option value="计算题">计算题</option>
						<option value="选择题">选择题</option>
					</select>
					<select className="h-9 px-3 rounded-lg border border-border-light bg-white text-sm" value={status} onChange={(e) => setStatus((e.target.value as Question['status']) || '')}>
						<option value="">所有状态</option>
						<option value="draft">草稿</option>
						<option value="review">审核中</option>
						<option value="published">已发布</option>
					</select>
				</div>
			</div>

			<div className="space-y-3">
				{questions.map((q) => (
					<article key={q.id} className="group flex flex-col gap-2 p-4 border border-border-light rounded-xl bg-white shadow-sm hover:shadow-md cursor-pointer transition" onClick={() => onSelect?.(q.id)}>
						<div className="flex justify-between items-start">
							<span className="text-[11px] font-mono text-text-secondary">ID: {q.id}</span>
							<span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${statusTone[q.status]}`}>{q.status === 'review' ? '审核中' : q.status === 'draft' ? '草稿' : '已发布'}</span>
						</div>
						<h3 className="text-sm font-semibold text-text-main line-clamp-2 leading-snug group-hover:text-primary">{q.title}</h3>
						<div className="flex items-center gap-2 mt-1 text-[11px] text-text-secondary flex-wrap">
							{q.knowledgePoints?.map((kp) => (
								<span key={kp} className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-border-light">
									{kp}
								</span>
							))}
							{q.type ? <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-border-light">{q.type}</span> : null}
							{typeof q.difficulty === 'number' ? <span className="flex text-amber-400">{'★'.repeat(q.difficulty)}</span> : null}
						</div>
					</article>
				))}
			</div>

			{!questions.length ? <div className="text-sm text-text-secondary">暂无题目，调整筛选或新建。</div> : null}
		</section>
	)
}

export default QuestionList
