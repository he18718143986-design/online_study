import React from 'react'

export type ResourceType = 'pdf' | 'video' | 'doc' | 'tex' | 'other'

export interface ResourceItem {
	id: string
	title: string
	type: ResourceType
	module: string
	tags: string[]
	version?: string
	uploader?: string
	thumbnail?: string
	durationLabel?: string
	sizeLabel?: string
}

export interface UseResourcesResult {
	resources: ResourceItem[]
	isLoading: boolean
	error?: Error
	upload: (fileName: string) => Promise<ResourceItem>
	remove: (id: string) => Promise<void>
	refetch: () => Promise<void>
}

const mockResources: ResourceItem[] = [
	{
		id: 'res-1',
		title: '2023年全国高中数学联赛模拟试题(一).pdf',
		type: 'pdf',
		module: '代数',
		tags: ['PDF', '代数'],
		version: 'v1.0',
		uploader: '张数学',
		sizeLabel: '4.2 MB'
	},
	{
		id: 'res-2',
		title: '平面几何：梅涅劳斯定理应用讲解.mp4',
		type: 'video',
		module: '几何',
		tags: ['MP4', '几何'],
		version: 'v2.1',
		uploader: '李几何',
		durationLabel: '14:20'
	},
	{
		id: 'res-3',
		title: 'CMO2022_Finals_Source.tex',
		type: 'tex',
		module: '数论',
		tags: ['TEX', '数论'],
		version: 'v1.0',
		uploader: '张数学',
		sizeLabel: '2.1 MB'
	},
	{
		id: 'res-4',
		title: '组合数学进阶讲义：图论基础.docx',
		type: 'doc',
		module: '组合',
		tags: ['DOCX', '组合'],
		version: 'v3.5',
		uploader: '王代数'
	}
]

export function useResources(): UseResourcesResult {
	const [resources, setResources] = React.useState<ResourceItem[]>(mockResources)
	const [isLoading, setIsLoading] = React.useState(false)
	const [error, setError] = React.useState<Error | undefined>(undefined)

	const refetch = React.useCallback(async () => {
		setIsLoading(true)
		setError(undefined)
		await new Promise((resolve) => setTimeout(resolve, 120))
		setResources(mockResources)
		setIsLoading(false)
	}, [])

	const upload = React.useCallback(async (fileName: string) => {
		await new Promise((resolve) => setTimeout(resolve, 100))
		const next: ResourceItem = {
			id: `res-${Date.now()}`,
			title: fileName,
			type: 'other',
			module: '未分类',
			tags: ['上传'],
			uploader: '我'
		}
		setResources((prev) => [next, ...prev])
		return next
	}, [])

	const remove = React.useCallback(async (id: string) => {
		await new Promise((resolve) => setTimeout(resolve, 80))
		setResources((prev) => prev.filter((item) => item.id !== id))
	}, [])

	return { resources, isLoading, error, upload, remove, refetch }
}

export default useResources
