/**
 * 来源 HTML: screen_id: db7e4a443f6545ee97956546f94f340d
 * Generated from Stitch export
 */
import React from 'react'

export interface CourseTabsProps {
	activeTab: 'overview' | 'students' | 'assignments' | 'recordings' | 'settings'
	onTabChange: (tab: CourseTabsProps['activeTab']) => void
}

const tabs: Array<{ key: CourseTabsProps['activeTab']; label: string }> = [
	{ key: 'overview', label: '课程概览' },
	{ key: 'students', label: '学生' },
	{ key: 'assignments', label: '作业' },
	{ key: 'recordings', label: '录播' },
	{ key: 'settings', label: '设置' }
]

const CourseTabs: React.FC<CourseTabsProps> = ({ activeTab, onTabChange }) => {
	return (
		<nav aria-label="课程详情标签" className="flex space-x-1">
			{tabs.map((tab) => {
				const isActive = activeTab === tab.key
				return (
					<button
						key={tab.key}
						type="button"
						onClick={() => onTabChange(tab.key)}
						className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
							isActive
								? 'text-primary border-primary'
								: 'text-text-secondary hover:text-text-main border-transparent hover:border-gray-300'
						}`}
						aria-current={isActive ? 'page' : undefined}
						aria-label={tab.label}
					>
						{tab.label}
					</button>
				)
			})}
		</nav>
	)
}

export default CourseTabs
