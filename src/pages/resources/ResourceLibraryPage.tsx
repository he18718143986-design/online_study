import React from 'react'
import ResourceCard from '../../modules/teaching/components/ResourceCard'
import ResourceExtractorPanel from '../../modules/teaching/components/ResourceExtractorPanel'
import ResourceHeader from '../../modules/teaching/components/ResourceHeader'
import ResourceSidebar from '../../modules/teaching/components/ResourceSidebar'
import ResourceToolbar from '../../modules/teaching/components/ResourceToolbar'
import ResourceUploadDropzone from '../../modules/teaching/components/ResourceUploadDropzone'
import ResourceUploadModal from '../../modules/teaching/components/ResourceUploadModal'
import useResources from '../../modules/teaching/hooks/useResources'

const ResourceLibraryPage: React.FC = () => {
	const { resources, isLoading, error, upload, remove, refetch } = useResources()
	const [showUpload, setShowUpload] = React.useState(false)
	const [search, setSearch] = React.useState('')
	const [selectedFolder, setSelectedFolder] = React.useState('全部资源')

	const filtered = React.useMemo(() => {
		if (!search) return resources
		const q = search.toLowerCase()
		return resources.filter((item) => item.title.toLowerCase().includes(q) || item.tags.some((t) => t.toLowerCase().includes(q)))
	}, [resources, search])

	const handleInsert = (resId: string) => {
		console.log('insert to course stub', resId)
	}

	const handleUpload = async (fileName: string) => {
		await upload(fileName)
		setShowUpload(false)
	}

	return (
		<div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
			<ResourceHeader onRefresh={() => void refetch()} onOpenUpload={() => setShowUpload(true)} />

			<div className="flex flex-1 overflow-hidden">
				<ResourceSidebar
					folders={['全部资源', '代数', '几何', '数论', '组合', '视频', '文档']}
					selectedFolder={selectedFolder}
					onSelectFolder={setSelectedFolder}
				/>
				<main className="flex-1 flex flex-col min-w-0 bg-background-light">
					<ResourceToolbar search={search} onSearchChange={setSearch} />

					<div className="flex-1 overflow-y-auto px-6 pb-8">
						<ResourceUploadDropzone onUploadRequest={() => setShowUpload(true)} />

						{error ? <div className="text-sm text-red-600 mb-3">{error.message}</div> : null}
						{isLoading ? <div className="text-sm text-text-secondary mb-3">加载中...</div> : null}

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{filtered.map((res) => (
								<ResourceCard
									key={res.id}
									resource={res}
									onPreview={(item) => console.log('preview stub', item.id)}
									onInsert={(item) => handleInsert(item.id)}
									onShare={(item) => console.log('share stub', item.id)}
									onDelete={(item) => void remove(item.id)}
								/>
							))}
						</div>
					</div>
				</main>
				<ResourceExtractorPanel />
			</div>

			<ResourceUploadModal
				visible={showUpload}
				onClose={() => setShowUpload(false)}
				onUpload={() => void handleUpload('新上传资源.pdf')}
			/>
		</div>
	)
}

export default ResourceLibraryPage
