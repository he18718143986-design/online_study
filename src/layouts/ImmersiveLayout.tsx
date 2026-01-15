import React from 'react'

interface Props {
	children?: React.ReactNode
	onBack?: () => void
}

const ImmersiveLayout: React.FC<Props> = ({ children, onBack }) => {
	return (
		<div className="min-h-screen bg-black text-white" role="presentation">
			<header className="h-12 px-4 flex items-center border-b border-white/10" aria-label="沉浸式标题栏">
				<button
					type="button"
					className="text-sm font-medium flex items-center gap-1"
					onClick={onBack}
					aria-label="返回"
				>
					<span className="material-symbols-outlined text-base">arrow_back</span>
					返回
				</button>
				<span className="ml-3 text-sm text-white/80">沉浸模式</span>
			</header>
			<main className="min-h-[calc(100vh-3rem)]" role="main">
				{children}
			</main>
		</div>
	)
}

export default ImmersiveLayout
