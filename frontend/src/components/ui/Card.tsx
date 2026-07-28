import { type HTMLAttributes, type ReactNode, useRef, useCallback, useState } from 'react'
import { cn } from '../../lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'stat' | 'tilt' | 'interactive' | 'hud'
  hover?: boolean
  glow?: boolean
  gradientBorder?: boolean
  stagger?: boolean
  index?: number
}

export function Card({
  className, variant = 'default', hover = true, glow = false,
  gradientBorder = false, stagger = false, index = 0,
  children, ...props
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 50, y: 50, active: false })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    })
  }, [])

  const base = 'relative overflow-hidden rounded-xl border transition-all duration-300'

  const variants: Record<string, string> = {
    default: cn(
      'border-[color-mix(in_srgb,var(--accent-cyan)_12%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] backdrop-blur-xl',
      hover && 'hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent-cyan)_25%,transparent)] hover:shadow-hud',
      'glass-sweep',
    ),
    glass: cn(
      'border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_60%,transparent)] backdrop-blur-2xl',
      'shadow-hud', hover && 'hover:-translate-y-0.5 hover:scale-[1.005] hover:border-[color-mix(in_srgb,var(--accent-cyan)_20%,transparent)] hover:shadow-hud-lg',
    ),
    stat: cn(
      'border-[color-mix(in_srgb,var(--accent-cyan)_12%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] backdrop-blur-xl',
      hover && 'hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent-cyan)_25%,transparent)] hover:shadow-hud',
    ),
    tilt: cn(
      'border-[color-mix(in_srgb,var(--accent-cyan)_12%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] backdrop-blur-xl',
      hover && 'hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent-cyan)_25%,transparent)] hover:shadow-hud',
    ),
    interactive: cn(
      'border-[color-mix(in_srgb,var(--accent-cyan)_12%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] backdrop-blur-xl cursor-pointer',
      hover && 'hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent-cyan)_30%,transparent)] hover:shadow-hud-lg',
      'glass-sweep',
    ),
    hud: cn(
      'border-[color-mix(in_srgb,var(--accent-cyan)_18%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] backdrop-blur-xl',
      'shadow-hud', hover && 'hover:border-[color-mix(in_srgb,var(--accent-cyan)_35%,transparent)] hover:shadow-hud-lg',
    ),
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouse((m) => ({ ...m, active: false }))}
      className={cn(base, variants[variant], glow && 'hover:shadow-glow-cyan', gradientBorder && 'gradient-border', className)}
      style={{
        boxShadow: variant === 'hud' ? undefined : '0 4px 20px color-mix(in srgb, var(--text) 8%, transparent)',
        animation: stagger ? `fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s both` : undefined,
      }}
      {...props}
    >
      {/* Mouse-follow spotlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-[1] transition-opacity duration-300"
        style={{
          opacity: mouse.active ? 1 : 0,
          background: `radial-gradient(500px circle at ${mouse.x}% ${mouse.y}%, color-mix(in srgb, var(--accent-cyan) 4%, transparent), transparent 40%)`,
        }}
      />
      {/* Shimmer sweep */}
      {hover && <div className="pointer-events-none absolute inset-0 z-[1]" />}
      <div className="relative z-[2]">{children}</div>
    </div>
  )
}

export function StatCardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('relative z-[2] p-5', className)}>{children}</div>
}
