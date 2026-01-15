// 来源 HTML: screen_id: live_teaching_room
import React from 'react'

export interface LiveStudent {
	id: string
	name: string
	avatar?: string
	raisedHand?: boolean
	isOnline?: boolean
}

export interface LiveStudentPanelProps {
	students: LiveStudent[]
	onOpenChat?: () => void
}

const LiveStudentPanel: React.FC<LiveStudentPanelProps> = ({ students, onOpenChat }) => {
	return (
		<aside className="w-full md:w-72 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl flex flex-col">
			<header className="px-4 py-3 border-b border-border-light dark:border-border-dark flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-xs font-bold text-text-secondary uppercase">学生连麦</span>
					<span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{students.length}</span>
				</div>
				<button type="button" className="text-xs text-primary font-medium" aria-label="打开聊天" onClick={onOpenChat}>
					<span className="material-symbols-outlined text-sm align-middle">forum</span> 聊天
				</button>
			</header>
			<div className="flex-1 overflow-y-auto p-3 space-y-2" role="list">
				{students.map((student) => (
					<div
						key={student.id}
						role="listitem"
						className={`relative flex items-center gap-3 p-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-slate-800`}
					>
						<div
							className="h-10 w-10 rounded-lg bg-cover bg-center bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
							style={student.avatar ? { backgroundImage: `url(${student.avatar})` } : undefined}
							aria-hidden
						>
							{!student.avatar ? student.name.slice(0, 1) : null}
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-semibold text-text-main dark:text-white truncate">{student.name}</p>
							<p className="text-[11px] text-text-secondary flex items-center gap-1">
								<span className={`w-2 h-2 rounded-full ${student.isOnline === false ? 'bg-red-400' : 'bg-green-500'}`} aria-hidden />
								{student.isOnline === false ? '离线' : '在线'}
							</p>
						</div>
						{student.raisedHand ? (
							<span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 flex items-center gap-1">
								<span className="material-symbols-outlined text-xs" aria-hidden>pan_tool</span>
								举手
							</span>
						) : null}
					</div>
				))}
			</div>
		</aside>
	)
}

export default LiveStudentPanel
