import { type ElementType } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

interface ErrorStateProps {
  icon?: ElementType
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ icon: Icon = AlertTriangle, title = 'Something went wrong', message, onRetry, className }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('flex flex-col items-center justify-center py-16 text-center', className)}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--danger)_10%,transparent)]">
        <Icon size={28} className="text-[var(--danger)]" />
      </div>
      <h3 className="text-base font-semibold text-[var(--text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-[var(--muted)]">{message}</p>}
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </motion.div>
  )
}
