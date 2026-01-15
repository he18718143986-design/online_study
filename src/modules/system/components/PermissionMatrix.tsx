import React, { Fragment } from 'react'
import { PermissionAction, PermissionMatrixState } from '../hooks/usePermissions'

interface PermissionMatrixProps {
	roleId: string
	groupedActions: Record<string, PermissionAction[]>
	permissions: PermissionMatrixState
	onToggle: (roleId: string, actionId: string) => void
}

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ roleId, groupedActions, permissions, onToggle }) => {
	const rolePermissions = permissions[roleId] ?? {}

	return (
		<div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-4 flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-base font-bold text-text-main-light dark:text-text-main-dark">权限矩阵</h3>
					<p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">选择角色后勾选需要的权限</p>
				</div>
				<span className="text-xs px-2 py-1 rounded bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-secondary-light">{roleId || '未选择'}</span>
			</div>

			<div className="border border-border-light dark:border-border-dark rounded-lg overflow-hidden">
				<table className="min-w-full text-left">
					<thead className="bg-background-light dark:bg-background-dark text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase">
						<tr>
							<th className="px-4 py-2">模块</th>
							<th className="px-4 py-2">权限</th>
							<th className="px-4 py-2 w-20 text-center">启用</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border-light dark:divide-border-dark">
						{Object.entries(groupedActions).map(([group, groupActions]) => (
							<Fragment key={group}>
								{groupActions.map((action, index) => (
									<tr key={action.id} className="hover:bg-background-light dark:hover:bg-background-dark">
										{index === 0 ? (
											<td className="px-4 py-3 align-top text-sm font-semibold text-text-main-light dark:text-text-main-dark" rowSpan={groupActions.length}>
												{group}
											</td>
										) : null}
										<td className="px-4 py-3 text-sm text-text-main-light dark:text-text-main-dark">{action.label}</td>
										<td className="px-4 py-3 text-center">
											<input
												type="checkbox"
												checked={!!rolePermissions[action.id]}
												onChange={() => onToggle(roleId, action.id)}
												className="rounded border-border-light text-primary focus:ring-primary"
											/>
										</td>
									</tr>
								))}
							</Fragment>
						))}
					</tbody>
				</table>
			</div>
			<div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">提示：矩阵为占位实现，勾选行为写入内存状态，保存时记录审计日志（stub）。</div>
		</div>
	)
}

export default PermissionMatrix
