import { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react'
import { useTransactions } from '@/hooks/useTransactions'
import { useGateways } from '@/hooks/useGateways'
import { formatCurrency } from '@/lib/utils'

const statusConfig: Record<string, { color: string; bg: string; icon: typeof CheckCircle }> = {
  success: { color: 'var(--success)', bg: 'rgba(34,197,94,0.1)', icon: CheckCircle },
  failed: { color: 'var(--danger)', bg: 'rgba(239,68,68,0.1)', icon: XCircle },
  pending: { color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)', icon: Clock },
  processing: { color: 'var(--accent-cyan)', bg: 'rgba(0,240,255,0.1)', icon: RefreshCw },
  created: { color: 'var(--muted)', bg: 'rgba(150,150,150,0.1)', icon: ArrowRight },
}

export function LiveStream() {
  const { data } = useTransactions({ page: 1, size: 8 })
  const { data: gateways } = useGateways()
  const containerRef = useRef<HTMLDivElement>(null)

  const txns = data?.items ?? []

  return (
    <div className="relative rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-[color-mix(in_srgb,var(--surface-strong)_95%,var(--bg2))] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-neon)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-neon)]" />
          </span>
          <h3 className="text-sm font-semibold" style={{ fontFamily: 'Outfit' }}>Live Transaction Stream</h3>
        </div>
        <span className="text-[10px] font-mono text-[var(--muted)]">auto-refresh 5s</span>
      </div>

      <div ref={containerRef} className="divide-y divide-[color-mix(in_srgb,var(--border)_50%,transparent)] max-h-[360px] overflow-auto">
        <AnimatePresence mode="popLayout">
          {txns.map((t) => {
            const cfg = statusConfig[t.status] || statusConfig.created
            const Icon = cfg.icon
            const gwName = gateways?.find((g) => g.id === t.gateway_id)?.display_name ?? '—'
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[color-mix(in_srgb,var(--accent-cyan)_3%,transparent)] transition-colors cursor-pointer"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: cfg.bg }}>
                  <Icon size={14} style={{ color: cfg.color }} className={t.status === 'processing' ? 'animate-spin' : ''} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[var(--text)] truncate">{formatCurrency(t.amount, t.currency)}</span>
                    <span className="text-[10px] font-mono text-[var(--muted)]">→</span>
                    <span className="text-[10px] font-mono text-[var(--muted)]">{gwName}</span>
                  </div>
                  <p className="text-[10px] font-mono text-[var(--muted)] truncate">{t.transaction_ref}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: cfg.color, background: cfg.bg }}>{t.status}</span>
                  <p className="text-[9px] font-mono text-[var(--muted)] mt-0.5">{new Date(t.created_at).toLocaleTimeString()}</p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {txns.length === 0 && (
          <div className="flex items-center justify-center py-8 text-sm text-[var(--muted)] font-mono">No transactions yet</div>
        )}
      </div>
    </div>
  )
}
