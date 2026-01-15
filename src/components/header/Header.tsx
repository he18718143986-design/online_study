import React from 'react'

const Header: React.FC = () => {
	return (
		<header className="h-14 px-4 flex items-center justify-between border-b border-border-light bg-white" role="banner">
			<h1 className="text-base font-bold">教学平台</h1>
			<div className="text-sm text-text-secondary" aria-label="user-menu">
				<span className="material-symbols-outlined align-middle text-base mr-1">person</span>
				张老师
			</div>
		</header>
	)
}

export default Header
