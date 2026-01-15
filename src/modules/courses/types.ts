import { type MetricCardProps } from '@/components/widgets/MetricCard'

// Metric preview card data shape reused across course detail views
export type MetricPreview = { key: string } & Omit<MetricCardProps, 'keyName' | 'icon'>
