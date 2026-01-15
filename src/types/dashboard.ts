import type { Course } from '@/types/models/course'
import type { Assignment } from '@/types/models/assignment'

export interface DashboardCourse extends Course {
  todayLabel?: string
  pendingAssignmentCount?: number
}

export interface DashboardStats {
  participation_rate?: number
  live_hands?: number
}
