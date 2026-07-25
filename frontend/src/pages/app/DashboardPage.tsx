import { Cpu } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { ExecutiveHero } from '@/components/ui/ExecutiveHero'
import { FlowMap } from '@/components/ui/FlowMap'
import { LiveStream } from '@/components/ui/LiveStream'
import { GatewayHealthCenter } from '@/components/ui/GatewayHealthCenter'
import { useDashboardStats, useGatewayComparison, useTopFailures } from '@/hooks/useAnalytics'
import { Activity, GitCompareArrows, Wallet, AlertTriangle } from 'lucide-react'

const cardStyle = {
  background: 'rgba(15,18,35,0.95)',
  border: '1px solid rgba(6,182,212,0.1)',
}

export default function DashboardPage() {
  const { data: stats } = useDashboardStats()
  const { data: gatewayComp } = useGatewayComparison()
  const { data: topFailures } = useTopFailures()

  return (
    <div className='space-y-5'>
      {/* Header */}
      <PageHeader
        title='Command Center'
        description='Real-time payment operations overview'
        breadcrumb={[{ label: 'Home', href: '/' }]}
        actions={
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1.5 rounded-full px-3 py-1' style={{ border: '1px solid rgba(34,197,94,0.2)', background: 'rgba(34,197,94,0.05)' }}>
              <span className='relative flex h-1.5 w-1.5'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-75' />
                <span className='relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--success)]' />
              </span>
              <span className='text-[10px] font-mono font-medium text-[var(--success)]'>LIVE</span>
            </div>
            <div className='flex items-center gap-1.5 rounded-full px-3 py-1' style={{ border: '1px solid rgba(6,182,212,0.15)', background: 'rgba(6,182,212,0.05)' }}>
              <Cpu size={10} className='text-[var(--accent-cyan)]' />
              <span className='text-[10px] font-mono font-medium text-[var(--accent-cyan)]'>SYS OK</span>
            </div>
          </div>
        }
      />

      {/* Executive Overview — unified KPI cards */}
      <ExecutiveHero />

      {/* Payment Flow Map */}
      <FlowMap />

      {/* Live Stream + Gateway Health */}
      <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
        <LiveStream />
        <GatewayHealthCenter />
      </div>

      {/* Bottom Row: System Health + Failures + Gateway Performance */}
      <div className='grid grid-cols-1 gap-5 lg:grid-cols-3'>
        {/* System Health */}
        <div className='relative rounded-2xl p-5' style={cardStyle}>
          <h3 className='text-sm font-semibold mb-4' style={{ fontFamily: 'Outfit' }}>System Health</h3>
          <div className='space-y-3'>
            <HealthRow icon={GitCompareArrows} label='Reconciliation Accuracy' value={`${(stats?.reconciliation_accuracy ?? 0).toFixed(1)}%`} color='var(--success)' />
            <HealthRow icon={Wallet} label='Pending Settlements' value={stats?.pending_settlements ?? 0} color='var(--warning)' />
            <HealthRow icon={AlertTriangle} label='Fraud Cases' value={stats?.fraud_cases ?? 0} color='var(--danger)' />
            <HealthRow icon={Activity} label='Total Settlements' value={stats?.total_settlements ?? 0} color='var(--accent-cyan)' />
          </div>
        </div>

        {/* Top Failures */}
        <div className='relative rounded-2xl p-5' style={cardStyle}>
          <h3 className='text-sm font-semibold mb-4' style={{ fontFamily: 'Outfit' }}>Top Failures</h3>
          <div className='space-y-3'>
            {topFailures?.slice(0, 5).map((f, i) => (
              <div key={i} className='flex items-center gap-3'>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between mb-1'>
                    <span className='text-xs text-[var(--text)] truncate'>{f.reason || 'Unknown'}</span>
                    <span className='text-[10px] font-mono text-[var(--muted)] ml-2 shrink-0'>{f.count}</span>
                  </div>
                  <div className='h-1.5 rounded-full overflow-hidden' style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className='h-full rounded-full transition-all duration-1000'
                      style={{ width: `${f.percentage}%`, background: 'linear-gradient(90deg, var(--danger), rgba(245,158,11,0.6))' }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {(!topFailures || topFailures.length === 0) && (
              <p className='text-xs text-[var(--muted)] font-mono text-center py-4'>No failure data</p>
            )}
          </div>
        </div>

        {/* Gateway Performance */}
        <div className='relative rounded-2xl p-5' style={cardStyle}>
          <h3 className='text-sm font-semibold mb-4' style={{ fontFamily: 'Outfit' }}>Gateway Performance</h3>
          <div className='space-y-3'>
            {gatewayComp?.slice(0, 5).map((gw) => (
              <div key={gw.gateway_name} className='flex items-center gap-3'>
                <span className='text-xs text-[var(--text)] truncate w-20 shrink-0'>{gw.gateway_name}</span>
                <div className='flex-1 h-2 rounded-full overflow-hidden' style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className='h-full rounded-full transition-all duration-1000'
                    style={{ width: `${gw.success_rate}%`, background: 'linear-gradient(90deg, var(--success), var(--accent-cyan))' }}
                  />
                </div>
                <div className='text-right shrink-0'>
                  <span className='text-[10px] font-mono text-[var(--text)]'>{gw.success_rate.toFixed(1)}%</span>
                  <p className='text-[9px] font-mono text-[var(--muted)]'>{gw.avg_latency_ms}ms</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function HealthRow({ icon: Icon, label, value, color }: { icon: typeof Activity; label: string; value: string | number; color: string }) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <Icon size={14} style={{ color }} />
        <span className='text-xs text-[var(--muted)]'>{label}</span>
      </div>
      <span className='text-sm font-mono font-bold text-[var(--text)]'>{value}</span>
    </div>
  )
}
