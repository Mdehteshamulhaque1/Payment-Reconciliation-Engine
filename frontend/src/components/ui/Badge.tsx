import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary'
type BadgeSize = 'sm' | 'md'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  pulse?: boolean
  dot?: boolean
  icon?: ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-[color-mix(in_srgb,var(--success)_10%,transparent)] text-[var(--success)] border border-[color-mix(in_srgb,var(--success)_20%,transparent)] shadow-[color-mix(in_srgb,var(--success)_12%,transparent)_0_0_12px]',
  warning: 'bg-[color-mix(in_srgb,var(--warning)_10%,transparent)] text-[var(--warning)] border border-[color-mix(in_srgb,var(--warning)_20%,transparent)] shadow-[color-mix(in_srgb,var(--warning)_12%,transparent)_0_0_12px]',
  danger: 'bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-[var(--danger)] border border-[color-mix(in_srgb,var(--danger)_20%,transparent)] shadow-[color-mix(in_srgb,var(--danger)_12%,transparent)_0_0_12px]',
  info: 'bg-[color-mix(in_srgb,var(--info)_10%,transparent)] text-[var(--info)] border border-[color-mix(in_srgb,var(--info)_20%,transparent)] shadow-[color-mix(in_srgb,var(--info)_12%,transparent)_0_0_12px]',
  neutral: 'bg-[color-mix(in_srgb,var(--muted)_8%,transparent)] text-[var(--muted)] border border-[color-mix(in_srgb,var(--muted)_15%,transparent)]',
  primary: 'bg-[color-mix(in_srgb,var(--accent-cyan)_10%,transparent)] text-[var(--accent-cyan)] border border-[color-mix(in_srgb,var(--accent-cyan)_20%,transparent)] shadow-[color-mix(in_srgb,var(--accent-cyan)_12%,transparent)_0_0_12px]',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
}

export function Badge({ variant = 'neutral', size = 'sm', pulse, dot, icon, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md font-mono font-bold uppercase tracking-wider',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {dot && (
        <span className={cn('relative flex h-1.5 w-1.5')}>
          {pulse && (
            <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', `bg-current`)} />
          )}
          <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', `bg-current`)} />
        </span>
      )}
      {icon}
      {children}
    </span>
  )
}

export function getStatusBadgeVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    success: 'success', matched: 'success', completed: 'success', resolved: 'success', active: 'success',
    processing: 'info', reconciled: 'info',
    pending: 'warning', created: 'warning', disputed: 'warning', inactive: 'warning',
    failed: 'danger', cancelled: 'danger', unmatched: 'danger',
    refunded: 'info',
  }
  return map[status] || 'neutral'
}
