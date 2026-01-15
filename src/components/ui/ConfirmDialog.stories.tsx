import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import ConfirmDialog from './ConfirmDialog'

const meta = {
  title: 'UI/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  args: {
    onConfirm: fn(),
    onCancel: fn()
  }
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    open: true,
    title: '确认操作',
    message: '确定要执行此操作吗？此操作无法撤销。'
  }
}

export const Danger: Story = {
  args: {
    open: true,
    title: '删除确认',
    message: '确定要删除这个项目吗？删除后无法恢复。',
    variant: 'danger',
    confirmLabel: '删除',
    cancelLabel: '取消'
  }
}

export const Warning: Story = {
  args: {
    open: true,
    title: '提示',
    message: '您有未保存的更改，确定要离开吗？',
    variant: 'warning',
    confirmLabel: '离开',
    cancelLabel: '留下'
  }
}

export const Loading: Story = {
  args: {
    open: true,
    title: '处理中',
    message: '正在提交您的请求，请稍候...',
    isLoading: true
  }
}

export const CustomLabels: Story = {
  args: {
    open: true,
    title: '结束直播',
    message: '确定要结束本次直播吗？结束后将自动生成录播。',
    confirmLabel: '结束直播',
    cancelLabel: '继续直播'
  }
}
