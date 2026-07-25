import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  color?: 'primary' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
  size?: 'sm' | 'md'
}

const colorMap = {
  primary: 'from-[var(--primary)] to-[var(--accent-cyan)]',
  success: 'from-[var(--success)] to-[var(--success-strong)]',
  warning: 'from-[var(--warning)] to-[var(--warning-strong)]',
  danger: 'from-[var(--danger)] to-[var(--danger-strong)]',
}

export function Progress({ value, max = 100, className, color = 'primary', showLabel, size = 'md' }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-[var(--muted)]">Progress</span>
          <span className="font-medium text-[var(--text)]">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--muted)_10%,var(--bg3))]', size === 'sm' ? 'h-1.5' : 'h-2')}>
        <div
          className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out', colorMap[color])}
          style={{ width: `${percentage}%`, boxShadow: `0 0 12px var(--primary-glow)` }}
        />
      </div>
    </div>
  )
}
