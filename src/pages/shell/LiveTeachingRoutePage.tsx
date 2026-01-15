import React from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getCourseDetailUrl } from '@/app/routes'
import LiveTeachingPage from '@/pages/live/LiveTeachingPage'

/**
 * 直播教学路由页面
 * 
 * 支持两种访问方式：
 * 1. /live/:courseId - 通过 URL 路径参数指定课程（推荐，支持 deep-link）
 * 2. /live?courseId=xxx - 通过查询参数指定课程（兼容旧逻辑）
 * 3. /live - 无参数时使用默认课程 ID
 */
const LiveTeachingRoutePage: React.FC = () => {
	const navigate = useNavigate()
	const params = useParams()
	const [searchParams] = useSearchParams()

	// 获取 courseId 的优先级：
	// 1. URL 路径参数 /live/:courseId
	// 2. 查询参数 ?courseId=xxx
	// 3. 默认值 'course-live-1'
	const courseId = React.useMemo(() => {
		// 优先从 URL 路径参数获取
		if (params.courseId) {
			return params.courseId
		}
		// 其次从查询参数获取
		const queryId = searchParams.get('courseId')?.trim()
		if (queryId) {
			return queryId
		}
		// 最后使用默认值
		return 'course-live-1'
	}, [params.courseId, searchParams])

	const handleBackToCourse = React.useCallback((cid: string) => {
		navigate(getCourseDetailUrl(cid))
	}, [navigate])

	return (
		<LiveTeachingPage
			courseId={courseId}
			onBackToCourse={handleBackToCourse}
		/>
	)
}

export default LiveTeachingRoutePage
