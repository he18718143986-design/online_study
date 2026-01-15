import { useMemo, useState } from 'react'

export interface Role {
	id: string
	name: string
	description: string
	userCount?: number
}

export interface PermissionAction {
	id: string
	group: string
	label: string
}

export type PermissionMatrixState = Record<string, Record<string, boolean>>

const baseActions: PermissionAction[] = [
	{ id: 'courses.read', group: '课程与教学', label: '查看课程' },
	{ id: 'courses.edit', group: '课程与教学', label: '编辑课程' },
	{ id: 'assignments.manage', group: '作业与测评', label: '管理作业' },
	{ id: 'question-bank.edit', group: '内容资产', label: '编辑题库' },
	{ id: 'question-bank.review', group: '内容资产', label: '题库审核' },
	{ id: 'students.read', group: '学生与数据', label: '查看学生数据' },
	{ id: 'students.export', group: '学生与数据', label: '导出学生数据' },
	{ id: 'system.admin', group: '系统', label: '系统管理' }
]

const initialRoles: Role[] = [
	{ id: 'role-admin', name: '系统管理员', description: '全局权限，负责 SSO 与 S3 配置', userCount: 3 },
	{ id: 'role-teacher', name: '教师', description: '教学及作业管理权限', userCount: 18 },
	{ id: 'role-reviewer', name: '审核员', description: '题库与内容审核权限', userCount: 5 }
]

const initialPermissions: PermissionMatrixState = {
	'role-admin': {
		'courses.read': true,
		'courses.edit': true,
		'assignments.manage': true,
		'question-bank.edit': true,
		'question-bank.review': true,
		'students.read': true,
		'students.export': true,
		'system.admin': true
	},
	'role-teacher': {
		'courses.read': true,
		'courses.edit': true,
		'assignments.manage': true,
		'question-bank.edit': true,
		'question-bank.review': false,
		'students.read': true,
		'students.export': false,
		'system.admin': false
	},
	'role-reviewer': {
		'courses.read': true,
		'courses.edit': false,
		'assignments.manage': false,
		'question-bank.edit': true,
		'question-bank.review': true,
		'students.read': true,
		'students.export': false,
		'system.admin': false
	}
}

const usePermissions = () => {
	const [roles, setRoles] = useState<Role[]>(initialRoles)
	const [permissions, setPermissions] = useState<PermissionMatrixState>(initialPermissions)
	const [selectedRoleId, setSelectedRoleId] = useState<string>(initialRoles[0]?.id ?? '')
	const actions = baseActions

	const groupedActions = useMemo(() => {
		return actions.reduce<Record<string, PermissionAction[]>>((acc, curr) => {
			acc[curr.group] = acc[curr.group] ? [...acc[curr.group], curr] : [curr]
			return acc
		}, {})
	}, [actions])

	const togglePermission = (roleId: string, actionId: string) => {
		setPermissions((prev) => {
			const rolePerms = prev[roleId] ?? {}
			return {
				...prev,
				[roleId]: { ...rolePerms, [actionId]: !rolePerms[actionId] }
			}
		})
	}

	const addRole = (name: string) => {
		const id = `role-${Date.now()}`
		const newRole: Role = { id, name, description: '自定义角色', userCount: 0 }
		setRoles((prev) => [...prev, newRole])
		setPermissions((prev) => ({
			...prev,
			[id]: actions.reduce<Record<string, boolean>>((acc, action) => {
				acc[action.id] = false
				return acc
			}, {})
		}))
		setSelectedRoleId(id)
	}

	const saveChanges = async () => {
		console.log('audit log stub: permissions saved', { roles, permissions })
	}

	const testS3Integration = async () => {
		console.log('S3 integration test stub')
	}

	const testSSOIntegration = async () => {
		console.log('SSO integration test stub')
	}

	return {
		roles,
		actions,
		groupedActions,
		permissions,
		selectedRoleId,
		setSelectedRoleId,
		addRole,
		togglePermission,
		saveChanges,
		testS3Integration,
		testSSOIntegration
	}
}

export default usePermissions
