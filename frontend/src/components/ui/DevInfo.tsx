import { motion, AnimatePresence } from 'framer-motion'
import { useDevStore } from '@/store/devStore'

interface DevInfoProps {
  endpoint: string
  method?: string
}

export function DevInfo({ endpoint, method = 'GET' }: DevInfoProps) {
  const devMode = useDevStore((s) => s.devMode)
  const metrics = useDevStore((s) => s.metrics)

  if (!devMode) return null

  const metric = metrics.find((m) => m.endpoint === endpoint && m.method === method)
  const status = metric?.status ?? 0
  const responseTime = metric?.responseTime ?? 0
  const cacheStatus = metric?.cacheStatus ?? 'MISS'
  const lastRefresh = metric?.timestamp ? Math.round((Date.now() - metric.timestamp) / 1000) : null

  const statusColor = status >= 200 && status < 300 ? 'text-[var(--success)]' : status >= 400 ? 'text-[var(--danger)]' : status >= 300 ? 'text-[var(--warning)]' : 'text-[var(--muted)]'
  const cacheColor = cacheStatus === 'HIT' ? 'text-[var(--success)]' : cacheStatus === 'STALE' ? 'text-[var(--warning)]' : 'text-[var(--muted)]'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="absolute top-2 right-2 z-30 rounded-lg border border-[color-mix(in_srgb,var(--accent-cyan)_15%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] backdrop-blur-xl px-2.5 py-1.5 shadow-lg pointer-events-none"
      >
        <div className="flex items-center gap-2 text-[9px] font-mono">
          <span className="text-[var(--muted)]">{method}</span>
          <span className="text-[var(--accent-cyan)] truncate max-w-[120px]">{endpoint}</span>
          {metric && (
            <>
              <span className={statusColor}>{status}</span>
              <span className="text-[var(--muted)]">{responseTime}ms</span>
              <span className={cacheColor}>{cacheStatus}</span>
              {lastRefresh !== null && <span className="text-[var(--muted)]">{lastRefresh}s</span>}
            </>
          )}
          {!metric && <span className="text-[var(--muted)]">—</span>}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
