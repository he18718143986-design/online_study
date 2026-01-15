import React from 'react'

type Props = {
	children?: React.ReactNode
}

const AppLayout: React.FC<Props> = ({ children }) => {
	return <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-white">{children}</div>
}

export default AppLayout
