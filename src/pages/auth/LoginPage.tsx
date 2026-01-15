import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'

const LoginPage: React.FC = () => {
	const navigate = useNavigate()
	const [username, setUsername] = React.useState('')
	const [password, setPassword] = React.useState('')

	return (
		<div className="min-h-screen flex items-center justify-center bg-background-light text-text-main p-6">
			<div className="w-full max-w-sm bg-surface-light border border-border-light rounded-xl p-6 shadow-sm">
				<h1 className="text-lg font-bold">登录</h1>
				<p className="text-sm text-text-secondary mt-1">原型占位：点击登录进入教学总览。</p>

				<form
					className="mt-5 space-y-3"
					onSubmit={(e) => {
						e.preventDefault()
						navigate(ROUTES.dashboard)
					}}
				>
					<label className="block">
						<span className="text-xs text-text-secondary">账号</span>
						<input
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="mt-1 w-full h-10 px-3 rounded-lg border border-border-light bg-white"
							placeholder="teacher@example.com"
							aria-label="账号"
						/>
					</label>

					<label className="block">
						<span className="text-xs text-text-secondary">密码</span>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="mt-1 w-full h-10 px-3 rounded-lg border border-border-light bg-white"
							placeholder="••••••••"
							aria-label="密码"
						/>
					</label>

					<button type="submit" className="w-full h-10 rounded-lg bg-primary text-white font-bold hover:bg-blue-600" aria-label="登录">
						登录
					</button>
				</form>
			</div>
		</div>
	)
}

export default LoginPage
