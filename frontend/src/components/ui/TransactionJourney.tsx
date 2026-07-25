import { motion } from 'framer-motion'
import { CheckCircle, Clock, XCircle, ArrowRight, Circle } from 'lucide-react'
import type { Transaction } from '@/types'

interface TransactionJourneyProps {
  transaction: Transaction
}

const steps = [
  { key: 'created', label: 'Created', icon: Circle, status: 'created' },
  { key: 'processing', label: 'Processing', icon: Clock, status: 'processing' },
  { key: 'success', label: 'Completed', icon: CheckCircle, status: 'success' },
  { key: 'reconciled', label: 'Reconciled', icon: ArrowRight, status: 'reconciled' },
  { key: 'settled', label: 'Settled', icon: CheckCircle, status: 'settled' },
]

const statusOrder = ['created', 'processing', 'pending', 'success', 'reconciled', 'settled']
const failedStatuses = ['failed', 'cancelled', 'refunded', 'disputed']

function getStepIndex(status: string): number {
  if (failedStatuses.includes(status)) return statusOrder.indexOf('processing')
  const idx = statusOrder.indexOf(status)
  return idx >= 0 ? idx : 0
}

export function TransactionJourney({ transaction }: TransactionJourneyProps) {
  const currentIdx = getStepIndex(transaction.status)
  const isFailed = failedStatuses.includes(transaction.status)

  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const Icon = step.icon
          const isPast = i < currentIdx
          const isCurrent = i === currentIdx && !isFailed

          let color = 'var(--muted)'
          let bgColor = 'var(--surface)'
          if (isPast) { color = 'var(--success)'; bgColor = 'rgba(34,197,94,0.1)' }
          if (isCurrent) { color = 'var(--accent-cyan)'; bgColor = 'rgba(0,240,255,0.1)' }

          return (
            <div key={step.key} className="flex items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={isCurrent ? { boxShadow: [`0 0 0px ${color}00`, `0 0 16px ${color}44`, `0 0 0px ${color}00`] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: isFailed && i === currentIdx ? 'var(--danger)' : color,
                    background: isFailed && i === currentIdx ? 'rgba(239,68,68,0.1)' : bgColor,
                  }}
                >
                  {isFailed && i === currentIdx ? (
                    <XCircle size={16} style={{ color: 'var(--danger)' }} />
                  ) : isPast ? (
                    <CheckCircle size={16} style={{ color }} />
                  ) : (
                    <Icon size={16} style={{ color }} />
                  )}
                </motion.div>
                <p className="mt-1.5 text-[9px] font-mono text-[var(--muted)]">{step.label}</p>
              </motion.div>

              {i < steps.length - 1 && (
                <div className="mx-1 h-px w-8 sm:w-12 lg:w-20 -mt-5">
                  <div className="h-full" style={{ background: isPast ? 'var(--success)' : 'var(--border)' }} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {isFailed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 rounded-lg border border-[color-mix(in_srgb,var(--danger)_20%,var(--border))] bg-[color-mix(in_srgb,var(--danger)_5%,transparent)] p-2 text-center"
        >
          <p className="text-[10px] font-mono text-[var(--danger)]">
            Transaction {transaction.status}: {transaction.failure_reason || 'Unknown error'}
          </p>
        </motion.div>
      )}
    </div>
  )
}
