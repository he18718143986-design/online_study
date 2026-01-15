/**
 * Axios-based API client used by services when `import.meta.env.VITE_USE_MOCK !== 'true'`.
 *
 * Notes:
 * - Keeps an Axios-like response shape (`{ data: T }`) so existing services can keep using `res.data`.
 * - Auth token is optional and pulled from localStorage.
 */

import axios from 'axios'

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE || '/api',
	timeout: 20_000,
	headers: {
		'Content-Type': 'application/json'
	}
})

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('auth_token')
	if (token) {
		// Axios' header types vary a bit across versions; cast keeps this simple.
		const headers = (config.headers ?? {}) as any
		headers.Authorization = `Bearer ${token}`
		config.headers = headers
	}
	return config
})

export default api
