import { describe, it, expect, vi, beforeEach } from 'vitest'
import authService from '@/services/auth.service'

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.getItem = vi.fn()
    window.localStorage.setItem = vi.fn()
    window.localStorage.removeItem = vi.fn()
  })

  describe('getCurrentUser', () => {
    it('should return null when no user in storage', () => {
      ;(window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null)
      
      const user = authService.getCurrentUser()
      expect(user).toBeNull()
    })

    it('should return user object when user exists in storage', () => {
      const mockUser = { id: 'u1', name: '张老师', email: 'zhang@example.com', role: 'teacher' }
      ;(window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify(mockUser))
      
      const user = authService.getCurrentUser()
      expect(user).toEqual(mockUser)
    })

    it('should return null when storage contains invalid JSON', () => {
      ;(window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('invalid json')
      
      const user = authService.getCurrentUser()
      expect(user).toBeNull()
    })
  })

  describe('getToken', () => {
    it('should return token from storage', () => {
      const mockToken = 'test_token_abc'
      ;(window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(mockToken)
      
      const token = authService.getToken()
      expect(token).toBe(mockToken)
    })

    it('should return null when no token in storage', () => {
      ;(window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null)
      
      const token = authService.getToken()
      expect(token).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('should return false when no token or user', () => {
      ;(window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null)
      
      expect(authService.isAuthenticated()).toBe(false)
    })

    it('should return true when both token and user exist', () => {
      const mockUser = { id: 'u1', name: '张老师', email: 'zhang@example.com', role: 'teacher' }
      ;(window.localStorage.getItem as ReturnType<typeof vi.fn>)
        .mockReturnValueOnce('mock_token')
        .mockReturnValueOnce(JSON.stringify(mockUser))
      
      expect(authService.isAuthenticated()).toBe(true)
    })
  })

  describe('clearSession', () => {
    it('should remove token and user from storage', () => {
      authService.clearSession()
      
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('auth_token')
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('user_info')
    })
  })

  describe('saveSession', () => {
    it('should save token and user to storage', () => {
      const mockResponse = {
        user: { id: 'u1', name: '张老师', email: 'zhang@example.com', role: 'teacher' as const },
        token: 'new_token_123',
        expiresAt: '2026-01-16T00:00:00Z'
      }
      
      authService.saveSession(mockResponse)
      
      expect(window.localStorage.setItem).toHaveBeenCalledWith('auth_token', mockResponse.token)
      expect(window.localStorage.setItem).toHaveBeenCalledWith('user_info', JSON.stringify(mockResponse.user))
    })
  })
})
