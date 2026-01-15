import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Toast, { ToastContainer } from '@/components/ui/Toast'

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('should render with message', () => {
    const onClose = vi.fn()
    render(<Toast id="toast-1" type="success" message="操作成功" onClose={onClose} duration={0} />)
    
    expect(screen.getByText('操作成功')).toBeInTheDocument()
  })

  it('should show success icon for success type', () => {
    const onClose = vi.fn()
    render(<Toast id="toast-1" type="success" message="Test" onClose={onClose} duration={0} />)
    
    expect(screen.getByText('check_circle')).toBeInTheDocument()
  })

  it('should show error icon for error type', () => {
    const onClose = vi.fn()
    render(<Toast id="toast-1" type="error" message="Test" onClose={onClose} duration={0} />)
    
    expect(screen.getByText('error')).toBeInTheDocument()
  })

  it('should show warning icon for warning type', () => {
    const onClose = vi.fn()
    render(<Toast id="toast-1" type="warning" message="Test" onClose={onClose} duration={0} />)
    
    expect(screen.getByText('warning')).toBeInTheDocument()
  })

  it('should show info icon for info type', () => {
    const onClose = vi.fn()
    render(<Toast id="toast-1" type="info" message="Test" onClose={onClose} duration={0} />)
    
    expect(screen.getByText('info')).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<Toast id="toast-1" type="success" message="Test" onClose={onClose} duration={0} />)
    
    fireEvent.click(screen.getByLabelText('关闭通知'))
    
    expect(onClose).toHaveBeenCalledWith('toast-1')
  })

  it('should auto-close after duration', () => {
    const onClose = vi.fn()
    render(<Toast id="toast-1" type="success" message="Test" onClose={onClose} duration={3000} />)
    
    expect(onClose).not.toHaveBeenCalled()
    
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    
    expect(onClose).toHaveBeenCalledWith('toast-1')
  })

  it('should not auto-close when duration is 0', () => {
    const onClose = vi.fn()
    render(<Toast id="toast-1" type="success" message="Test" onClose={onClose} duration={0} />)
    
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    
    expect(onClose).not.toHaveBeenCalled()
  })
})

describe('ToastContainer', () => {
  it('should render multiple toasts', () => {
    const toasts = [
      { id: '1', type: 'success' as const, message: 'Toast 1' },
      { id: '2', type: 'error' as const, message: 'Toast 2' }
    ]
    
    render(<ToastContainer toasts={toasts} onClose={vi.fn()} />)
    
    expect(screen.getByText('Toast 1')).toBeInTheDocument()
    expect(screen.getByText('Toast 2')).toBeInTheDocument()
  })

  it('should not render when toasts array is empty', () => {
    const { container } = render(<ToastContainer toasts={[]} onClose={vi.fn()} />)
    
    expect(container.firstChild).toBeNull()
  })
})
