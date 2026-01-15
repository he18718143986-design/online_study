import React from 'react'
import type { ReviewItem } from '../hooks/useReviewQueue'

interface ReviewDetailProps {
	selected: ReviewItem
	onAssign: () => void
	onSendBack: () => void
	onReject: () => void
	onApprove: () => void
}

interface Comment {
	id: string
	author: string
	authorRole?: string
	content: string
	timestamp: string
	isSystem?: boolean
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({ selected, onAssign, onSendBack, onReject, onApprove }) => {
	const [activeTab, setActiveTab] = React.useState<'discussion' | 'audit' | 'properties'>('discussion')
	const [comments, setComments] = React.useState<Comment[]>([
		{
			id: 'c1',
			author: '王教授',
			content: '第一问中 @张老师 参数范围缺少 a=0 的讨论，麻烦补充。',
			timestamp: '昨天 15:00'
		},
		{
			id: 'c2',
			author: '张老师',
			authorRole: '提交人',
			content: `已补充 a=0 情况，并更新到 ${selected.version}。请再次审核。`,
			timestamp: '今天 09:10'
		},
		{
			id: 'c3',
			author: '系统',
			isSystem: true,
			content: `版本对比已生成，可在上方"对比视图"查看详细差异。`,
			timestamp: '刚刚'
		}
	])
	const [newComment, setNewComment] = React.useState('')

	const handleSendComment = () => {
		if (!newComment.trim()) return
		
		const comment: Comment = {
			id: `c-${Date.now()}`,
			author: '当前用户', // TODO: 从用户上下文获取
			content: newComment,
			timestamp: '刚刚'
		}
		setComments([...comments, comment])
		setNewComment('')
	}

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
							<div className="text-sm text-text-main-light dark:text-text-main-dark leading-relaxed space-y-2">
								<p>{selected.summary}</p>
								<div className="mt-4 p-3 bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark">
									<p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-2">版本内容预览</p>
									<p className="text-xs text-text-main-light dark:text-text-main-dark">此区域将显示旧版本的具体内容，包括题目描述、解析步骤、公式等。支持富文本和 LaTeX 公式渲染。</p>
								</div>
							</div>
						</div>
						<div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-primary/30 shadow-sm relative overflow-hidden">
							<div className="absolute top-0 right-0 size-16 bg-gradient-to-bl from-green-500/10 to-transparent pointer-events-none" aria-hidden />
							<p className="text-sm font-bold text-primary mb-3 uppercase tracking-wide">当前版本 {selected.version}</p>
							<div className="text-sm text-text-main-light dark:text-text-main-dark leading-relaxed space-y-2">
								<p className="font-medium">更新内容：</p>
								<div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
									<p className="text-xs text-text-main-light dark:text-text-main-dark">此区域将显示当前版本的内容，并高亮显示与旧版本的差异。支持公式、配图、代码块等多种内容格式。</p>
								</div>
								<div className="mt-3 flex items-center gap-2 text-xs text-primary">
									<span className="material-symbols-outlined text-[16px]">compare</span>
									<span>差异对比功能待接入</span>
								</div>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col gap-3">
							<p className="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide">配图对比</p>
							<div className="flex-1 min-h-[200px] rounded-lg bg-background-light dark:bg-background-dark border border-dashed border-border-light dark:border-border-dark flex flex-col items-center justify-center gap-2 p-4">
								<span className="material-symbols-outlined text-4xl text-text-secondary-light dark:text-text-secondary-dark">image</span>
								<p className="text-sm text-text-secondary-light dark:text-text-secondary-dark text-center">图片对比区域</p>
								<p className="text-xs text-text-secondary-light dark:text-text-secondary-dark text-center">将显示新旧版本的配图对比，支持并排查看和差异标注</p>
							</div>
						</div>
						<div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col gap-3">
							<p className="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide">题目解析</p>
							<div className="text-sm text-text-main-light dark:text-text-main-dark leading-relaxed space-y-3">
								<p>此区域将展示题目的详细解析或本次更新的变更说明。</p>
								<div className="p-3 bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark">
									<p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">功能说明：</p>
									<ul className="text-xs text-text-main-light dark:text-text-main-dark space-y-1 list-disc list-inside">
										<li>支持富文本编辑和 LaTeX 公式</li>
										<li>可展示解题步骤和思路</li>
										<li>支持代码块和图表嵌入</li>
									</ul>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm">
						<div className="flex border-b border-border-light dark:border-border-dark">
							<button 
								className={`flex-1 py-3 text-sm font-semibold transition-colors ${
									activeTab === 'discussion'
										? 'text-primary border-b-2 border-primary bg-primary/5'
										: 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-main-light dark:hover:text-text-main-dark'
								}`}
								onClick={() => setActiveTab('discussion')}
							>
								协作讨论
							</button>
							<button 
								className={`flex-1 py-3 text-sm font-semibold transition-colors ${
									activeTab === 'audit'
										? 'text-primary border-b-2 border-primary bg-primary/5'
										: 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-main-light dark:hover:text-text-main-dark'
								}`}
								onClick={() => setActiveTab('audit')}
							>
								审计日志
							</button>
							<button 
								className={`flex-1 py-3 text-sm font-semibold transition-colors ${
									activeTab === 'properties'
										? 'text-primary border-b-2 border-primary bg-primary/5'
										: 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-main-light dark:hover:text-text-main-dark'
								}`}
								onClick={() => setActiveTab('properties')}
							>
								属性
							</button>
						</div>
						{activeTab === 'discussion' && (
						<div className="p-4 flex flex-col gap-4 bg-background-light/60 dark:bg-background-dark">
							{comments.map((comment, index) => {
								const isVersionUpdate = index === 1 // 第二个评论是版本更新
								return (
									<React.Fragment key={comment.id}>
										{isVersionUpdate && (
											<div className="flex items-center gap-2 my-1 text-[10px] text-text-secondary-light">
												<div className="h-px bg-border-light flex-1" />
												<span>版本 {selected.version} 更新</span>
												<div className="h-px bg-border-light flex-1" />
											</div>
										)}
										<div className="flex gap-3">
											<div className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-text-main-light dark:text-text-main-dark" aria-hidden>
												{comment.author.charAt(0)}
											</div>
											<div className="flex flex-col gap-1 w-full">
												<div className="flex justify-between items-baseline">
													<span className="text-xs font-bold text-text-main-light dark:text-text-main-dark">
														{comment.author}
														{comment.authorRole && ` (${comment.authorRole})`}
													</span>
													<span className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark">{comment.timestamp}</span>
												</div>
												<div className={`p-3 rounded-lg border text-sm text-text-main-light dark:text-text-main-dark ${
													comment.isSystem 
														? 'bg-white dark:bg-surface-dark border-border-light dark:border-border-dark'
														: comment.authorRole === '提交人'
															? 'bg-primary/5 border-primary/20'
															: 'bg-white dark:bg-surface-dark border-border-light dark:border-border-dark'
												}`}>
													<p className="whitespace-pre-wrap">{comment.content}</p>
												</div>
											</div>
										</div>
									</React.Fragment>
								)
							})}
							<div className="pt-2 border-t border-border-light dark:border-border-dark flex gap-3 items-center">
								<input 
									className="flex-1 px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm focus:ring-1 focus:ring-primary text-text-main-light dark:text-text-main-dark" 
									placeholder="输入评论或 @提及他人..." 
									value={newComment}
									onChange={(e) => setNewComment(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault()
											handleSendComment()
										}
									}}
								/>
								<button 
									className="px-3 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed" 
									type="button"
									onClick={handleSendComment}
									disabled={!newComment.trim()}
								>
									发送
								</button>
							</div>
						</div>
						)}
						{activeTab === 'audit' && (
							<div className="p-4 bg-background-light/60 dark:bg-background-dark">
								<div className="space-y-3">
									{[
										{ action: '创建', user: selected.submitBy, time: selected.updatedAt, details: `创建了审核项 ${selected.code}` },
										{ action: '更新', user: selected.submitBy, time: selected.updatedAt, details: `更新到版本 ${selected.version}` },
										{ action: '指派', user: '系统', time: selected.updatedAt, details: selected.assignee ? `指派给 ${selected.assignee}` : '未指派' }
									].map((log, index) => (
										<div key={index} className="flex gap-3 p-3 bg-white dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark">
											<div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-text-main-light dark:text-text-main-dark flex-shrink-0">
												{log.user.charAt(0)}
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<span className="text-xs font-bold text-text-main-light dark:text-text-main-dark">{log.user}</span>
													<span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary">{log.action}</span>
													<span className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark ml-auto">{log.time}</span>
												</div>
												<p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{log.details}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
						{activeTab === 'properties' && (
							<div className="p-4 bg-background-light/60 dark:bg-background-dark">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-3">
										<div>
											<p className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1">基本信息</p>
											<div className="bg-white dark:bg-surface-dark p-3 rounded-lg border border-border-light dark:border-border-dark space-y-2">
												<div className="flex justify-between text-xs">
													<span className="text-text-secondary-light dark:text-text-secondary-dark">审核项ID</span>
													<span className="text-text-main-light dark:text-text-main-dark font-medium">{selected.code}</span>
												</div>
												<div className="flex justify-between text-xs">
													<span className="text-text-secondary-light dark:text-text-secondary-dark">状态</span>
													<span className="text-text-main-light dark:text-text-main-dark font-medium">
														{selected.status === 'pending' ? '待审' : selected.status === 'draft' ? '草稿' : selected.status === 'rejected' ? '被驳回' : '已通过'}
													</span>
												</div>
												<div className="flex justify-between text-xs">
													<span className="text-text-secondary-light dark:text-text-secondary-dark">当前版本</span>
													<span className="text-text-main-light dark:text-text-main-dark font-medium">{selected.version}</span>
												</div>
												<div className="flex justify-between text-xs">
													<span className="text-text-secondary-light dark:text-text-secondary-dark">上一版本</span>
													<span className="text-text-main-light dark:text-text-main-dark font-medium">{selected.previousVersion}</span>
												</div>
											</div>
										</div>
										<div>
											<p className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1">提交信息</p>
											<div className="bg-white dark:bg-surface-dark p-3 rounded-lg border border-border-light dark:border-border-dark space-y-2">
												<div className="flex justify-between text-xs">
													<span className="text-text-secondary-light dark:text-text-secondary-dark">提交人</span>
													<span className="text-text-main-light dark:text-text-main-dark font-medium">{selected.submitBy}</span>
												</div>
												{selected.submitterRole && (
													<div className="flex justify-between text-xs">
														<span className="text-text-secondary-light dark:text-text-secondary-dark">角色</span>
														<span className="text-text-main-light dark:text-text-main-dark font-medium">{selected.submitterRole}</span>
													</div>
												)}
												<div className="flex justify-between text-xs">
													<span className="text-text-secondary-light dark:text-text-secondary-dark">更新时间</span>
													<span className="text-text-main-light dark:text-text-main-dark font-medium">{selected.updatedAt}</span>
												</div>
											</div>
										</div>
									</div>
									<div className="space-y-3">
										<div>
											<p className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1">审核信息</p>
											<div className="bg-white dark:bg-surface-dark p-3 rounded-lg border border-border-light dark:border-border-dark space-y-2">
												<div className="flex justify-between text-xs">
													<span className="text-text-secondary-light dark:text-text-secondary-dark">审核人</span>
													<span className="text-text-main-light dark:text-text-main-dark font-medium">{selected.assignee || '未指派'}</span>
												</div>
											</div>
										</div>
										{selected.tags && selected.tags.length > 0 && (
											<div>
												<p className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1">标签</p>
												<div className="bg-white dark:bg-surface-dark p-3 rounded-lg border border-border-light dark:border-border-dark">
													<div className="flex flex-wrap gap-2">
														{selected.tags.map((tag) => (
															<span key={tag} className="px-2 py-1 rounded bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-xs font-medium text-text-main-light dark:text-text-main-dark">
																{tag}
															</span>
														))}
													</div>
												</div>
											</div>
										)}
										<div>
											<p className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1">变更摘要</p>
											<div className="bg-white dark:bg-surface-dark p-3 rounded-lg border border-border-light dark:border-border-dark">
												<p className="text-xs text-text-main-light dark:text-text-main-dark leading-relaxed">{selected.summary}</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default ReviewDetail
