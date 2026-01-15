import React from 'react'
import { Role } from '../hooks/usePermissions'

interface RoleManagementProps {
	roles: Role[]
	selectedRoleId: string
	onSelect: (roleId: string) => void
	onAddRole: (name: string) => void
}

const RoleManagement: React.FC<RoleManagementProps> = ({ roles, selectedRoleId, onSelect, onAddRole }) => {
	const [newRoleName, setNewRoleName] = React.useState('')

	const handleAdd = () => {
		const trimmed = newRoleName.trim()
		if (!trimmed) return
		onAddRole(trimmed)
		setNewRoleName('')
	}

	return (
		<div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-4 flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-base font-bold text-text-main-light dark:text-text-main-dark">角色管理</h3>
					<p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">选择角色查看权限，或新建自定义角色</p>
				</div>
				<button
					type="button"
					className="px-3 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover"
					onClick={handleAdd}
				>
					新增角色
				</button>
			</div>

			<div className="flex items-center gap-2">
				<input
					type="text"
					value={newRoleName}
					onChange={(e) => setNewRoleName(e.target.value)}
					placeholder="输入角色名称后点击新增"
					className="flex-1 px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm"
				/>
			</div>

			<div className="rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
				<table className="min-w-full text-left">
					<thead className="bg-background-light dark:bg-background-dark text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase">
						<tr>
							<th className="px-4 py-2">角色</th>
							<th className="px-4 py-2">描述</th>
							<th className="px-4 py-2">人数</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border-light dark:divide-border-dark">
						{roles.map((role) => (
							<tr
								key={role.id}
								className={`${selectedRoleId === role.id ? 'bg-primary/5 dark:bg-primary/15' : 'hover:bg-background-light dark:hover:bg-background-dark cursor-pointer'}`}
								onClick={() => onSelect(role.id)}
							>
								<td className="px-4 py-3 text-sm font-semibold text-text-main-light dark:text-text-main-dark">{role.name}</td>
								<td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">{role.description}</td>
								<td className="px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">{role.userCount ?? '-'}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default RoleManagement
