/**
 * Notifications service
 * - Manages user notifications
 * - Supports read/unread status, filtering by type
 */

import api from './apiClient'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export type NotificationType = 'assignment' | 'course' | 'system' | 'message' | 'alert'

export interface Notification {
	id: string
	type: NotificationType
	title: string
	message: string
	read: boolean
	actionUrl?: string
	metadata?: Record<string, unknown>
	created_at: string
}

export interface NotificationFilters {
	type?: NotificationType
	read?: boolean
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const STORAGE_KEY = 'mock.notifications'

// Seed data
const seedNotifications: Notification[] = [
	{
		id: 'notif-001',
		type: 'assignment',
		title: '新作业提交',
		message: '张三提交了「第三章：平面几何综合练习」，等待批改',
		read: false,
		actionUrl: '/assignments/assign-101',
		created_at: '2026-01-13T20:12:00+08:00'
	},
	{
		id: 'notif-002',
		type: 'system',
		title: '系统维护通知',
		message: '系统将于本周日凌晨2点进行维护升级，预计持续2小时',
		read: true,
		created_at: '2026-01-10T10:00:00+08:00'
	},
	{
		id: 'notif-003',
		type: 'course',
		title: '课程即将开始',
		message: '「初三奥数集训营」将于30分钟后开始',
		read: false,
		actionUrl: '/courses/course-002',
		created_at: '2026-01-12T13:30:00+08:00'
	},
	{
		id: 'notif-004',
		type: 'assignment',
		title: '作业批改提醒',
		message: '「几何技巧专项练习」有12份作业待批改',
		read: false,
		actionUrl: '/assignments/assign-104',
		created_at: '2026-01-14T09:00:00+08:00'
	},
	{
		id: 'notif-005',
		type: 'message',
		title: '新消息',
		message: '李四在讨论区发送了一条消息',
		read: true,
		created_at: '2026-01-11T15:30:00+08:00'
	}
]

function loadStorage(): Notification[] {
	if (typeof window === 'undefined') return [...seedNotifications]
	try {
		const cached = window.localStorage.getItem(STORAGE_KEY)
		if (cached) {
			const parsed = JSON.parse(cached)
			if (Array.isArray(parsed)) return parsed
		}
	} catch {
		// ignore
	}
	return [...seedNotifications]
}

function persistStorage(notifications: Notification[]) {
	if (typeof window === 'undefined') return
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
	} catch {
		// ignore
	}
}

export const notificationsService = {
	async list(filters?: NotificationFilters): Promise<Notification[]> {
		if (USE_MOCK) {
			await delay(30)
			let result = loadStorage()

			if (filters?.type) {
				result = result.filter((n) => n.type === filters.type)
			}
			if (filters?.read !== undefined) {
				result = result.filter((n) => n.read === filters.read)
			}

			// Sort by date, newest first
			result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

			return result
		}

		const res = await api.get<Notification[]>('/notifications', { params: filters })
		return res.data
	},

	async getUnreadCount(): Promise<number> {
		if (USE_MOCK) {
			await delay(20)
			const notifications = loadStorage()
			return notifications.filter((n) => !n.read).length
		}

		const res = await api.get<{ count: number }>('/notifications/unread-count')
		return res.data.count
	},

	async markAsRead(id: string): Promise<boolean> {
		if (USE_MOCK) {
			await delay(20)
			const notifications = loadStorage()
			const idx = notifications.findIndex((n) => n.id === id)
			if (idx !== -1) {
				notifications[idx] = { ...notifications[idx], read: true }
				persistStorage(notifications)
			}
			return true
		}

		await api.patch(`/notifications/${id}/read`)
		return true
	},

	async markAllAsRead(): Promise<boolean> {
		if (USE_MOCK) {
			await delay(50)
			const notifications = loadStorage()
			const updated = notifications.map((n) => ({ ...n, read: true }))
			persistStorage(updated)
			return true
		}

		await api.post('/notifications/mark-all-read')
		return true
	},

	async remove(id: string): Promise<boolean> {
		if (USE_MOCK) {
			await delay(20)
			const notifications = loadStorage()
			const idx = notifications.findIndex((n) => n.id === id)
			if (idx !== -1) {
				notifications.splice(idx, 1)
				persistStorage(notifications)
			}
			return true
		}

		await api.delete(`/notifications/${id}`)
		return true
	},

	async clearAll(): Promise<boolean> {
		if (USE_MOCK) {
			await delay(50)
			persistStorage([])
			return true
		}

		await api.delete('/notifications')
		return true
	}
}

export default notificationsService
