/**
 * 来源 HTML: screen_id: 20847ab41b7142b3af7881f060f5c328
 * Generated from Stitch export
 */
import React from 'react'
import StudentRow from '../../../components/table/StudentRow'
import type { Student } from '@/types/models/student'

export interface ClassRosterProps {
	students: Student[]
	onAttendanceChange?: (studentId: string, status: 'present' | 'absent') => void
	onViewProfile?: (studentId: string) => void
}

const ClassRoster: React.FC<ClassRosterProps> = ({ students, onAttendanceChange, onViewProfile }) => {
	return (
		<div className="flex-1 flex flex-col overflow-hidden">
			<div className="flex items-center justify-between px-6 py-4">
				<div className="flex items-center gap-2">
					<h3 className="font-bold text-text-main">班级花名册</h3>
					<span className="bg-gray-100 text-text-secondary text-xs px-2 py-0.5 rounded-full font-medium">{students.length}人</span>
				</div>
				<div className="flex items-center gap-2">
					<button className="text-primary text-sm font-medium hover:underline" aria-label="导出 CSV">
						导出CSV
					</button>
					<div className="h-4 w-px bg-border-light" aria-hidden />
					<button className="text-primary text-sm font-medium hover:underline" aria-label="批量签到">
						批量签到
					</button>
				</div>
			</div>
			<div className="px-6 pb-2">
				<div className="flex border-b border-border-light" role="tablist" aria-label="花名册过滤">
					<button className="px-4 py-2 text-sm font-bold text-primary border-b-2 border-primary" role="tab" aria-selected>
						全部
					</button>
					<button className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-main transition-colors" role="tab">
						未签到 (3)
					</button>
					<button className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-main transition-colors" role="tab">
						在线 (28)
					</button>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto px-6">
				<table className="w-full text-left border-collapse">
					<thead className="sticky top-0 bg-white z-10">
						<tr>
							<th className="py-3 text-xs font-medium text-text-secondary border-b border-border-light w-[40%]">学生姓名</th>
							<th className="py-3 text-xs font-medium text-text-secondary border-b border-border-light w-[30%]">在线状态</th>
							<th className="py-3 text-xs font-medium text-text-secondary border-b border-border-light w-[30%] text-right">签到</th>
						</tr>
					</thead>
					<tbody className="text-sm">
						{students.map((student) => (
							<StudentRow
								key={student.id}
								student={student}
								onAttendanceChange={onAttendanceChange}
								onViewProfile={onViewProfile}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default ClassRoster
