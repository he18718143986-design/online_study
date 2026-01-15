import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import Toast, { ToastContainer } from './Toast'

const meta = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  args: {
    onClose: fn()
  }
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {
  args: {
    id: 'toast-1',
    type: 'success',
    message: '操作成功！数据已保存。',
    duration: 0 // Don't auto-close in Storybook
  }
}

export const Error: Story = {
  args: {
    id: 'toast-2',
    type: 'error',
    message: '操作失败，请稍后重试。',
    duration: 0
  }
}

export const Warning: Story = {
  args: {
    id: 'toast-3',
    type: 'warning',
    message: '注意：此操作可能需要较长时间。',
    duration: 0
  }
}

export const Info: Story = {
  args: {
    id: 'toast-4',
    type: 'info',
    message: '提示：您可以按 Ctrl+S 快速保存。',
    duration: 0
  }
}

export const Container: StoryObj<typeof ToastContainer> = {
  render: () => (
    <ToastContainer
      toasts={[
        { id: '1', type: 'success', message: '文件上传成功' },
        { id: '2', type: 'info', message: '正在处理中...' },
        { id: '3', type: 'warning', message: '网络连接不稳定' }
      ]}
      onClose={fn()}
    />
  )
}
