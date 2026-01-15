import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '@/services/apiClient'

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.getItem = vi.fn()
    window.localStorage.setItem = vi.fn()
    window.localStorage.removeItem = vi.fn()
  })

  it('should have correct base URL configuration', () => {
    // The baseURL is set from env or defaults to /api
    expect(api.defaults.baseURL).toBeDefined()
  })

  it('should have correct timeout setting', () => {
    expect(api.defaults.timeout).toBe(20000)
  })

  it('should have correct Content-Type header', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json')
  })

  it('should be an axios instance', () => {
    expect(api).toBeDefined()
    expect(typeof api.get).toBe('function')
    expect(typeof api.post).toBe('function')
    expect(typeof api.put).toBe('function')
    expect(typeof api.delete).toBe('function')
  })

  it('should have interceptors configured', () => {
    expect(api.interceptors).toBeDefined()
    expect(api.interceptors.request).toBeDefined()
    expect(api.interceptors.response).toBeDefined()
  })
})
