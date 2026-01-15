/**
 * 来源 HTML: screen_id: 20847ab41b7142b3af7881f060f5c328
 * Generated from Stitch export
 */
import React from 'react'
import { type Student } from '@/types/models/student'

export interface StudentRowProps {
	student: Student
	onAttendanceChange?: (studentId: string, status: Student['attendance']) => void
	onViewProfile?: (studentId: string) => void
}

// TODO: consolidate badge/ping styles if additional presence states are added
const onlineIndicator = {
	online: 'bg-green-500',
	offline: 'bg-gray-300'
}

const attendanceBadge = {
	present: 'text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded',
	absent: 'text-xs text-text-secondary bg-white border border-border-light hover:border-primary hover:text-primary px-3 py-1 rounded shadow-sm transition-colors'
}

const StudentRow: React.FC<StudentRowProps> = ({ student, onAttendanceChange, onViewProfile }) => {
	return (
		<tr className="group hover:bg-slate-50 transition-colors">
			<td className="py-3 border-b border-border-light/50">
				<button
					type="button"
					className="flex items-center gap-3 w-full text-left"
					onClick={() => onViewProfile?.(student.id)}
					aria-label={`查看 ${student.name} 的档案`}
				>
					{student.avatar ? (
						<div className="size-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${student.avatar})` }} aria-hidden />
					) : (
						<div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs" aria-hidden>
							{student.name.slice(0, 1)}
						</div>
					)}
					<span className="font-medium text-text-main">{student.name}</span>
				</button>
			</td>
			<td className="py-3 border-b border-border-light/50">
				<div className="flex items-center gap-1.5">
					<span className="relative inline-flex rounded-full h-2.5 w-2.5" aria-hidden>
						{student.onlineStatus === 'online' ? (
							<>
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
								<span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${onlineIndicator[student.onlineStatus]}`} />
							</>
						) : (
							<span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${onlineIndicator[student.onlineStatus]}`} />
						)}
					</span>
					<span className="text-xs text-text-secondary">{student.onlineStatus === 'online' ? '在线' : '离线'}</span>
				</div>
			</td>
			<td className="py-3 border-b border-border-light/50 text-right">
				{student.attendance === 'present' ? (
					<span className={attendanceBadge[student.attendance]}>已签到</span>
				) : (
					<button
						type="button"
						className={attendanceBadge[student.attendance]}
						onClick={() => onAttendanceChange?.(student.id, 'present')}
						aria-label={`为 ${student.name} 签到`}
					>
						签到
					</button>
				)}
			</td>
		</tr>
	)
}

export default StudentRow