import React from 'react'
import SubmissionViewer from './SubmissionViewer'
import { useGradingQueue } from '../hooks/useGradingQueue'

export interface GradingWorkspaceProps {
	assignmentId: string
}

const rubricKeys = ['去绝对值步骤正确', '计算无误', '答案书写规范', '过程完整']
const quickComments = ['计算错误', '逻辑严密', '书写规范', '步骤缺失']

const GradingWorkspace = ({ assignmentId }: GradingWorkspaceProps): React.ReactElement => {
	const { queue, activeSubmission, isLoading, selectSubmission, saveDraft, submitGrade } = useGradingQueue(assignmentId)
	const [score, setScore] = React.useState<number | ''>('')
	const [comment, setComment] = React.useState('')
	const [rubricState, setRubricState] = React.useState<Record<string, boolean>>({})

	React.useEffect(() => {
		setScore(activeSubmission?.score ?? '')
		setComment('')
		setRubricState(rubricKeys.reduce<Record<string, boolean>>((acc, key) => ({ ...acc, [key]: false }), {}))
	}, [activeSubmission])

	const updateRubric = (key: string) => {
		setRubricState((prev) => ({ ...prev, [key]: !prev[key] }))
	}

	const navigate = (direction: 'next' | 'prev') => {
		// Shortcut: N (next submission), P (previous submission), S (save draft)
		if (!activeSubmission) return
		const currentIndex = queue.findIndex((item) => item.id === activeSubmission.id)
		if (currentIndex === -1) return
		const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
		const target = queue[nextIndex]
		if (target) selectSubmission(target.id)
	}

	const handleSaveDraft = async () => {
		if (!activeSubmission) return
		await saveDraft(activeSubmission.id, {
			score: typeof score === 'number' ? score : Number(score) || undefined,
			comment,
			rubric: rubricState
		})
	}

	const handleSubmitGrade = async () => {
		if (!activeSubmission) return
		const numericScore = typeof score === 'number' ? score : Number(score)
		if (Number.isNaN(numericScore)) return
		await submitGrade(activeSubmission.id, numericScore, comment)
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-xs text-text-secondary">作业 ID: {assignmentId}</p>
					<h2 className="text-xl font-semibold text-text-main dark:text-white flex items-center gap-2">
						批改工作台
						{activeSubmission ? <span className="px-2 py-0.5 rounded text-[11px] bg-primary/10 text-primary">{activeSubmission.status}</span> : null}
					</h2>
				</div>
				<div className="flex items-center gap-2 text-sm text-text-secondary">
					<button type="button" className="h-10 px-3 rounded-lg border border-border-light" onClick={() => navigate('prev')}>
						上一位
					</button>
					<button type="button" className="h-10 px-3 rounded-lg border border-border-light" onClick={() => navigate('next')}>
						下一位
					</button>
				</div>
			</div>

			<div className="grid grid-cols-12 gap-4">
				<section className="col-span-12 lg:col-span-3 xl:col-span-2 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm flex flex-col">
					<div className="px-4 py-3 border-b border-border-light dark:border-border-dark flex items-center justify-between">
						<h3 className="text-sm font-semibold text-text-main dark:text-white">提交队列</h3>
						{isLoading ? <span className="text-xs text-text-secondary">加载中...</span> : null}
					</div>
					<div className="flex-1 overflow-y-auto divide-y divide-border-light dark:divide-border-dark">
						{queue.map((item) => (
							<button
								key={item.id}
								type="button"
								onClick={() => selectSubmission(item.id)}
								className={`w-full text-left px-4 py-3 flex flex-col gap-1 hover:bg-gray-50 dark:hover:bg-gray-800/60 ${item.id === activeSubmission?.id ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-text-main dark:text-white">
											{item.student.name.slice(0, 1)}
										</div>
										<div className="min-w-0">
											<p className="text-sm font-medium text-text-main dark:text-white truncate">{item.student.name}</p>
											<p className="text-[11px] text-text-secondary">{item.submittedAt}</p>
										</div>
									</div>
									<span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-text-secondary">{item.status}</span>
								</div>
								<div className="flex items-center gap-2 text-[11px] text-text-secondary">
									{item.aiConfidence ? <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600">AI {item.aiConfidence}</span> : null}
									{item.flags?.map((flag) => (
										<span key={flag} className="px-2 py-0.5 rounded bg-amber-50 text-amber-600">
											{flag}
										</span>
									))}
								</div>
							</button>
						))}
						{queue.length === 0 ? <div className="p-4 text-sm text-text-secondary">暂无待批提交</div> : null}
					</div>
				</section>

				<section className="col-span-12 lg:col-span-6 xl:col-span-7 min-h-[640px]">
					<SubmissionViewer attachments={activeSubmission?.attachments ?? []} />
				</section>

				<section className="col-span-12 lg:col-span-3 xl:col-span-3 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm flex flex-col">
					<div className="px-4 py-3 border-b border-border-light dark:border-border-dark flex items-center justify-between">
						<h3 className="text-sm font-semibold text-text-main dark:text-white">评分与评语</h3>
						{activeSubmission?.assignment.totalPoints ? <span className="text-xs text-text-secondary">满分 {activeSubmission.assignment.totalPoints}</span> : null}
					</div>
					<div className="p-4 space-y-4 flex-1 overflow-y-auto">
						<div className="flex items-start gap-3">
							<div className="w-24">
								<label className="block text-[11px] text-text-secondary mb-1">得分</label>
								<input
									value={score}
									onChange={(e) => setScore(e.target.value === '' ? '' : Number(e.target.value))}
									className="w-full h-12 text-center text-2xl font-bold rounded-lg border border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800"
									type="number"
									placeholder="-"
								/>
							</div>
							<div className="flex-1">
								<label className="block text-[11px] text-text-secondary mb-1">评语</label>
								<div className="relative">
									<input
										className="w-full h-12 rounded-lg border border-border-light dark:border-border-dark px-3 bg-white dark:bg-gray-800"
										value={comment}
										onChange={(e) => setComment(e.target.value)}
										placeholder="输入评语或选择快捷评语"
									/>
								</div>
								<div className="flex gap-2 mt-2 flex-wrap">
									{quickComments.map((text) => (
										<button
											key={text}
											type="button"
											onClick={() => setComment(text)}
											className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700"
										>
											{text}
										</button>
									))}
								</div>
							</div>
						</div>

						<div className="space-y-3">
							<h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">评分细则</h4>
							<div className="space-y-2">
								{rubricKeys.map((key) => (
									<label key={key} className="flex items-start gap-2 p-2 rounded-lg border border-border-light dark:border-border-dark hover:border-primary/40 cursor-pointer">
										<input type="checkbox" className="mt-1" checked={!!rubricState[key]} onChange={() => updateRubric(key)} />
										<span className="text-sm text-text-main dark:text-white">{key}</span>
									</label>
								))}
							</div>
						</div>
					</div>

					<div className="px-4 py-3 border-t border-border-light dark:border-border-dark flex items-center justify-between">
						<div className="text-xs text-text-secondary">S 保存草稿 / N 下一位 / P 上一位</div>
						<div className="flex items-center gap-2">
							<button type="button" className="h-10 px-3 rounded-lg border border-border-light" onClick={handleSaveDraft}>
								保存草稿 (S)
							</button>
							<button type="button" className="h-10 px-4 rounded-lg bg-primary text-white" onClick={handleSubmitGrade}>
								提交评分
							</button>
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}

export default GradingWorkspace
