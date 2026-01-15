import React from 'react'
import StudentRow from '../../../components/table/StudentRow'
import type { Student } from '@/types/models/student'
import type { StudentFilters, StudentRecord } from '../hooks/useStudents'

export interface StudentTableProps {
	data: StudentRecord[]
	isLoading: boolean
	filters: StudentFilters
	pagination: { page: number; pageSize: number; total: number }
	selectedIds: Set<string>
	onFilterChange: (next: Partial<StudentFilters>) => void
	onResetFilters: () => void
	onToggleSelect: (id: string) => void
	onToggleSelectAll: (ids: string[], checked: boolean) => void
	onPageChange: (page: number) => void
	onRefresh?: () => void
	onBulkMessage: (ids: string[]) => void | Promise<void>
	onBulkExport: (ids: string[]) => void | Promise<void>
	onBulkGroup: (ids: string[]) => void | Promise<void>
	onBulkMarkPresent: (ids: string[]) => void | Promise<void>
	onViewStudent?: (id: string) => void
	onEditStudent?: (student: StudentRecord) => void
	onDeleteStudent?: (student: StudentRecord) => void
}

const scoreLabel = (trend: StudentRecord['trend']) => {
	if (trend === 'up') return { icon: 'trending_up', className: 'text-green-500' }
	if (trend === 'down') return { icon: 'priority_high', className: 'text-red-500' }
	return { icon: 'remove', className: 'text-gray-400' }
}

