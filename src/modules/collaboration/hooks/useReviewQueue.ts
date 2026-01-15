import { useEffect, useMemo, useState } from 'react'

export type ReviewStatus = 'pending' | 'draft' | 'rejected' | 'approved'
export type ReviewFilter = 'all' | ReviewStatus

export interface ReviewItem {
	id: string
	code: string
	title: string
	status: ReviewStatus
	submitBy: string
	submitterRole?: string
	tags?: string[]
	version: string
	previousVersion: string
	summary: string
	updatedAt: string
	assignee?: string
}

export interface ReviewStats {
	all: number
	pending: number
	draft: number
	rejected: number
	approved: number
}

const seedQueue: ReviewItem[] = [
	{
		id: 'rev-1',
		code: 'P2409-A03',
		title: '2024 高中数学联赛模拟卷(三) - 函数导数综合题',
		status: 'pending',
		submitBy: '张老师',
		submitterRole: '教研员',
		tags: ['待审', '联赛'],
		version: 'V1.3',
		previousVersion: 'V1.2',
		summary: '参数 a 的范围已补充，更新了解析与配图。',
		updatedAt: '10 分钟前',
		assignee: '王教授'
	},
	{
		id: 'rev-2',
		code: 'Q1023-B11',
		title: '解析几何：椭圆的标准方程与性质考点解析',
		status: 'pending',
		submitBy: '李教员',
		submitterRole: '教师',
		tags: ['讲义', '解析几何'],
		version: 'V2.0',
		previousVersion: 'V1.9',
		summary: '补充了焦点性质例题与答案。',
		updatedAt: '2 小时前'
	},
	{
		id: 'rev-3',
		code: 'Q1025-C09',
		title: '数列通项公式求法总结 (V2)',
		status: 'draft',
		submitBy: '赵老师',
		submitterRole: '教师',
		tags: ['数列', '讲义'],
		version: 'V2.0',
		previousVersion: 'V1.0',
		summary: '草稿状态，等待补充例题。',
		updatedAt: '2 天前'
	},
	{
		id: 'rev-4',
		code: 'G3011-D05',
		title: '立体几何证明题：三棱锥外接球体积计算',
		status: 'rejected',
		submitBy: '王教授',
		submitterRole: '审核员',
		tags: ['立几', '驳回重审'],
		version: 'V1.1',
		previousVersion: 'V1.0',
		summary: '逻辑链条缺少体积估算步骤，被驳回。',
		updatedAt: '昨天'
	},
	{
		id: 'rev-5',
		code: 'P2101-Z99',
		title: '概率论基础题库增补',
		status: 'approved',
		submitBy: '教研组',
		submitterRole: '团队',
		tags: ['通过', '概率'],
		version: 'V1.0',
		previousVersion: '—',
		summary: '新增 30 道基础题，已通过。',
		updatedAt: '本周一'
	}
]

const useReviewQueue = () => {
	const [items, setItems] = useState<ReviewItem[]>(seedQueue)
	const [selectedId, setSelectedId] = useState<string | null>(seedQueue[0]?.id ?? null)
	const [filter, setFilter] = useState<ReviewFilter>('all')
	const [search, setSearch] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const stats = useMemo<ReviewStats>(
		() => ({
			all: items.length,
			pending: items.filter((i) => i.status === 'pending').length,
			draft: items.filter((i) => i.status === 'draft').length,
			rejected: items.filter((i) => i.status === 'rejected').length,
			approved: items.filter((i) => i.status === 'approved').length
		}),
		[items]
	)

	const filteredItems = useMemo(() => {
		return items.filter((item) => {
			const matchesStatus = filter === 'all' ? true : item.status === filter
			if (!matchesStatus) return false

			if (!search) return true
			const q = search.toLowerCase()
			return (
				item.title.toLowerCase().includes(q) ||
				item.code.toLowerCase().includes(q) ||
				item.submitBy.toLowerCase().includes(q) ||
				item.tags?.some((tag) => tag.toLowerCase().includes(q))
			)
		})
	}, [items, filter, search])

	useEffect(() => {
		if (!selectedId && filteredItems.length) {
			setSelectedId(filteredItems[0].id)
			return
		}
		if (selectedId && filteredItems.every((item) => item.id !== selectedId) && filteredItems.length) {
			setSelectedId(filteredItems[0].id)
		}
	}, [filteredItems, selectedId])

	const select = (id: string) => setSelectedId(id)

	const assignReviewer = async (id: string, name: string) => {
		setItems((prev) => prev.map((item) => (item.id === id ? { ...item, assignee: name } : item)))
	}

	const markApproved = async (id: string) => {
		setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item)))
	}

	const markRejected = async (id: string) => {
		setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item)))
	}

	const markPending = async (id: string) => {
		setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'pending' } : item)))
	}

	const refetch = async () => {
		setIsLoading(true)
		await new Promise((resolve) => setTimeout(resolve, 300))
		setItems(seedQueue)
		setIsLoading(false)
	}

	return {
		items,
		filteredItems,
		selectedId,
		filter,
		search,
		stats,
		isLoading,
		actions: { select, setFilter, setSearch, assignReviewer, markApproved, markRejected, markPending, refetch }
	}
}

export default useReviewQueue
