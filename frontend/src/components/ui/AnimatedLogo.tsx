import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
  animate?: boolean
}

const sizeMap = {
  sm: { icon: 16, ring: 36, text: 'text-sm' },
  md: { icon: 20, ring: 44, text: 'text-lg' },
  lg: { icon: 28, ring: 64, text: 'text-2xl' },
  xl: { icon: 36, ring: 88, text: 'text-3xl' },
}

export function AnimatedLogo({ size = 'md', className, showText = true, animate = true }: AnimatedLogoProps) {
  const s = sizeMap[size]

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: s.ring, height: s.ring }}
        animate={animate ? { rotate: [0, 360] } : undefined}
        transition={animate ? { duration: 20, repeat: Infinity, ease: 'linear' } : undefined}
      >
        {/* Outer ring */}
        <svg className="absolute inset-0" viewBox="0 0 100 100">
          <defs>
            <linearGradient id={`logoGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-cyan)" />
              <stop offset="50%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--accent-violet)" />
            </linearGradient>
          </defs>
          <circle
            cx="50" cy="50" r="46"
            fill="none"
            stroke={`url(#logoGrad-${size})`}
            strokeWidth="2"
            strokeDasharray="20 10 5 10"
            opacity="0.8"
          />
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke="var(--accent-cyan)"
            strokeWidth="0.5"
            opacity="0.3"
          />
        </svg>
        {/* Glowing center */}
        <motion.div
          className="absolute inset-2 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(139, 92, 246, 0.15))',
            boxShadow: '0 0 30px rgba(0, 240, 255, 0.2), inset 0 0 20px rgba(139, 92, 246, 0.1)',
          }}
          animate={animate ? { boxShadow: [
            '0 0 20px rgba(0, 240, 255, 0.2), inset 0 0 15px rgba(139, 92, 246, 0.1)',
            '0 0 40px rgba(0, 240, 255, 0.35), inset 0 0 25px rgba(139, 92, 246, 0.2)',
            '0 0 20px rgba(0, 240, 255, 0.2), inset 0 0 15px rgba(139, 92, 246, 0.1)',
          ] } : undefined}
          transition={animate ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : undefined}
        >
          <svg width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </motion.div>
      </motion.div>
      {showText && (
        <div>
          <motion.h1
            className={cn('font-bold tracking-tight', s.text)}
            style={{
              fontFamily: 'Outfit, sans-serif',
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--primary), var(--accent-violet))',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            animate={animate ? { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] } : undefined}
            transition={animate ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : undefined}
          >
            PayFlow
          </motion.h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] font-mono">
            Recon Engine
          </p>
        </div>
      )}
    </div>
  )
}
