/**
 * 来源 HTML: screen_id: e2ff3e9e9b5148b28a6741d0c8901e64
 * Generated from Stitch export
 */
import React from 'react'

export interface AvatarStackProps {
	avatars: string[]
	limit?: number
	size?: number
}

// TODO: replace with real Avatar component once available
const AvatarStack: React.FC<AvatarStackProps> = ({ avatars, limit = 5, size = 32 }) => {
	const display = avatars.slice(0, limit)
	const remaining = avatars.length - display.length
	return (
		<div className="flex -space-x-2" aria-label="头像列表">
			{display.map((src, idx) => (
				<div
					key={idx}
					className="rounded-full border-2 border-white dark:border-slate-800 bg-cover bg-center"
					style={{ width: size, height: size, backgroundImage: `url(${src})` }}
					aria-hidden
				/>
			))}
			{remaining > 0 ? (
				<div
					className="rounded-full border-2 border-white dark:border-slate-800 bg-gray-200 text-text-secondary flex items-center justify-center text-xs font-medium"
					style={{ width: size, height: size }}
					aria-label={`还有 ${remaining} 人`}
				>
					+{remaining}
				</div>
			) : null}
		</div>
	)
}

export default AvatarStack
