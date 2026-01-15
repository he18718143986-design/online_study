import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'

interface FormErrors {
	username?: string
	password?: string
	general?: string
}

const LoginPage: React.FC = () => {
	const navigate = useNavigate()
	const [username, setUsername] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [isLoading, setIsLoading] = React.useState(false)
	const [errors, setErrors] = React.useState<FormErrors>({})
	const [showPassword, setShowPassword] = React.useState(false)

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {}

		if (!username.trim()) {
			newErrors.username = '请输入账号'
		} else if (username.length < 3) {
			newErrors.username = '账号长度至少3个字符'
		}

		if (!password) {
			newErrors.password = '请输入密码'
		} else if (password.length < 6) {
			newErrors.password = '密码长度至少6个字符'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setErrors({})

		if (!validateForm()) {
			return
		}

		setIsLoading(true)

		try {
			// 模拟登录请求
			await new Promise((resolve) => setTimeout(resolve, 800))

			// 模拟验证：接受任何有效格式的凭据
			// 在真实场景中，这里会调用 authService.login(username, password)
			if (username === 'error') {
				throw new Error('用户名或密码错误')
			}

			// 保存登录状态（模拟）
			if (typeof window !== 'undefined') {
				localStorage.setItem('auth_token', 'mock_token_' + Date.now())
				localStorage.setItem('user_info', JSON.stringify({
					id: 'u1',
					name: '张老师',
					role: 'teacher',
					email: username.includes('@') ? username : `${username}@example.com`
				}))
			}

			// 登录成功，跳转到主页
			navigate(ROUTES.dashboard)
		} catch (err) {
			setErrors({
				general: err instanceof Error ? err.message : '登录失败，请稍后重试'
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleInputChange = (field: 'username' | 'password', value: string) => {
		if (field === 'username') {
			setUsername(value)
			if (errors.username) {
				setErrors((prev) => ({ ...prev, username: undefined }))
			}
		} else {
			setPassword(value)
			if (errors.password) {
				setErrors((prev) => ({ ...prev, password: undefined }))
			}
		}
		// 清除通用错误
		if (errors.general) {
			setErrors((prev) => ({ ...prev, general: undefined }))
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-text-main dark:text-white p-6">
			<div className="w-full max-w-sm">
				{/* Logo and Title */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
						<span className="material-symbols-outlined text-3xl">school</span>
					</div>
					<h1 className="text-2xl font-bold text-text-main dark:text-white">数学竞赛在线学习平台</h1>
					<p className="text-sm text-text-secondary mt-2">教师端登录</p>
				</div>

				{/* Login Card */}
				<div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm">
					{/* General Error */}
					{errors.general && (
						<div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2" role="alert">
							<span className="material-symbols-outlined text-red-500 text-lg flex-shrink-0">error</span>
							<p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4" noValidate>
						{/* Username Field */}
						<div>
							<label htmlFor="username" className="block text-xs font-medium text-text-secondary mb-1.5">
								账号
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
									<span className="material-symbols-outlined text-lg">person</span>
								</span>
								<input
									id="username"
									type="text"
									value={username}
									onChange={(e) => handleInputChange('username', e.target.value)}
									className={`w-full h-11 pl-10 pr-3 rounded-lg border bg-white dark:bg-gray-800 transition-colors ${
										errors.username
											? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
											: 'border-border-light dark:border-border-dark focus:border-primary focus:ring-primary/20'
									} focus:outline-none focus:ring-2`}
									placeholder="请输入账号或邮箱"
									autoComplete="username"
									disabled={isLoading}
									aria-invalid={!!errors.username}
									aria-describedby={errors.username ? 'username-error' : undefined}
								/>
							</div>
							{errors.username && (
								<p id="username-error" className="mt-1.5 text-xs text-red-500 flex items-center gap-1" role="alert">
									<span className="material-symbols-outlined text-sm">info</span>
									{errors.username}
								</p>
							)}
						</div>

						{/* Password Field */}
						<div>
							<label htmlFor="password" className="block text-xs font-medium text-text-secondary mb-1.5">
								密码
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
									<span className="material-symbols-outlined text-lg">lock</span>
								</span>
								<input
									id="password"
									type={showPassword ? 'text' : 'password'}
									value={password}
									onChange={(e) => handleInputChange('password', e.target.value)}
									className={`w-full h-11 pl-10 pr-10 rounded-lg border bg-white dark:bg-gray-800 transition-colors ${
										errors.password
											? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
											: 'border-border-light dark:border-border-dark focus:border-primary focus:ring-primary/20'
									} focus:outline-none focus:ring-2`}
									placeholder="请输入密码"
									autoComplete="current-password"
									disabled={isLoading}
									aria-invalid={!!errors.password}
									aria-describedby={errors.password ? 'password-error' : undefined}
								/>
								<button
									type="button"
									className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main transition-colors"
									onClick={() => setShowPassword(!showPassword)}
									aria-label={showPassword ? '隐藏密码' : '显示密码'}
									disabled={isLoading}
								>
									<span className="material-symbols-outlined text-lg">
										{showPassword ? 'visibility_off' : 'visibility'}
									</span>
								</button>
							</div>
							{errors.password && (
								<p id="password-error" className="mt-1.5 text-xs text-red-500 flex items-center gap-1" role="alert">
									<span className="material-symbols-outlined text-sm">info</span>
									{errors.password}
								</p>
							)}
						</div>

						{/* Remember & Forgot */}
						<div className="flex items-center justify-between text-sm">
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary/20"
									disabled={isLoading}
								/>
								<span className="text-text-secondary">记住我</span>
							</label>
							<button
								type="button"
								className="text-primary hover:text-primary-600 font-medium transition-colors"
								disabled={isLoading}
							>
								忘记密码？
							</button>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							className="w-full h-11 rounded-lg bg-primary text-white font-bold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
							disabled={isLoading}
							aria-busy={isLoading}
						>
							{isLoading ? (
								<>
									<span className="spinner" aria-hidden="true"></span>
									<span>登录中...</span>
								</>
							) : (
								<>
									<span className="material-symbols-outlined text-lg">login</span>
									<span>登录</span>
								</>
							)}
						</button>
					</form>

					{/* Divider */}
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-border-light dark:border-border-dark"></div>
						</div>
						<div className="relative flex justify-center text-xs">
							<span className="px-2 bg-surface-light dark:bg-surface-dark text-text-secondary">或</span>
						</div>
					</div>

					{/* Demo Login */}
					<button
						type="button"
						className="w-full h-10 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 text-text-main dark:text-white text-sm font-medium hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
						onClick={() => {
							setUsername('demo@example.com')
							setPassword('demo123')
						}}
						disabled={isLoading}
					>
						<span className="material-symbols-outlined text-lg text-primary">play_circle</span>
						使用演示账号
					</button>

					{/* Help Text */}
					<p className="mt-4 text-xs text-text-secondary text-center">
						演示账号：demo@example.com / demo123
					</p>
				</div>

				{/* Footer */}
				<p className="mt-6 text-xs text-text-secondary text-center">
					遇到问题？<a href="#" className="text-primary hover:underline">联系技术支持</a>
				</p>
			</div>
		</div>
	)
}

export default LoginPage
