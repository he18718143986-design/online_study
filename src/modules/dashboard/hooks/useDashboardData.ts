// 来源 HTML: screen_id: e2ff3e9e9b5148b28a6741d0c8901e64 — React Query 版 dashboard 数据
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Course } from '@/types/models/course'
import type { Assignment } from '@/types/models/assignment'
import dashboardService from '@/services/dashboard.service'

export interface DashboardMetric {
	key: string
	label: string
	value: number
	unit?: string
	color?: 'blue' | 'orange' | 'purple'
	progress?: number
}

export interface DashboardData {
	courses: Course[]
	assignments: Assignment[]
	metrics: DashboardMetric[]
}

export interface DashboardActions {
	refresh: () => Promise<DashboardData | undefined>
	invalidate: () => Promise<void>
}

export default function useDashboardData() {
	const queryClient = useQueryClient()

	const { data, isLoading, refetch } = useQuery<DashboardData>({
		queryKey: ['dashboard'],
		queryFn: dashboardService.fetchDashboard,
		staleTime: 60_000
	})

	const actions: DashboardActions = {
		refresh: () => refetch().then((res) => res.data),
		invalidate: async () => {
			await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
		}
	}

	return {
		data: data ?? { courses: [], assignments: [], metrics: [] },
		isLoading,
		actions
	}
}

