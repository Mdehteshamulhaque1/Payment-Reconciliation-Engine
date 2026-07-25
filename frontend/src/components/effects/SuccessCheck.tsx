import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SuccessCheckProps {
  size?: number
  className?: string
}

export function SuccessCheck({ size = 48, className }: SuccessCheckProps) {
  return (
    <motion.div
      className={cn('flex items-center justify-center', className)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
    >
      <svg width={size} height={size} viewBox="0 0 52 52">
        <motion.circle
          cx="26" cy="26" r="25"
          fill="none"
          stroke="var(--success)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.path
          d="M14 27l7.8 7.8L38 17"
          fill="none"
          stroke="var(--success)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        />
      </svg>
    </motion.div>
  )
}
