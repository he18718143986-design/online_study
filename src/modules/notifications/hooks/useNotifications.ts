import { useEffect, useMemo, useState } from 'react'

export type NotificationType = 'question' | 'system' | 'appeal' | 'general'
export type NotificationPriority = 'low' | 'medium' | 'high'
export type NotificationFilter = 'all' | 'unread' | NotificationType

export interface NotificationItem {
	id: string
	type: NotificationType
	subject: string
	preview: string
	content: string
	sender: string
	role: string
	email?: string
	time: string
	priority: NotificationPriority
	isRead: boolean
	tags?: string[]
}

export interface NotificationStats {
	all: number
	unread: number
	question: number
	appeal: number
	system: number
	general: number
}

const initialNotifications: NotificationItem[] = [
	{
		id: 'msg-1',
		type: 'question',
		subject: '关于几何辅助线做法的疑问',
		preview: '老师，在《平面几何基础》第三章的习题中，辅助线的做法我不太理解…',
		content:
			'老师，我在复习《平面几何基础》第三章时，对于课后习题第4题的辅助线处理有疑问。标准答案是连接 AC 并延长交圆 O 于点 D，我尝试连接 BD 但推导卡住了。能否讲讲为什么优先选 AC，以及如果用 BD 应该如何继续？',
		sender: '张伟',
		role: '学生',
		email: 'zhangwei_student@edu.com',
		time: '今天 10:30',
		priority: 'medium',
		isRead: false,
		tags: ['学生提问', '几何']
	},
	{
		id: 'msg-2',
		type: 'system',
		subject: '⚠️ 批改任务即将超时提醒',
		preview: '您有 15 份《代数进阶》作业未批改，距离 48 小时承诺仅剩 3 小时…',
		content: '系统提醒：您有 15 份《代数进阶》作业未批改，距离 48 小时承诺仅剩 3 小时，请尽快处理。',
		sender: '教务系统',
		role: '系统通知',
		time: '09:15',
		priority: 'high',
		isRead: false,
		tags: ['系统']
	},
	{
		id: 'msg-3',
		type: 'appeal',
		subject: '期中考试第 12 题判分申诉',
		preview: '我对第 12 题的扣分有异议，认为解题逻辑正确，申请复核…',
		content: '学生申诉：期中考试第 12 题扣分存疑，认为解题逻辑正确，申请老师复核评分。',
		sender: '李明',
		role: '学生',
		email: 'liming_student@edu.com',
		time: '昨天',
		priority: 'high',
		isRead: true,
		tags: ['申诉', '考试']
	},
	{
		id: 'msg-4',
		type: 'question',
		subject: '关于课程进度的咨询',
		preview: '老师，请问下周的模拟考范围是否包含数列极限部分？',
		content: '老师，请问下周的模拟考范围是否包含数列极限部分？如果包含，是否有推荐的练习集？',
		sender: '王芳',
		role: '学生',
		time: '2 天前',
		priority: 'low',
		isRead: true,
		tags: ['课程咨询']
	},
	{
		id: 'msg-5',
		type: 'general',
		subject: '教研组例会纪要',
		preview: '今日教研例会重点：下周联赛押题卷、课堂互动改进、录播剪辑规范…',
		content: '今日教研例会主要结论：准备下周联赛押题卷，优化课堂互动题目投放，录播剪辑需统一封面模板。',
		sender: '教研组长',
		role: '教师团队',
		email: 'team_lead@edu.com',
		time: '本周一',
		priority: 'medium',
		isRead: true,
		tags: ['教研', '公告']
	}
]

const useNotifications = () => {
	const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)
	const [selectedId, setSelectedId] = useState<string | null>(initialNotifications[0]?.id ?? null)
	const [filter, setFilter] = useState<NotificationFilter>('all')
	const [search, setSearch] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const stats = useMemo<NotificationStats>(
		() => ({
			all: notifications.length,
			unread: notifications.filter((n) => !n.isRead).length,
			question: notifications.filter((n) => n.type === 'question').length,
			appeal: notifications.filter((n) => n.type === 'appeal').length,
			system: notifications.filter((n) => n.type === 'system').length,
			general: notifications.filter((n) => n.type === 'general').length
		}),
		[notifications]
	)

	const filteredNotifications = useMemo(() => {
		return notifications.filter((item) => {
			const matchesFilter =
				filter === 'all'
					? true
					: filter === 'unread'
							? !item.isRead
							: item.type === filter

			if (!matchesFilter) return false

			if (!search) return true
			const q = search.toLowerCase()
			return (
				item.subject.toLowerCase().includes(q) ||
				item.preview.toLowerCase().includes(q) ||
				item.sender.toLowerCase().includes(q) ||
				item.tags?.some((tag) => tag.toLowerCase().includes(q))
			)
		})
	}, [notifications, filter, search])

	useEffect(() => {
		if (!selectedId && filteredNotifications.length) {
			setSelectedId(filteredNotifications[0].id)
			return
		}

		if (selectedId && filteredNotifications.every((item) => item.id !== selectedId) && filteredNotifications.length) {
			setSelectedId(filteredNotifications[0].id)
		}
	}, [filteredNotifications, selectedId])

	const select = (id: string) => setSelectedId(id)

	const markRead = async (id: string) => {
		setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)))
	}

	const markUnread = async (id: string) => {
		setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: false } : item)))
	}

	const toggleRead = async (id: string) => {
		setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: !item.isRead } : item)))
	}

	const markAllRead = async () => {
		setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })))
	}

	const refetch = async () => {
		setIsLoading(true)
		await new Promise((resolve) => setTimeout(resolve, 300))
		setNotifications(initialNotifications)
		setIsLoading(false)
	}

	return {
		notifications,
		filteredNotifications,
		selectedId,
		filter,
		search,
		stats,
		isLoading,
		unreadCount: stats.unread,
		actions: { select, setFilter, setSearch, markRead, markUnread, markAllRead, toggleRead, refetch }
	}
}

export default useNotifications
