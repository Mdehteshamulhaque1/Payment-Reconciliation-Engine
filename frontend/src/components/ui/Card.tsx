import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'feature' | 'dashboard' | 'pricing' | 'pricing-featured' | 'cream' | 'glass' | 'brutal' | 'brutal-accent' | 'skeuo'
  hover?: boolean
  stagger?: boolean
  index?: number
}

export function Card({
  className, variant = 'default', hover = true,
  stagger = false, index = 0,
  children, ...props
}: CardProps) {
  const base = 'relative overflow-hidden border transition-all duration-200'

  const variants: Record<string, string> = {
    default: cn(
      'rounded-lg border-[var(--hairline)] bg-[var(--canvas)]',
      hover && 'hover:shadow-card-hover hover:-translate-y-0.5',
    ),
    feature: cn(
      'rounded-lg border-[var(--hairline)] bg-[var(--canvas)] p-8',
      hover && 'hover:shadow-card-hover hover:-translate-y-0.5',
    ),
    dashboard: cn(
      'rounded-lg border-[var(--hairline)] bg-[var(--canvas)] p-6',
      'shadow-card',
      hover && 'hover:shadow-card-hover',
    ),
    pricing: cn(
      'rounded-lg border-[var(--hairline)] bg-[var(--canvas)] p-8',
      hover && 'hover:shadow-card-hover hover:-translate-y-0.5',
    ),
    'pricing-featured': cn(
      'rounded-lg border-[var(--brand-dark-900)] bg-[var(--brand-dark-900)] p-8 text-[var(--on-primary)]',
      hover && 'hover:shadow-card-hover hover:-translate-y-0.5',
    ),
    cream: cn(
      'rounded-lg border-transparent bg-[var(--canvas-cream)] p-8',
      hover && 'hover:shadow-card-hover hover:-translate-y-0.5',
    ),
    glass: cn(
      'glass-card rounded-xl p-8',
      hover && 'hover:shadow-lg hover:-translate-y-0.5',
    ),
    brutal: cn(
      'brutal-card rounded-none p-8',
      hover && 'hover:translate-x-[2px] hover:translate-y-[2px]',
    ),
    'brutal-accent': cn(
      'brutal-card-accent rounded-none p-8',
      hover && 'hover:translate-x-[2px] hover:translate-y-[2px]',
    ),
    skeuo: cn(
      'skeuo-card p-8',
      hover && 'hover:-translate-y-0.5',
    ),
  }

  return (
    <div
      className={cn(base, variants[variant], className)}
      style={{
        boxShadow: variant === 'dashboard' ? 'rgba(0,55,112,0.08) 0 1px 3px' : undefined,
        animation: stagger ? `slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s both` : undefined,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
