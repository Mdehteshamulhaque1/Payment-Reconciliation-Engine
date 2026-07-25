import { CreditCard, TrendingUp, Activity, Shield, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useDashboardStats } from '@/hooks/useAnalytics'
import { useTransactionStats } from '@/hooks/useTransactions'
import { formatCurrency } from '@/lib/utils'

const metrics = [
  { key: 'total_transactions', label: 'Total Transactions', icon: CreditCard, color: 'var(--accent-cyan)', format: 'number' as const },
  { key: 'total_amount', label: 'Total Volume', icon: TrendingUp, color: 'var(--success)', format: 'currency' as const },
  { key: 'success_rate', label: 'Success Rate', icon: Activity, color: 'var(--primary)', format: 'percent' as const },
  { key: 'active_gateways', label: 'Active Gateways', icon: Shield, color: 'var(--warning)', format: 'number' as const },
]

function AnimatedValue({ value, format }: { value: number; format: string }) {
  if (format === 'currency') return <span>{formatCurrency(value)}</span>
  if (format === 'percent') return <span>{value?.toFixed(1)}%</span>
  return <span>{value?.toLocaleString()}</span>
}

export function ExecutiveHero() {
  const { data: stats } = useDashboardStats()
  const { data: txnStats } = useTransactionStats()

  const values: Record<string, number> = {
    total_transactions: stats?.total_transactions ?? txnStats?.total ?? 0,
    total_amount: stats?.total_amount ?? txnStats?.total_amount ?? 0,
    success_rate: stats?.success_rate ?? txnStats?.success_rate ?? 0,
    active_gateways: stats?.active_gateways ?? 0,
  }

  const changes = [
    { value: '+12.5%', up: true },
    { value: '+8.3%', up: true },
    { value: '+2.1%', up: true },
    { value: '0', up: true },
  ]

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_12%,var(--border))] bg-gradient-to-br from-[color-mix(in_srgb,var(--surface-strong)_95%,var(--bg2))] to-[color-mix(in_srgb,var(--bg2)_90%,var(--bg1))] p-6 md:p-8">
      {/* Background mesh */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, var(--accent-cyan), transparent 50%), radial-gradient(circle at 80% 20%, var(--primary), transparent 50%), radial-gradient(circle at 60% 80%, var(--accent-violet), transparent 50%)',
      }} />
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent opacity-30" />

      <div className="relative z-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-[var(--text)]" style={{ fontFamily: 'Outfit' }}>
            Executive Overview
          </h2>
          <p className="text-sm text-[var(--muted)] font-mono mt-1">
            Real-time payment operations at a glance
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => {
            const Icon = m.icon
            const change = changes[i]
            return (
              <div
                key={m.key}
                className="relative overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_60%,transparent)] p-4 backdrop-blur-sm"
              >
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-[40px] opacity-10" style={{ background: m.color }} />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `color-mix(in_srgb, ${m.color} 12%, transparent)` }}>
                    <Icon size={16} style={{ color: m.color }} />
                  </div>
                  <div className={`flex items-center gap-0.5 text-[10px] font-mono ${change.up ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                    {change.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {change.value}
                  </div>
                </div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted)] mb-1">{m.label}</p>
                <p className="text-xl font-bold text-[var(--text)] font-mono">
                  <AnimatedValue value={values[m.key]} format={m.format} />
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
