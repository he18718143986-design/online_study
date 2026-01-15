/**
 * Dashboard service.
 * - Uses mock JSON when `VITE_USE_MOCK === 'true'`
 * - Falls back to mock on real API failures (demo-friendly)
 */

import api from './apiClient'
import type { DashboardData } from '../modules/dashboard/hooks/useDashboardData'
import mockDataJson from '@/data/mock/data.json'
import type { Course } from '@/types/models/course'
import type { Assignment } from '@/types/models/assignment'

type MockData = {
	courses?: Course[]
	assignments?: Assignment[]
	dashboard?: { metrics?: DashboardData['metrics']; today_course_ids?: string[] }
}

const dataset = (mockDataJson as unknown) as MockData

const fallbackMetrics: DashboardData['metrics'] = [
	{ key: 'participation', label: '参与率', value: 92, unit: '%' },
	{ key: 'accuracy', label: '正确率', value: 78, unit: '%' },
	{ key: 'hands', label: '举手数', value: 5, unit: '人' }
]

function buildMockDashboard(): DashboardData {
	const allCourses = dataset.courses ?? []
	const allAssignments = dataset.assignments ?? []
	const courseIds = dataset.dashboard?.today_course_ids
	const courses = courseIds?.length ? allCourses.filter((c) => courseIds.includes(c.id)) : allCourses.slice(0, 4)
	const assignments = allAssignments.slice(0, 6)
	const metrics = dataset.dashboard?.metrics ?? fallbackMetrics
	return { courses, assignments, metrics }
}

async function fetchDashboard(): Promise<DashboardData> {
	try {
		if (import.meta.env.VITE_USE_MOCK !== 'true') {
			const res = await api.get<DashboardData>('/dashboard')
			return res.data
		}
	} catch (err) {
		console.warn('fetchDashboard failed, falling back to mock data', err)
	}
	return buildMockDashboard()
}

export default { fetchDashboard }
