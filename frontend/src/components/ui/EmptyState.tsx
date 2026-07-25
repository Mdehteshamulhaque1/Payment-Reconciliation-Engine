import { type ElementType } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from './Button'

interface EmptyStateProps {
  icon: ElementType
  title?: string
  description?: string
  message?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, message, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('flex flex-col items-center justify-center py-16 text-center', className)}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--primary)_8%,transparent)]">
        <Icon size={28} className="text-[var(--primary)]" />
      </div>
      <h3 className="text-base font-semibold text-[var(--text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>{title ?? message ?? 'No data'}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-[var(--muted)]">{description}</p>}
      {action && (
        <Button variant="primary" size="sm" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  )
}
