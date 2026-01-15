import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

describe('ConfirmDialog', () => {
  const defaultProps = {
    open: true,
    title: '确认操作',
    message: '确定要执行此操作吗？',
    onConfirm: vi.fn(),
    onCancel: vi.fn()
  }

  it('should not render when open is false', () => {
    render(<ConfirmDialog {...defaultProps} open={false} />)
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should render when open is true', () => {
    render(<ConfirmDialog {...defaultProps} />)
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('确认操作')).toBeInTheDocument()
    expect(screen.getByText('确定要执行此操作吗？')).toBeInTheDocument()
  })

  it('should call onCancel when cancel button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />)
    
    fireEvent.click(screen.getByText('取消'))
    
    expect(defaultProps.onCancel).toHaveBeenCalled()
  })

  it('should call onConfirm when confirm button is clicked', async () => {
    render(<ConfirmDialog {...defaultProps} />)
    
    fireEvent.click(screen.getByText('确认'))
    
    expect(defaultProps.onConfirm).toHaveBeenCalled()
  })

  it('should show custom button labels', () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        confirmLabel="删除"
        cancelLabel="返回"
      />
    )
    
    expect(screen.getByText('删除')).toBeInTheDocument()
    expect(screen.getByText('返回')).toBeInTheDocument()
  })

  it('should show loading state', () => {
    render(<ConfirmDialog {...defaultProps} isLoading={true} />)
    
    expect(screen.getByText('处理中...')).toBeInTheDocument()
  })

  it('should disable buttons when loading', () => {
    render(<ConfirmDialog {...defaultProps} isLoading={true} />)
    
    const cancelButton = screen.getByText('取消').closest('button')
    const confirmButton = screen.getByText('处理中...').closest('button')
    
    expect(cancelButton).toBeDisabled()
    expect(confirmButton).toBeDisabled()
  })

  it('should apply danger variant styles', () => {
    render(<ConfirmDialog {...defaultProps} variant="danger" />)
    
    // Check that the icon is "warning" for danger variant
    const icon = screen.getByText('warning')
    expect(icon).toBeInTheDocument()
  })
})
