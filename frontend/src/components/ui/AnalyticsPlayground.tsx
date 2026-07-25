import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, PieChart, TrendingUp, Activity, Maximize2, Minimize2 } from 'lucide-react'
import { useDashboardStats, useGatewayComparison, useTopFailures } from '@/hooks/useAnalytics'
import { useTransactionStats } from '@/hooks/useTransactions'

type ChartType = 'area' | 'bar' | 'donut'

interface Widget {
  id: string
  title: string
  chartType: ChartType
  source: string
}

const defaultWidgets: Widget[] = [
  { id: 'overview', title: 'Transaction Overview', chartType: 'area', source: '/analytics/dashboard' },
  { id: 'gateways', title: 'Gateway Performance', chartType: 'bar', source: '/analytics/gateway-comparison' },
  { id: 'breakdown', title: 'Status Breakdown', chartType: 'donut', source: '/transactions/stats' },
  { id: 'failures', title: 'Top Failures', chartType: 'bar', source: '/analytics/top-failures' },
]

const chartIcons: Record<ChartType, typeof BarChart3> = {
  area: TrendingUp, bar: BarChart3, donut: PieChart,
}

export function AnalyticsPlayground() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const { data: stats } = useDashboardStats()
  const { data: gwComp } = useGatewayComparison()
  const { data: topFailures } = useTopFailures()
  const { data: txnStats } = useTransactionStats()

  return (
    <div className="rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-[color-mix(in_srgb,var(--surface-strong)_95%,var(--bg2))] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[var(--accent-cyan)]" />
          <h3 className="text-sm font-semibold" style={{ fontFamily: 'Outfit' }}>Analytics Playground</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {/* Overview Widget */}
        <WidgetCard
          widget={defaultWidgets[0]}
          expanded={expanded === 'overview'}
          onToggle={() => setExpanded(expanded === 'overview' ? null : 'overview')}
        >
          <div className="space-y-2">
            <MetricRow label="Total Transactions" value={stats?.total_transactions?.toLocaleString() ?? '0'} color="var(--accent-cyan)" />
            <MetricRow label="Total Volume" value={`₹${(stats?.total_amount ?? 0).toLocaleString()}`} color="var(--success)" />
            <MetricRow label="Success Rate" value={`${(stats?.success_rate ?? 0).toFixed(1)}%`} color="var(--primary)" />
            <MetricRow label="Reconciliation Accuracy" value={`${(stats?.reconciliation_accuracy ?? 0).toFixed(1)}%`} color="var(--accent-violet)" />
          </div>
        </WidgetCard>

        {/* Gateway Widget */}
        <WidgetCard
          widget={defaultWidgets[1]}
          expanded={expanded === 'gateways'}
          onToggle={() => setExpanded(expanded === 'gateways' ? null : 'gateways')}
        >
          <div className="space-y-2">
            {gwComp?.slice(0, 5).map((gw) => (
              <div key={gw.gateway_name} className="flex items-center gap-2">
                <span className="text-xs text-[var(--text)] truncate w-20">{gw.gateway_name}</span>
                <div className="flex-1 h-2 rounded-full bg-[var(--surface)] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${gw.success_rate}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: 'var(--success)' }}
                  />
                </div>
                <span className="text-[10px] font-mono text-[var(--muted)] w-10 text-right">{gw.success_rate.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Breakdown Widget */}
        <WidgetCard
          widget={defaultWidgets[2]}
          expanded={expanded === 'breakdown'}
          onToggle={() => setExpanded(expanded === 'breakdown' ? null : 'breakdown')}
        >
          <div className="grid grid-cols-2 gap-3">
            <MiniStat label="Success" value={txnStats?.success ?? 0} color="var(--success)" />
            <MiniStat label="Failed" value={txnStats?.failed ?? 0} color="var(--danger)" />
            <MiniStat label="Pending" value={txnStats?.pending ?? 0} color="var(--warning)" />
            <MiniStat label="Refunded" value={txnStats?.refunded ?? 0} color="var(--accent-violet)" />
          </div>
        </WidgetCard>

        {/* Failures Widget */}
        <WidgetCard
          widget={defaultWidgets[3]}
          expanded={expanded === 'failures'}
          onToggle={() => setExpanded(expanded === 'failures' ? null : 'failures')}
        >
          <div className="space-y-2">
            {topFailures?.slice(0, 5).map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-[var(--text)] truncate w-28">{f.reason || 'Unknown'}</span>
                <div className="flex-1 h-2 rounded-full bg-[var(--surface)] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${f.percentage}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: 'var(--danger)' }}
                  />
                </div>
                <span className="text-[10px] font-mono text-[var(--muted)] w-10 text-right">{f.count}</span>
              </div>
            ))}
            {(!topFailures || topFailures.length === 0) && (
              <p className="text-xs text-[var(--muted)] font-mono">No failure data</p>
            )}
          </div>
        </WidgetCard>
      </div>
    </div>
  )
}

function WidgetCard({ widget, children, expanded, onToggle }: { widget: Widget; children: React.ReactNode; expanded: boolean; onToggle: () => void }) {
  const Icon = chartIcons[widget.chartType]
  return (
    <motion.div
      layout
      className={`rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_60%,transparent)] overflow-hidden ${expanded ? 'lg:col-span-2' : ''}`}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-[color-mix(in_srgb,var(--border)_50%,transparent)]">
        <div className="flex items-center gap-2">
          <Icon size={12} className="text-[var(--accent-cyan)]" />
          <span className="text-xs font-medium text-[var(--text)]">{widget.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-mono text-[var(--muted)]">{widget.source}</span>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onToggle} className="rounded p-1 text-[var(--muted)] hover:text-[var(--accent-cyan)] transition-colors">
            {expanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </motion.button>
        </div>
      </div>
      <div className="p-3">{children}</div>
    </motion.div>
  )
}

function MetricRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[var(--muted)]">{label}</span>
      <span className="text-sm font-mono font-bold" style={{ color }}>{value}</span>
    </div>
  )
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg p-2" style={{ background: `color-mix(in_srgb, ${color} 5%, transparent)` }}>
      <p className="text-[9px] font-mono uppercase text-[var(--muted)]">{label}</p>
      <p className="text-lg font-bold font-mono" style={{ color }}>{value.toLocaleString()}</p>
    </div>
  )
}
