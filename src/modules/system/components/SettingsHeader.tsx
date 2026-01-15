import React from 'react'

interface SettingsHeaderProps {
	onTestS3: () => void
	onTestSSO: () => void
	onSave: () => void
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ onTestS3, onTestSSO, onSave }) => (
	<header className="h-16 bg-white dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-6 shrink-0">
		<div>
			<h2 className="text-xl font-bold text-text-main-light dark:text-text-main-dark">系统设置与权限</h2>
			<p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">管理角色、权限矩阵与集成配置</p>
		</div>
		<div className="flex items-center gap-2 text-sm">
			<button
				type="button"
				className="px-3 py-2 rounded-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-main-light dark:text-text-main-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition"
				onClick={onTestS3}
			>
				测试 S3 集成 (stub)
			</button>
			<button
				type="button"
				className="px-3 py-2 rounded-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-main-light dark:text-text-main-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition"
				onClick={onTestSSO}
			>
				测试 SSO (stub)
			</button>
			<button
				type="button"
				className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover shadow-sm"
				onClick={onSave}
			>
				保存并记录审计
			</button>
		</div>
	</header>
)

export default SettingsHeader
