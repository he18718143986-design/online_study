// 来源 HTML: screen_id: e2ff3e9e9b5148b28a6741d0c8901e64 — Generated from Stitch export
import React from 'react'
import MetricCard, { type MetricCardProps } from '../../../components/widgets/MetricCard'

export interface Metric extends Omit<MetricCardProps, 'keyName' | 'icon'> {
	key: string
}

interface Props {
	metrics: Metric[]
}

const RealtimeClassStats: React.FC<Props> = ({ metrics }) => {
	return (
		<div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-none border border-border-color dark:border-slate-700 p-6 flex flex-col h-full">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h3 className="font-bold text-text-main dark:text-white text-lg flex items-center gap-2">
						<span className="material-symbols-outlined text-primary">analytics</span>
						实时课堂指标
					</h3>
					<p className="text-xs text-text-secondary flex items-center gap-1.5 mt-1.5">
						<span className="relative flex h-2 w-2" aria-hidden>
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
						</span>
						<span className="font-mono">WS_CONNECTED</span> · 监控中
					</p>
				</div>
				<div className="flex items-center gap-2">
					<select
						className="bg-input-bg dark:bg-slate-700 border-none text-xs font-medium text-text-main dark:text-white rounded-lg py-1.5 pl-3 pr-8 focus:ring-1 focus:ring-primary"
						aria-label="选择课程"
					>
						<option>高一数学竞赛冲刺班 (A班)</option>
					</select>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="list" aria-label="实时指标卡片">
				{metrics.map((metric) => (
					<MetricCard key={metric.key} keyName={metric.key} label={metric.label} value={metric.value} unit={metric.unit} color={metric.color} progress={metric.progress} />
				))}
			</div>
		</div>
	)
}

export default RealtimeClassStats
