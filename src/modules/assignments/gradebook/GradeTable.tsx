// 来源 HTML: online_study/成绩册
import React from 'react'
import type { Student } from '@/types/models/student'
import type { Assignment } from '@/types/models/assignment'

export interface GradeTableProps {
	students: Student[]
	assignments: Assignment[]
	grades: Record<string, Record<string, number | undefined>>
	onChange: (studentId: string, assignmentId: string, value: number | undefined) => void
	onSave: (studentId: string, assignmentId: string, value: number | undefined) => void
}

const GradeTable: React.FC<GradeTableProps> = ({ students, assignments, grades, onChange, onSave }) => {
	return (
		<div className="overflow-auto border border-border-light rounded-xl bg-white shadow-sm">
			<table className="min-w-full text-sm">
				<thead className="bg-background-light">
					<tr>
						<th className="px-4 py-2 text-left text-xs text-text-secondary font-semibold sticky left-0 bg-background-light">学生</th>
						{assignments.map((a) => (
							<th key={a.id} className="px-4 py-2 text-left text-xs text-text-secondary font-semibold border-l border-border-light">
								<div className="flex flex-col">
									<span className="font-bold text-text-main text-sm">{a.title}</span>
									<span className="text-[11px] text-text-secondary">满分 {a.totalPoints ?? 100}</span>
								</div>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{students.map((student) => (
						<tr key={student.id} className="hover:bg-slate-50">
							<td className="px-4 py-3 sticky left-0 bg-white border-t border-border-light font-medium text-text-main">{student.name}</td>
							{assignments.map((a) => {
								const val = grades[student.id]?.[a.id]
								return (
									<td key={a.id} className="px-4 py-3 border-t border-border-light align-middle">
										<div className="flex items-center gap-2">
											<input
												className="w-20 h-9 px-2 rounded border border-border-light focus:border-primary focus:ring-0"
												type="number"
												value={val ?? ''}
												onChange={(e: any) => {
													const next = e.target.value === '' ? undefined : Number(e.target.value)
													onChange(student.id, a.id, next)
												}}
												placeholder="--"
												min={0}
												max={a.totalPoints ?? 100}
												step={1}
												aria-label={`${student.name} ${a.title} 分数`}
											/>
											<button
												className="px-2 h-9 rounded border border-border-light text-xs text-text-secondary hover:text-primary hover:border-primary"
												onClick={() => onSave(student.id, a.id, val)}
												type="button"
											>
												保存
											</button>
										</div>
									</td>
								)
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default GradeTable
