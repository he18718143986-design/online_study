/**
 * Authentication service
 * - Handles login/logout/register
 * - Uses mock behavior when VITE_USE_MOCK === 'true'
 * - Stores auth token in localStorage
 */

import api from './apiClient'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export interface User {
	id: string
	name: string
	email: string
	role: 'teacher' | 'admin' | 'student'
	avatar?: string | null
}

export interface LoginPayload {
	email: string
	password: string
}

export interface RegisterPayload {
	name: string
	email: string
	password: string
	role?: 'teacher'
}

export interface AuthResponse {
	user: User
	token: string
	expiresAt: string
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const STORAGE_KEYS = {
	TOKEN: 'auth_token',
	USER: 'user_info'
}

// Mock user data
const mockUsers = [
	{
		id: 'u1',
		name: '张老师',
		email: 'zhang@example.com',
		password: 'password123',
		role: 'teacher' as const
	},
	{
		id: 'demo',
		name: '演示教师',
		email: 'demo@example.com',
		password: 'demo123',
		role: 'teacher' as const
	}
]

export const authService = {
	/**
	 * Login with email and password
	 */
	async login(payload: LoginPayload): Promise<AuthResponse> {
		if (USE_MOCK) {
			await delay(800)

			// Find user by email
			const user = mockUsers.find(
				(u) => u.email.toLowerCase() === payload.email.toLowerCase()
			)

			if (!user || user.password !== payload.password) {
				throw new Error('用户名或密码错误')
			}

			const token = `mock_token_${Date.now()}_${Math.random().toString(36).slice(2)}`
			const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

			const response: AuthResponse = {
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role
				},
				token,
				expiresAt
			}

			// Store in localStorage
			this.saveSession(response)

			return response
		}

		const res = await api.post<AuthResponse>('/auth/login', payload)
		this.saveSession(res.data)
		return res.data
	},

	/**
	 * Logout current user
	 */
	async logout(): Promise<void> {
		if (USE_MOCK) {
			await delay(200)
			this.clearSession()
			return
		}

		try {
			await api.post('/auth/logout')
		} finally {
			this.clearSession()
		}
	},

	/**
	 * Register a new teacher account
	 */
	async register(payload: RegisterPayload): Promise<AuthResponse> {
		if (USE_MOCK) {
			await delay(1000)

			// Check if email already exists
			const exists = mockUsers.some(
				(u) => u.email.toLowerCase() === payload.email.toLowerCase()
			)
			if (exists) {
				throw new Error('该邮箱已被注册')
			}

			const newUser = {
				id: `u_${Date.now().toString(36)}`,
				name: payload.name,
				email: payload.email,
				password: payload.password,
				role: 'teacher' as const
			}

			mockUsers.push(newUser)

			const token = `mock_token_${Date.now()}_${Math.random().toString(36).slice(2)}`
			const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

			const response: AuthResponse = {
				user: {
					id: newUser.id,
					name: newUser.name,
					email: newUser.email,
					role: newUser.role
				},
				token,
				expiresAt
			}

			this.saveSession(response)
			return response
		}

		const res = await api.post<AuthResponse>('/auth/register', payload)
		this.saveSession(res.data)
		return res.data
	},

	/**
	 * Get current user from stored session
	 */
	getCurrentUser(): User | null {
		if (typeof window === 'undefined') return null

		try {
			const userStr = localStorage.getItem(STORAGE_KEYS.USER)
			if (!userStr) return null
			return JSON.parse(userStr) as User
		} catch {
			return null
		}
	},

	/**
	 * Get current auth token
	 */
	getToken(): string | null {
		if (typeof window === 'undefined') return null
		return localStorage.getItem(STORAGE_KEYS.TOKEN)
	},

	/**
	 * Check if user is authenticated
	 */
	isAuthenticated(): boolean {
		return !!this.getToken() && !!this.getCurrentUser()
	},

	/**
	 * Save session to localStorage
	 */
	saveSession(response: AuthResponse): void {
		if (typeof window === 'undefined') return
		localStorage.setItem(STORAGE_KEYS.TOKEN, response.token)
		localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))
	},

	/**
	 * Clear session from localStorage
	 */
	clearSession(): void {
		if (typeof window === 'undefined') return
		localStorage.removeItem(STORAGE_KEYS.TOKEN)
		localStorage.removeItem(STORAGE_KEYS.USER)
	},

	/**
	 * Refresh token (for future use)
	 */
	async refreshToken(): Promise<AuthResponse | null> {
		if (USE_MOCK) {
			const user = this.getCurrentUser()
			if (!user) return null

			await delay(300)

			const token = `mock_token_${Date.now()}_${Math.random().toString(36).slice(2)}`
			const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

			const response: AuthResponse = {
				user,
				token,
				expiresAt
			}

			this.saveSession(response)
			return response
		}

		try {
			const res = await api.post<AuthResponse>('/auth/refresh')
			this.saveSession(res.data)
			return res.data
		} catch {
			this.clearSession()
			return null
		}
	}
}

export default authService
