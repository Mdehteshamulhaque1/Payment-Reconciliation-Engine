import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Wifi } from 'lucide-react'
import { useDevStore } from '@/store/devStore'

export function DevPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const metrics = useDevStore((s) => s.metrics)
  const clearMetrics = useDevStore((s) => s.clearMetrics)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[91] max-h-[50vh] rounded-t-2xl border border-b-0 border-[color-mix(in_srgb,var(--accent-cyan)_15%,var(--border))] bg-[color-mix(in_srgb,var(--surface-strong)_95%,var(--bg2))] backdrop-blur-xl shadow-hud-lg"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <div className="flex items-center gap-2">
                <Wifi size={14} className="text-[var(--accent-cyan)]" />
                <span className="text-sm font-semibold" style={{ fontFamily: 'Outfit' }}>API Metrics</span>
                <span className="rounded-md bg-[color-mix(in_srgb,var(--accent-cyan)_10%,transparent)] px-1.5 py-0.5 text-[9px] font-mono text-[var(--accent-cyan)]">{metrics.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={clearMetrics}
                  className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] hover:text-[var(--danger)] transition-colors"
                  title="Clear metrics"
                >
                  <Trash2 size={14} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)] hover:text-[var(--accent-cyan)] transition-colors"
                >
                  <X size={14} />
                </motion.button>
              </div>
            </div>

            <div className="overflow-auto max-h-[calc(50vh-52px)]">
              {metrics.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-sm text-[var(--muted)] font-mono">
                  No API calls recorded yet
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-[var(--surface-strong)]">
                    <tr className="border-b border-[var(--border)] text-[10px] font-mono uppercase tracking-wider text-[var(--muted)]">
                      <th className="px-4 py-2">Method</th>
                      <th className="px-4 py-2">Endpoint</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Time</th>
                      <th className="px-4 py-2">Cache</th>
                      <th className="px-4 py-2">Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((m, i) => {
                      const statusColor = m.status >= 200 && m.status < 300 ? 'text-[var(--success)]' : m.status >= 400 ? 'text-[var(--danger)]' : 'text-[var(--warning)]'
                      const cacheColor = m.cacheStatus === 'HIT' ? 'text-[var(--success)]' : m.cacheStatus === 'STALE' ? 'text-[var(--warning)]' : 'text-[var(--muted)]'
                      const age = Math.round((Date.now() - m.timestamp) / 1000)
                      return (
                        <tr key={i} className="border-b border-[color-mix(in_srgb,var(--border)_50%,transparent)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_3%,transparent)] transition-colors">
                          <td className="px-4 py-2">
                            <span className="rounded bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] px-1.5 py-0.5 text-[10px] font-mono font-bold text-[var(--primary)]">{m.method}</span>
                          </td>
                          <td className="px-4 py-2 text-[11px] font-mono text-[var(--accent-cyan)] truncate max-w-[200px]">{m.endpoint}</td>
                          <td className={`px-4 py-2 text-[11px] font-mono font-bold ${statusColor}`}>{m.status}</td>
                          <td className="px-4 py-2 text-[11px] font-mono text-[var(--text)]">{m.responseTime}ms</td>
                          <td className={`px-4 py-2 text-[11px] font-mono font-bold ${cacheColor}`}>{m.cacheStatus}</td>
                          <td className="px-4 py-2 text-[11px] font-mono text-[var(--muted)]">{age}s ago</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
