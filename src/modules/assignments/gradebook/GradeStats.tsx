// 来源 HTML: online_study/成绩册
import React from 'react'
import type { Student } from '@/types/models/student'
import type { Assignment } from '@/types/models/assignment'

export interface GradeStatsProps {
	students: Student[]
	assignments: Assignment[]
	grades: Record<string, Record<string, number | undefined>>
}

const calcAverage = (values: Array<number | undefined>) => {
	const nums = values.filter((v) => typeof v === 'number') as number[]
	if (!nums.length) return undefined
	return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10
}

const GradeStats: React.FC<GradeStatsProps> = ({ students, assignments, grades }) => {
	const overall = React.useMemo(() => {
		const all = students.flatMap((s) => assignments.map((a) => grades[s.id]?.[a.id]))
		return calcAverage(all)
	}, [assignments, grades, students])

	const perAssignment = React.useMemo(() => {
		return assignments.map((a) => ({ id: a.id, title: a.title, avg: calcAverage(students.map((s) => grades[s.id]?.[a.id])) }))
	}, [assignments, grades, students])

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div className="p-4 rounded-xl border border-border-light bg-white shadow-sm">
				<p className="text-xs text-text-secondary">总体平均分</p>
				<p className="text-2xl font-bold text-text-main mt-1">{overall ?? '--'}</p>
				<p className="text-[11px] text-text-tertiary mt-1">占位：分布图、最高/最低分</p>
			</div>
			<div className="md:col-span-2 p-4 rounded-xl border border-border-light bg-white shadow-sm">
				<p className="text-xs text-text-secondary mb-3">按作业平均分</p>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
					{perAssignment.map((item) => (
						<div key={item.id} className="rounded-lg border border-border-light px-3 py-2 bg-background-light/60">
							<p className="text-xs text-text-secondary line-clamp-1">{item.title}</p>
							<p className="font-semibold text-text-main mt-1">{item.avg ?? '--'}</p>
						</div>
					))}
				</div>
				<p className="text-[11px] text-text-tertiary mt-2">占位：成绩分布、区间统计、导出报表。</p>
			</div>
		</div>
	)
}

export default GradeStats