const renderAttendance = (student: StudentRecord) => {
	const value = Math.round((student.attendanceRate ?? 0) * 100)
	const color = value >= 90 ? 'bg-primary' : value >= 80 ? 'bg-yellow-500' : 'bg-red-500'
	const label = student.attendance === 'absent' ? `${value}% (缺勤)` : `${value}%`
	return (
		<div>
			<div className="w-24 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
				<div className={`${color} h-1.5 rounded-full`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
			</div>
			<span className="text-xs text-text-secondary mt-1 block">{label}</span>
		</div>
	)
}

const presenceDot = (onlineStatus: Student['onlineStatus']) => {
	return onlineStatus === 'online' ? 'bg-green-500' : 'bg-gray-300'
}

const StudentTable: React.FC<StudentTableProps> = ({
	data,
	isLoading,
	filters,
	pagination,
	selectedIds,
	onFilterChange,
	onResetFilters,
	onToggleSelect,
	onToggleSelectAll,
	onPageChange,
	onRefresh,
	onBulkMessage,
	onBulkExport,
	onBulkGroup,
	onBulkMarkPresent,
	onViewStudent,
	onEditStudent,
	onDeleteStudent
}) => {
	const currentIds = React.useMemo(() => data.map((s) => s.id), [data])
	const allSelected = currentIds.length > 0 && currentIds.every((id) => selectedIds.has(id))
	const selectedCount = selectedIds.size
	const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize))
	const start = (pagination.page - 1) * pagination.pageSize + 1
	const end = Math.min(pagination.total, pagination.page * pagination.pageSize)

	const handleBulk = (action: (ids: string[]) => void | Promise<void>) => {
		void action(Array.from(selectedIds))
	}

	const [openMenuId, setOpenMenuId] = React.useState<string | null>(null)
	const openMenuRef = React.useRef<HTMLDivElement | null>(null)

	React.useEffect(() => {
		const handleDocClick = (event: MouseEvent) => {
			if (!openMenuId) return
			const target = event.target as Node | null
			if (openMenuRef.current && target && openMenuRef.current.contains(target)) return
			setOpenMenuId(null)
		}
		document.addEventListener('mousedown', handleDocClick)
		return () => document.removeEventListener('mousedown', handleDocClick)
	}, [openMenuId])

	return (
		<div className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col min-h-[500px]">
			<div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark">
				<div className="flex items-center gap-2">
					<h3 className="text-base font-bold text-text-main-light dark:text-text-main-dark">学生列表</h3>
					<span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">共 {pagination.total} 人</span>
				</div>
				<div className="flex items-center gap-3">
					<button
						type="button"
						className="p-1.5 text-text-secondary-light hover:text-primary rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors"
						title="刷新"
						onClick={() => onRefresh?.()}
					>
						<span className="material-symbols-outlined text-[20px]">refresh</span>
					</button>
				</div>
			</div>

			<div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex flex-wrap items-end gap-3">
				<div className="flex flex-col gap-1.5 w-48">
					<label className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">年级</label>
					<select
						className="w-full rounded-lg border-0 bg-background-light dark:bg-background-dark py-2 px-3 ring-1 ring-inset ring-border-light dark:ring-border-dark focus:ring-2 focus:ring-primary sm:text-sm text-text-main-light dark:text-text-main-dark"
						value={filters.grade}
						onChange={(e) => onFilterChange({ grade: e.target.value })}
					>
						<option value="all">全部年级</option>
						<option value="高一">高一</option>
						<option value="高二">高二</option>
						<option value="高三">高三</option>
					</select>
				</div>
				<div className="flex flex-col gap-1.5 w-48">
					<label className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">班级</label>
					<select
						className="w-full rounded-lg border-0 bg-background-light dark:bg-background-dark py-2 px-3 ring-1 ring-inset ring-border-light dark:ring-border-dark focus:ring-2 focus:ring-primary sm:text-sm text-text-main-light dark:text-text-main-dark"
						value={filters.className}
						onChange={(e) => onFilterChange({ className: e.target.value })}
					>
						<option value="all">全部班级</option>
						<option value="高一 (1) 班">1班 (尖子班)</option>
						<option value="高一 (2) 班">2班</option>
						<option value="高一 (3) 班">3班</option>
						<option value="高二 (1) 班">高二 (1)</option>
						<option value="高二 (2) 班">高二 (2)</option>
					</select>
				</div>
				<div className="flex flex-col gap-1.5 w-48">
					<label className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">出勤状态</label>
					<select
						className="w-full rounded-lg border-0 bg-background-light dark:bg-background-dark py-2 px-3 ring-1 ring-inset ring-border-light dark:ring-border-dark focus:ring-2 focus:ring-primary sm:text-sm text-text-main-light dark:text-text-main-dark"
						value={filters.attendance}
						onChange={(e) => onFilterChange({ attendance: e.target.value as StudentFilters['attendance'] })}
					>
						<option value="all">全部状态</option>
						<option value="present">全勤</option>
						<option value="absent">缺勤</option>
					</select>
				</div>
				<div className="flex flex-col gap-1.5 w-48">
					<label className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">最近得分</label>
					<select
						className="w-full rounded-lg border-0 bg-background-light dark:bg-background-dark py-2 px-3 ring-1 ring-inset ring-border-light dark:ring-border-dark focus:ring-2 focus:ring-primary sm:text-sm text-text-main-light dark:text-text-main-dark"
						value={filters.score}
						onChange={(e) => onFilterChange({ score: e.target.value as StudentFilters['score'] })}
					>
						<option value="all">全部区间</option>
						<option value="90+">90分以上</option>
						<option value="60-89">60-89分</option>
						<option value="<60">60分以下</option>
					</select>
				</div>
				<div className="ml-auto flex items-center gap-2 pb-0.5">
					<button
						type="button"
						className="text-text-secondary-light hover:text-primary text-sm font-medium px-2 py-1.5 transition-colors"
						onClick={onResetFilters}
					>
						重置
					</button>
					<div className="relative w-60">
						<span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<span className="material-symbols-outlined text-text-secondary-light text-[20px]">search</span>
						</span>
						<input
							type="text"
							value={filters.query}
							onChange={(e) => onFilterChange({ query: e.target.value })}
							placeholder="搜索姓名 / 学号 / 关键词..."
							className="block w-full pl-10 pr-3 py-2 rounded-lg border-0 bg-background-light dark:bg-background-dark ring-1 ring-inset ring-border-light dark:ring-border-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 text-text-main-light dark:text-text-main-dark transition-shadow"
						/>
					</div>
				</div>
			</div>

			<div className="w-full overflow-x-auto hidden md:block">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="border-b border-border-light dark:border-border-dark">
							<th className="py-3 px-6 w-12">
								<input
									type="checkbox"
									className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
									checked={allSelected}
									onChange={(e) => onToggleSelectAll(currentIds, e.target.checked)}
								/>
							</th>
							<th className="py-3 px-6 text-xs font-semibold text-text-secondary-light uppercase tracking-wider">学生信息</th>
							<th className="py-3 px-6 text-xs font-semibold text-text-secondary-light uppercase tracking-wider">学号</th>
							<th className="py-3 px-6 text-xs font-semibold text-text-secondary-light uppercase tracking-wider">班级</th>
							<th className="py-3 px-6 text-xs font-semibold text-text-secondary-light uppercase tracking-wider">最近测验</th>
							<th className="py-3 px-6 text-xs font-semibold text-text-secondary-light uppercase tracking-wider">出勤率</th>
							<th className="py-3 px-6 text-xs font-semibold text-text-secondary-light uppercase tracking-wider">最后活跃</th>
							<th className="py-3 px-6 text-xs font-semibold text-text-secondary-light uppercase tracking-wider text-right">操作</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border-light dark:divide-border-dark text-sm">
						{isLoading ? (
							<tr>
								<td className="px-6 py-4 text-text-secondary-light" colSpan={8}>
									加载中...
								</td>
							</tr>
						) : data.length === 0 ? (
							<tr>
								<td className="px-6 py-4 text-text-secondary-light" colSpan={8}>
									暂无学生数据
								</td>
							</tr>
						) : (
							data.map((student) => {
								const score = student.latestScore ?? 0
								const presence = presenceDot(student.onlineStatus)
								const trend = scoreLabel(student.trend)
								return (
									<tr
										key={student.id}
										className={`hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors ${selectedIds.has(student.id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
									>
										<td className="py-4 px-6 align-top">
											<input
												type="checkbox"
												className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
												checked={selectedIds.has(student.id)}
												onChange={() => onToggleSelect(student.id)}
											/>
										</td>
										<td className="py-4 px-6 align-top">
											<div className="flex items-center gap-3">
												<div className="relative">
													<div
														className="w-9 h-9 rounded-full bg-cover bg-center"
														style={student.avatar ? { backgroundImage: `url(${student.avatar})` } : undefined}
														aria-hidden
													/>
													<span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${presence}`} aria-hidden />
												</div>
												<div>
													<p className="text-sm font-medium text-text-main-light dark:text-text-main-dark">{student.name}</p>
													<p className="text-xs text-text-secondary-light">{student.handle ?? `@${student.id}`}</p>
												</div>
											</div>
										</td>
										<td className="py-4 px-6 align-top">
											<span className="text-sm font-mono text-text-secondary-light">{student.studentNumber}</span>
										</td>
										<td className="py-4 px-6 align-top">
											<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
												{student.className}
											</span>
										</td>
										<td className="py-4 px-6 align-top">
											<div className="flex items-center gap-2">
												<span className={`text-sm font-bold ${trend.className === 'text-red-500' ? 'text-red-500' : 'text-text-main-light dark:text-text-main-dark'}`}>
													{score}
												</span>
												<span className="text-xs text-text-secondary-light">/ 100</span>
												<span className={`material-symbols-outlined text-[16px] ${trend.className}`}>{trend.icon}</span>
											</div>
										</td>
										<td className="py-4 px-6 align-top">{renderAttendance(student)}</td>
										<td className="py-4 px-6 align-top">
											<span className="text-sm text-text-secondary-light">{student.lastActive ?? '--'}</span>
										</td>
										<td className="py-4 px-6 text-right align-top">
											<div className="flex items-center justify-end gap-2">
												<button
													type="button"
													className="text-primary hover:text-primary-hover text-sm font-medium"
													onClick={() => onViewStudent?.(student.id)}
												>
													查看
												</button>
												<div className="relative" ref={openMenuId === student.id ? openMenuRef : undefined}>
													<button
														className="p-1 text-text-secondary-light hover:text-text-main-light rounded hover:bg-gray-200 dark:hover:bg-gray-700"
														type="button"
														aria-label="更多操作"
														onClick={() => setOpenMenuId((prev) => (prev === student.id ? null : student.id))}
													>
														<span className="material-symbols-outlined text-[20px]">more_vert</span>
													</button>
													{openMenuId === student.id ? (
														<div className="absolute right-0 mt-2 w-32 rounded-lg border border-border-light bg-white shadow-lg overflow-hidden z-20">
															<button
																type="button"
																className="w-full text-left px-3 py-2 text-sm hover:bg-background-light"
																onClick={() => {
																	setOpenMenuId(null)
																	onEditStudent?.(student)
																}}
																aria-label={`编辑 ${student.name}`}
															>
																编辑
															</button>
															<button
																type="button"
																className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
																onClick={() => {
																	setOpenMenuId(null)
																	onDeleteStudent?.(student)
																}}
																aria-label={`删除 ${student.name}`}
															>
																删除
															</button>
														</div>
													) : null}
												</div>
											</div>
										</td>
									</tr>
								)
							})
						)}
					</tbody>
				</table>
			</div>

			<div className="md:hidden px-4 py-3 space-y-3 border-b border-border-light dark:border-border-dark">
				{data.map((student) => (
					<div key={student.id} className="rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
						<div className="px-4 pt-3">
							<StudentRow student={student as Student} onViewProfile={onViewStudent} onAttendanceChange={() => {}} />
						</div>
						<div className="px-4 pb-3 text-xs text-text-secondary flex flex-wrap gap-3">
							<span>学号 {student.studentNumber}</span>
							<span>{student.className}</span>
							<span>最近得分 {student.latestScore ?? '--'}</span>
							<span>出勤率 {Math.round((student.attendanceRate ?? 0) * 100)}%</span>
						</div>
					</div>
				))}
			</div>

			<div className="mt-auto border-t border-border-light dark:border-border-dark px-6 py-4 flex items-center justify-between">
				<div className="text-sm text-text-secondary-light">显示 {pagination.total === 0 ? 0 : start} 到 {end} 条，共 {pagination.total} 条记录</div>
				<div className="flex items-center gap-1">
					<button
						type="button"
						className="p-1.5 rounded-lg text-text-secondary-light hover:bg-background-light dark:hover:bg-background-dark disabled:opacity-50"
						onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
						disabled={pagination.page <= 1}
					>
						<span className="material-symbols-outlined text-[20px]">chevron_left</span>
					</button>
					<div className="px-2 text-sm text-text-secondary-light">第 {pagination.page} / {totalPages} 页</div>
					<button
						type="button"
						className="p-1.5 rounded-lg text-text-secondary-light hover:bg-background-light dark:hover:bg-background-dark disabled:opacity-50"
						onClick={() => onPageChange(Math.min(totalPages, pagination.page + 1))}
						disabled={pagination.page >= totalPages}
					>
						<span className="material-symbols-outlined text-[20px]">chevron_right</span>
					</button>
				</div>
			</div>

			{selectedCount > 0 ? (
				<div className="sticky bottom-4 left-0 right-0 mx-auto w-fit bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xl rounded-full px-6 py-3 flex items-center gap-6">
					<div className="flex items-center gap-2 border-r border-border-light dark:border-border-dark pr-6">
						<span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{selectedCount}</span>
						<span className="text-sm font-medium text-text-main-light dark:text-text-main-dark">名学生已选择</span>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							className="flex items-center gap-1.5 text-text-secondary-light hover:text-primary transition-colors text-sm font-medium px-2 py-1"
							onClick={() => handleBulk(onBulkMessage)}
						>
							<span className="material-symbols-outlined text-[18px]">mail</span>
							发送消息
						</button>
						<button
							type="button"
							className="flex items-center gap-1.5 text-text-secondary-light hover:text-primary transition-colors text-sm font-medium px-2 py-1"
							onClick={() => handleBulk(onBulkGroup)}
						>
							<span className="material-symbols-outlined text-[18px]">folder_shared</span>
							批量分组
						</button>
						<button
							type="button"
							className="flex items-center gap-1.5 text-text-secondary-light hover:text-primary transition-colors text-sm font-medium px-2 py-1"
							onClick={() => handleBulk(onBulkMarkPresent)}
						>
							<span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
							标记出勤
						</button>
						<button
							type="button"
							className="flex items-center gap-1.5 text-text-secondary-light hover:text-primary transition-colors text-sm font-medium px-2 py-1"
							onClick={() => handleBulk(onBulkExport)}
						>
							<span className="material-symbols-outlined text-[18px]">download</span>
							导出CSV
						</button>
					</div>
				</div>
			) : null}
		</div>
	)
}

export default StudentTable
