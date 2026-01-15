// 来源 HTML: online_study/题库与试题管理
import React from 'react'
import QuestionList from '../../modules/question-bank/components/QuestionList'
import QuestionEditor from '../../modules/question-bank/components/QuestionEditor'
import useQuestions from '../../modules/question-bank/hooks/useQuestions'
import type { Question } from '@/types/models/question'

const QuestionBankPage: React.FC = () => {
	const { questions, isLoading, error, filters, setFilters, getQuestion, createQuestion, updateQuestion, refetch } = useQuestions()
	const [activeId, setActiveId] = React.useState<string | null>(null)
	const [notice, setNotice] = React.useState<string | null>(null)

	const activeQuestion = React.useMemo<Question | undefined>(() => (activeId ? getQuestion(activeId) : undefined), [activeId, getQuestion])

	const handleSave = async (payload: Partial<Question> & { title: string; content: string }) => {
		if (activeId) {
			await updateQuestion(activeId, payload)
			setNotice('已更新题目内容')
		} else {
			const created = await createQuestion(payload)
			setActiveId(created.id)
			setNotice('已创建题目草稿')
		}
	}

	const handleNew = () => {
		setActiveId(null)
	}

	return (
		<div className="grid grid-cols-12 h-full">
			<div className="col-span-12 md:col-span-3 border-r border-border-light bg-white p-4 overflow-y-auto">
				<div className="flex items-center justify-between mb-3">
					<h1 className="text-lg font-bold text-text-main">题库管理</h1>
					<div className="flex items-center gap-2">
						<button className="px-3 h-9 rounded-lg border border-border-light text-sm" onClick={() => void refetch()}>
							刷新
						</button>
						<button className="px-3 h-9 rounded-lg bg-primary text-white text-sm shadow" onClick={handleNew}>
							新建
						</button>
					</div>
				</div>
				{notice ? (
					<div className="mb-3 rounded-lg border border-border-light bg-amber-50 px-3 py-2 text-xs text-amber-800 flex items-start justify-between">
						<p>{notice}</p>
						<button className="text-amber-700 hover:text-amber-900" onClick={() => setNotice(null)} aria-label="关闭提示">
							<span className="material-symbols-outlined text-[18px]">close</span>
						</button>
					</div>
				) : null}
				{error ? <div className="text-sm text-red-600">{error.message}</div> : null}
				{isLoading ? <div className="text-sm text-text-secondary">加载中...</div> : null}
				<QuestionList questions={questions} onSelect={setActiveId} onFilterChange={setFilters} />
				<div className="text-[11px] text-text-secondary mt-2">筛选：{filters.knowledgePoint ?? '全部知识点'} / {filters.type ?? '全部题型'} / {filters.status ?? '全部状态'}</div>
			</div>
			<div className="col-span-12 md:col-span-9 bg-background-light p-4 overflow-y-auto">
				<QuestionEditor question={activeQuestion ?? null} onSave={handleSave} />
			</div>
		</div>
	)
}

export default QuestionBankPage
