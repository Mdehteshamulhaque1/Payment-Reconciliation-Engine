import { CreditCard, ArrowRight, Server, Landmark, CheckCircle, Wallet } from 'lucide-react'
import { useDashboardStats } from '@/hooks/useAnalytics'

const stages = [
  { id: 'user', label: 'User', icon: CreditCard, x: 5, color: 'var(--accent-cyan)' },
  { id: 'gateway', label: 'Gateway', icon: Server, x: 25, color: 'var(--primary)' },
  { id: 'processor', label: 'Processor', icon: Landmark, x: 47, color: 'var(--accent-violet)' },
  { id: 'bank', label: 'Bank', icon: Landmark, x: 69, color: 'var(--warning)' },
  { id: 'settlement', label: 'Settled', icon: Wallet, x: 91, color: 'var(--success)' },
]

export function FlowMap() {
  const { data: stats } = useDashboardStats()
  const total = stats?.total_transactions ?? 0
  const successRate = stats?.success_rate ?? 0
  const volumes = [
    { count: total, label: 'Initiated' },
    { count: Math.round(total * 0.98), label: 'Processed' },
    { count: Math.round(total * 0.96), label: 'Authorized' },
    { count: Math.round(total * 0.95), label: 'Captured' },
    { count: Math.round(total * (successRate / 100)), label: 'Settled' },
  ]

  return (
    <div className="relative rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-[color-mix(in_srgb,var(--surface-strong)_95%,var(--bg2))] p-6 overflow-hidden">
      <h3 className="text-sm font-semibold mb-6" style={{ fontFamily: 'Outfit' }}>Payment Flow Map</h3>

      {/* Desktop flow (horizontal) */}
      <div className="hidden md:block relative h-32">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          {stages.slice(0, -1).map((s, i) => {
            const next = stages[i + 1]
            const x1 = `${s.x + 5}%`
            const x2 = `${next.x + 2}%`
            return (
              <line key={i} x1={x1} y1="32" x2={x2} y2="32" stroke="var(--border)" strokeWidth="2" strokeDasharray="6 4" />
            )
          })}
        </svg>

        {/* Nodes */}
        {stages.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.id}
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${s.x}%`, transform: 'translateX(-50%)' }}
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-xl border-2"
                style={{ borderColor: `color-mix(in_srgb, ${s.color} 40%, var(--border))`, background: `color-mix(in_srgb, ${s.color} 8%, var(--surface))` }}
              >
                <Icon size={22} style={{ color: s.color }} />
              </div>
              <p className="mt-2 text-[10px] font-mono font-medium text-[var(--text)]">{s.label}</p>
              <p className="text-[10px] font-mono text-[var(--muted)]">{volumes[stages.indexOf(s)].count.toLocaleString()}</p>
            </div>
          )
        })}
      </div>

      {/* Mobile flow (vertical) */}
      <div className="md:hidden flex flex-col items-center gap-1">
        {stages.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={s.id} className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl border-2"
                style={{ borderColor: `color-mix(in_srgb, ${s.color} 40%, var(--border))`, background: `color-mix(in_srgb, ${s.color} 8%, var(--surface))` }}
              >
                <Icon size={16} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--text)]">{s.label}</p>
                <p className="text-[10px] font-mono text-[var(--muted)]">{volumes[i].count.toLocaleString()}</p>
              </div>
              {i < stages.length - 1 && <ArrowRight size={12} className="text-[var(--muted)] ml-1 rotate-90" />}
            </div>
          )
        })}
      </div>

      {/* Success rate badge */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <CheckCircle size={14} className="text-[var(--success)]" />
        <span className="text-xs font-mono text-[var(--muted)]">Overall success rate: <span className="text-[var(--success)] font-bold">{successRate.toFixed(1)}%</span></span>
      </div>
    </div>
  )
}
