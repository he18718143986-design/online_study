import React from 'react'
import { useNavigate } from 'react-router-dom'
import StudentListHeader from '../../modules/students/components/StudentListHeader'
import StudentTable from '../../modules/students/components/StudentTable'
import useStudents from '../../modules/students/hooks/useStudents'
import { getStudentProfileUrl } from '../../app/routes'
import StudentEditor from '../../modules/students/components/StudentEditor'
import type { Student } from '@/types/models/student'

const StudentListPage: React.FC = () => {
	const navigate = useNavigate()
	const { data, isLoading, filters, pagination, selectedIds, actions } = useStudents()
	const [editorOpen, setEditorOpen] = React.useState(false)
	const [editingStudent, setEditingStudent] = React.useState<Student | null>(null)

	const handleExportTemplate = () => {
		void actions.bulkExport(Array.from(selectedIds))
	}

	const handleCreateStudent = () => {
		setEditingStudent(null)
		setEditorOpen(true)
	}

	const handleSaveStudent = async (payload: Partial<Student> & { name: string }) => {
		if (editingStudent) {
			await actions.updateStudent(editingStudent.id, payload)
		} else {
			await actions.createStudent(payload)
		}
	}

	const handleEditStudent = (student: Student) => {
		setEditingStudent(student)
		setEditorOpen(true)
	}

	const handleDeleteStudent = async (student: Student) => {
		const ok = window.confirm(`确认删除学生「${student.name}」吗？`)
		if (!ok) return
		await actions.removeStudent(student.id)
	}

	return (
		<div className="h-full bg-background-light dark:bg-background-dark">
			<StudentListHeader onExportTemplate={handleExportTemplate} onCreateStudent={handleCreateStudent} />
			<div className="flex-1 overflow-y-auto custom-scrollbar p-6">
				<div className="max-w-[1280px] mx-auto flex flex-col gap-6">
					<StudentTable
						data={data}
						isLoading={isLoading}
						filters={filters}
						pagination={pagination}
						selectedIds={selectedIds}
						onFilterChange={actions.setFilters}
						onResetFilters={actions.resetFilters}
						onToggleSelect={actions.toggleSelect}
						onToggleSelectAll={actions.toggleSelectAll}
						onPageChange={actions.changePage}
						onRefresh={actions.refetch}
						onBulkMessage={actions.bulkMessage}
						onBulkExport={actions.bulkExport}
						onBulkGroup={actions.bulkGroup}
						onBulkMarkPresent={actions.bulkMarkPresent}
						onEditStudent={handleEditStudent}
						onDeleteStudent={handleDeleteStudent}
						onViewStudent={(id) => navigate(getStudentProfileUrl(id))}
					/>
				</div>
			</div>
			<StudentEditor
				open={editorOpen}
				onClose={() => setEditorOpen(false)}
				onSave={handleSaveStudent}
				initialStudent={editingStudent}
			/>
		</div>
	)
}

export default StudentListPage
