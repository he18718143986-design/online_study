import React from 'react'
import type { ReviewItem } from '../hooks/useReviewQueue'

interface ReviewDetailProps {
	selected: ReviewItem
	onAssign: () => void
	onSendBack: () => void
	onReject: () => void
	onApprove: () => void
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({ selected, onAssign, onSendBack, onReject, onApprove }) => {
	return (
		<>
			<div className="bg-white dark:bg-surface-dark border-b border-border-light dark:border-border-dark px-6 py-3 flex items-center justify-between shrink-0">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2 flex-wrap">
						<h2 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">{selected.title}</h2>
						<span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-text-main-light dark:text-text-main-dark">{selected.code}</span>
						<span
							className={`px-2 py-0.5 rounded text-xs font-bold border ${
								selected.status === 'pending'
									? 'bg-amber-100 text-amber-700 border-amber-200'
								: selected.status === 'draft'
									? 'bg-slate-100 text-slate-700 border-slate-200'
								: selected.status === 'rejected'
									? 'bg-red-100 text-red-700 border-red-200'
								: 'bg-emerald-100 text-emerald-700 border-emerald-200'
							}`}
						>
							{selected.status === 'pending'
								? '待审'
								: selected.status === 'draft'
								? '草稿'
								: selected.status === 'rejected'
								? '被驳回'
								: '已通过'}
						</span>
						{selected.tags?.map((tag) => (
							<span key={tag} className="px-2 py-0.5 rounded bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-xs font-medium">
								{tag}
							</span>
						))}
					</div>
					<div className="flex items-center gap-4 text-xs text-text-secondary-light dark:text-text-secondary-dark flex-wrap">
						<span>
							提交人: {selected.submitBy}
							{selected.submitterRole ? ` · ${selected.submitterRole}` : ''}
						</span>
						<span>指派: {selected.assignee ?? '未指派'}</span>
						<span>更新时间: {selected.updatedAt}</span>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<button className="px-3 py-2 rounded-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm font-semibold text-text-main-light dark:text-text-main-dark hover:bg-slate-50 dark:hover:bg-slate-800" type="button" onClick={onAssign}>
						<span className="material-symbols-outlined text-[18px]">person_add</span>
						指派给我
					</button>
					<button className="px-3 py-2 rounded-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm font-semibold text-text-main-light dark:text-text-main-dark hover:bg-slate-50 dark:hover:bg-slate-800" type="button" onClick={onSendBack}>
						<span className="material-symbols-outlined text-[18px]">history</span>
						回到待审
					</button>
					<button className="px-3 py-2 rounded-lg bg-white dark:bg-surface-dark border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50" type="button" onClick={onReject}>
						<span className="material-symbols-outlined text-[18px]">close</span>
						驳回
					</button>
					<button className="px-3 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover shadow-sm" type="button" onClick={onApprove}>
						<span className="material-symbols-outlined text-[18px]">done_all</span>
						通过
					</button>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto p-6">
				<div className="max-w-6xl mx-auto flex flex-col gap-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
							<p className="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark mb-3 uppercase tracking-wide">旧版本 {selected.previousVersion}</p>
							<p className="text-sm text-text-main-light dark:text-text-main-dark leading-relaxed">{selected.summary} (旧版占位对比内容，可替换为真实 diff)</p>
						</div>
						<div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-primary/30 shadow-sm relative overflow-hidden">
							<div className="absolute top-0 right-0 size-16 bg-gradient-to-bl from-green-500/10 to-transparent pointer-events-none" aria-hidden />
							<p className="text-sm font-bold text-primary mb-3 uppercase tracking-wide">当前版本 {selected.version}</p>
							<p className="text-sm text-text-main-light dark:text-text-main-dark leading-relaxed">对比视图占位：在此展示新版内容或差异片段，包含公式、配图等。</p>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col gap-3">
							<p className="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide">配图对比</p>
							<div className="flex-1 rounded-lg bg-background-light dark:bg-background-dark border border-dashed border-border-light dark:border-border-dark flex items-center justify-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
								占位：图片对比区域，可替换为截图或资源预览。
							</div>
						</div>
						<div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col gap-3">
							<p className="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide">题目解析 (占位)</p>
							<p className="text-sm text-text-main-light dark:text-text-main-dark leading-relaxed">此处展示解析或变更说明，支持富文本/公式。当前为占位文本，用于体现布局。</p>
						</div>
					</div>

					<div className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm">
						<div className="flex border-b border-border-light dark:border-border-dark">
							<button className="flex-1 py-3 text-sm font-bold text-primary border-b-2 border-primary bg-primary/5">协作讨论 (占位)</button>
							<button className="flex-1 py-3 text-sm font-medium text-text-secondary-light hover:text-text-main-light">审计日志</button>
							<button className="flex-1 py-3 text-sm font-medium text-text-secondary-light hover:text-text-main-light">属性</button>
						</div>
						<div className="p-4 flex flex-col gap-4 bg-background-light/60 dark:bg-background-dark">
							<div className="flex gap-3">
								<div className="size-9 rounded-full bg-slate-200" aria-hidden />
								<div className="flex flex-col gap-1 w-full">
									<div className="flex justify-between items-baseline">
										<span className="text-xs font-bold text-text-main-light">王教授</span>
										<span className="text-[10px] text-text-secondary-light">昨天 15:00</span>
									</div>
									<div className="bg-white dark:bg-surface-dark p-3 rounded-lg border border-border-light dark:border-border-dark text-sm text-text-main-light dark:text-text-main-dark">
										<p>
											第一问中 <span className="text-primary font-medium">@张老师</span> 参数范围缺少 a=0 的讨论，麻烦补充。
										</p>
									</div>
								</div>
							</div>
							<div className="flex gap-3">
								<div className="size-9 rounded-full bg-slate-200" aria-hidden />
								<div className="flex flex-col gap-1 w-full">
									<div className="flex justify-between items-baseline">
										<span className="text-xs font-bold text-text-main-light">张老师 (提交人)</span>
										<span className="text-[10px] text-text-secondary-light">今天 09:10</span>
									</div>
									<div className="bg-primary/5 p-3 rounded-lg border border-primary/20 text-sm text-text-main-light">
										<p>已补充 a=0 情况，并更新到 {selected.version}。请再次审核。</p>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2 my-1 text-[10px] text-text-secondary-light">
								<div className="h-px bg-border-light flex-1" />
								<span>版本 {selected.version} 更新占位</span>
								<div className="h-px bg-border-light flex-1" />
							</div>
							<div className="flex gap-3">
								<div className="size-9 rounded-full bg-slate-200" aria-hidden />
								<div className="flex flex-col gap-1 w-full">
									<div className="flex justify-between items-baseline">
										<span className="text-xs font-bold text-text-main-light">系统</span>
										<span className="text-[10px] text-text-secondary-light">刚刚</span>
									</div>
									<div className="bg-white dark:bg-surface-dark p-3 rounded-lg border border-border-light dark:border-border-dark text-sm text-text-main-light dark:text-text-main-dark">
										<p>版本对比已生成，可在“对比视图”查看差异 (占位)。</p>
									</div>
								</div>
							</div>
							<div className="pt-2 border-t border-border-light dark:border-border-dark flex gap-3 items-center">
								<input className="flex-1 px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm focus:ring-1 focus:ring-primary" placeholder="输入评论或 @提及他人... (占位)" />
								<button className="px-3 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover" type="button">
									发送
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ReviewDetail
