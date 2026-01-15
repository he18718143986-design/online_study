// 来源 HTML: screen_id: recording_library
import React from 'react'
import recordingsService from '@/services/recordings.service'
import type { Recording } from '@/types/models/recording'

export interface UseRecordingsResult {
	recordings: Recording[]
	isLoading: boolean
	error?: Error
	filters: {
		courseId?: string
		status?: Recording['status']
		date?: string
	}
	setFilters: (filters: Partial<UseRecordingsResult['filters']>) => void
	refetch: () => Promise<void>
	setReady: (recordingId: string) => Promise<void>
}
export function useRecordings(initialFilters: Partial<UseRecordingsResult['filters']> = {}): UseRecordingsResult {
	const [recordings, setRecordings] = React.useState<Recording[]>([])
	const [filters, setFilters] = React.useState<UseRecordingsResult['filters']>(initialFilters)
	const [isLoading, setIsLoading] = React.useState(false)
	const [error, setError] = React.useState<Error | undefined>(undefined)

	const filtered = React.useMemo(() => {
		return recordings.filter((rec) => {
			if (filters.courseId && rec.courseId !== filters.courseId) return false
			if (filters.status && rec.status !== filters.status) return false
			if (filters.date && rec.date !== filters.date) return false
			return true
		})
	}, [filters, recordings])

	const refetch = React.useCallback(async () => {
		setIsLoading(true)
		setError(undefined)
		try {
			const list = await recordingsService.list(filters.courseId)
			setRecordings(list)
		} catch (err) {
			setError(err as Error)
		} finally {
			setIsLoading(false)
		}
	}, [filters.courseId])

	React.useEffect(() => {
		void refetch()
	}, [refetch])

	// Poll while any recording is processing to pick up backend status flips (e.g., transcoding -> ready).
	React.useEffect(() => {
		const hasProcessing = filtered.some((rec) => rec.status === 'processing')
		if (!hasProcessing) return undefined
		const timer = setInterval(() => {
			void refetch()
		}, 4000)
		return () => clearInterval(timer)
	}, [filtered, refetch])

	const setReady = React.useCallback(async (recordingId: string) => {
		setRecordings((prev) => prev.map((rec) => (rec.id === recordingId ? { ...rec, status: 'ready' } : rec)))
	}, [])

	const handleSetFilters = React.useCallback((f: Partial<UseRecordingsResult['filters']>) => {
		setFilters((prev) => ({ ...prev, ...f }))
	}, [])

	return {
		recordings: filtered,
		isLoading,
		error,
		filters,
		setFilters: handleSetFilters,
		refetch,
		setReady
	}
}

export default useRecordings
