import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import CourseCard from './CourseCard'

const meta = {
  title: 'Cards/CourseCard',
  component: CourseCard,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  args: {
    onEnter: fn(),
    onMore: fn()
  }
} satisfies Meta<typeof CourseCard>

export default meta
type Story = StoryObj<typeof meta>

export const Upcoming: Story = {
  args: {
    id: 'course-1',
    title: '数学竞赛训练 — 高一提升',
    description: '针对高一学生的数学竞赛基础训练',
    classLabel: '高一A班',
    timeRange: '19:00 - 20:30',
    studentsCount: 32,
    status: 'upcoming'
  }
}

export const Live: Story = {
  args: {
    id: 'course-2',
    title: '初三奥数集训营',
    description: '初三年级数学奥林匹克集中训练',
    classLabel: '初三集训',
    timeRange: '14:00 - 16:00',
    studentsCount: 40,
    status: 'live'
  }
}

export const Completed: Story = {
  args: {
    id: 'course-3',
    title: '高二竞赛冲刺班',
    description: '高二年级数学竞赛强化训练',
    classLabel: '高二竞赛',
    timeRange: '09:00 - 12:00',
    studentsCount: 25,
    status: 'completed'
  }
}

export const NoDescription: Story = {
  args: {
    id: 'course-4',
    title: '几何专题训练',
    classLabel: '几何班',
    timeRange: '10:00 - 11:30',
    studentsCount: 18,
    status: 'upcoming'
  }
}
