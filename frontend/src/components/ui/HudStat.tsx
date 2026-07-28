import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AnimatedNumber } from './AnimatedNumber'
import type { StatCardProps } from '@/types'

const colorMap: Record<string, { glow: string; bg: string; text: string; border: string }> = {
  primary: { glow: 'color-mix(in srgb, var(--primary) 20%, transparent)', bg: 'color-mix(in srgb, var(--primary) 10%, transparent)', text: 'var(--primary)', border: 'var(--primary)' },
  success: { glow: 'color-mix(in srgb, var(--success) 20%, transparent)', bg: 'color-mix(in srgb, var(--success) 10%, transparent)', text: 'var(--success)', border: 'var(--success)' },
  warning: { glow: 'color-mix(in srgb, var(--warning) 20%, transparent)', bg: 'color-mix(in srgb, var(--warning) 10%, transparent)', text: 'var(--warning)', border: 'var(--warning)' },
  danger: { glow: 'color-mix(in srgb, var(--danger) 20%, transparent)', bg: 'color-mix(in srgb, var(--danger) 10%, transparent)', text: 'var(--danger)', border: 'var(--danger)' },
  info: { glow: 'color-mix(in srgb, var(--info) 20%, transparent)', bg: 'color-mix(in srgb, var(--info) 10%, transparent)', text: 'var(--info)', border: 'var(--info)' },
}

export function HudStat({ icon: Icon, label, value, change, color = 'primary', delay = 0, isCurrency, onClick }: StatCardProps) {
  const c = colorMap[color] ?? colorMap.primary
  const numericValue = typeof value === 'number' ? value : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.25 } }}
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer shimmer-overlay',
        'border-[color-mix(in_srgb,' + c.border + '_15%,var(--border))]',
        'bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] backdrop-blur-xl',
        'hover:shadow-[0_0_30px_' + c.glow + ']',
        'hover:border-[color-mix(in_srgb,' + c.border + '_35%,transparent)]',
      )}
      style={{ boxShadow: '0 4px 20px color-mix(in srgb, var(--text) 8%, transparent)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${c.border}, transparent)`, opacity: 0.4 }} />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1 min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--muted)] font-mono">{label}</p>
            <p className="text-2xl font-bold tracking-tight font-mono" style={{ color: c.text }}>
              {isCurrency ? (
                <AnimatedNumber value={numericValue} prefix="$" duration={1500} />
              ) : typeof value === 'number' ? (
                <AnimatedNumber value={numericValue} duration={1500} />
              ) : (
                value
              )}
            </p>
          </div>
          <motion.div
            className="shrink-0 rounded-lg p-2.5 border transition-all duration-300"
            whileHover={{ scale: 1.15, rotate: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            style={{
              background: c.bg,
              borderColor: `color-mix(in srgb, ${c.border} 20%, transparent)`,
              boxShadow: `0 0 15px ${c.glow}`,
            }}
          >
            <span style={{ color: c.text }}><Icon size={18} /></span>
          </motion.div>
        </div>
        {change !== undefined && change !== null && (
          <div className="mt-3 flex items-center gap-2 border-t border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))] pt-3">
            {change > 0 ? (
              <span className="text-[var(--success)] text-xs">▲</span>
            ) : change < 0 ? (
              <span className="text-[var(--danger)] text-xs">▼</span>
            ) : (
              <span className="text-[var(--muted)] text-xs">—</span>
            )}
            <span className={cn(
              'text-[10px] font-mono font-bold',
              change > 0 && 'text-[var(--success)]',
              change < 0 && 'text-[var(--danger)]',
              change === 0 && 'text-[var(--muted)]',
            )}>
              {Math.abs(change).toFixed(1)}%
            </span>
            <span className="text-[9px] text-[var(--muted)] font-mono uppercase tracking-wider">vs prev</span>
          </div>
        )}
      </div>

      <div
        className="pointer-events-none absolute -right-12 -bottom-12 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: c.glow }}
      />
    </motion.div>
  )
}
