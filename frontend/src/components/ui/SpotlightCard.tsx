import { useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useMousePosition } from '@/hooks/useMousePosition'

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
}

export function SpotlightCard({ children, className, spotlightColor = 'rgba(0, 240, 255, 0.08)' }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { x, y } = useMousePosition(ref)

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_12%,var(--border))] bg-[color-mix(in_srgb,var(--surface-strong)_95%,var(--bg2))] transition-colors duration-200',
        className
      )}
    >
      <div
        className='pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100'
        style={{
          background: `radial-gradient(600px circle at ${x}px ${y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className='absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent opacity-20' />
      <div className='relative z-10'>{children}</div>
    </motion.div>
  )
}
