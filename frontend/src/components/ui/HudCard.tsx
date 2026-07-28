import { type ReactNode, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HudCardProps {
  children: ReactNode
  className?: string
  delay?: number
  glowColor?: string
  cornerAccent?: boolean
}

export function HudCard({ children, className, delay = 0, glowColor = 'var(--accent-cyan)', cornerAccent = true }: HudCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    ref.current.style.setProperty('--mx', `${x}%`)
    ref.current.style.setProperty('--my', `${y}%`)
  }, [])

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_15%,var(--border))]',
        'bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] backdrop-blur-xl',
        'transition-all duration-300',
        'hover:border-[color-mix(in_srgb,var(--accent-cyan)_30%,transparent)]',
        'hover:shadow-[0_0_30px_color-mix(in_srgb,var(--accent-cyan)_8%,transparent)]',
        className,
      )}
      style={{
        boxShadow: '0 4px 24px color-mix(in srgb, var(--text) 10%, transparent), inset 0 1px 0 color-mix(in srgb, var(--text) 4%, transparent)',
      }}
    >
      {/* Mouse-follow glow */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), ${glowColor}08, transparent 40%)`,
        }}
      />
      {cornerAccent && (
        <>
          <div className="pointer-events-none absolute top-0 left-0 h-4 w-4 border-t border-l opacity-40" style={{ borderColor: glowColor }} />
          <div className="pointer-events-none absolute top-0 right-0 h-4 w-4 border-t border-r opacity-40" style={{ borderColor: glowColor }} />
          <div className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b border-l opacity-40" style={{ borderColor: glowColor }} />
          <div className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b border-r opacity-40" style={{ borderColor: glowColor }} />
        </>
      )}
      <div className="relative z-[2]">
        {children}
      </div>
    </motion.div>
  )
}
