import { type ButtonHTMLAttributes, type ReactNode, type MouseEvent, forwardRef, useRef, useCallback, useState } from 'react'
import { Loader2, Check } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
  success?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-strong)] text-white',
    'shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    'hover:shadow-[0_8px_30px_var(--primary-glow)]',
    'active:translate-y-0 active:scale-[0.97] active:shadow-md',
    'disabled:opacity-50',
    'glass-sweep',
  ),
  secondary: cn(
    'border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]',
    'hover:border-[var(--accent-cyan)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_5%,transparent)]',
    'hover:-translate-y-0.5 hover:shadow-hud',
    'active:translate-y-0 active:scale-[0.97]',
  ),
  outline: cn(
    'border border-[var(--border)] bg-transparent text-[var(--text)]',
    'hover:border-[var(--accent-cyan)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_5%,transparent)]',
    'hover:-translate-y-0.5 hover:shadow-[0_0_20px_color-mix(in_srgb,var(--accent-cyan)_6%,transparent)]',
    'active:translate-y-0 active:scale-[0.97]',
  ),
  ghost: cn(
    'text-[var(--muted)] hover:text-[var(--text)]',
    'hover:bg-[color-mix(in_srgb,var(--accent-cyan)_6%,transparent)]',
    'active:scale-[0.97]',
  ),
  danger: cn(
    'bg-gradient-to-r from-[var(--danger)] to-[var(--danger-strong)] text-white',
    'shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    'hover:shadow-[0_8px_30px_color-mix(in_srgb,var(--danger)_20%,transparent)]',
    'active:translate-y-0 active:scale-[0.97]',
    'glass-sweep',
  ),
  link: 'text-[var(--accent-cyan)] underline-offset-4 hover:underline p-0 h-auto',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-7 text-base gap-2.5 rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, iconRight, disabled, children, success, ...props }, ref) => {
    const btnRef = useRef<HTMLButtonElement>(null)
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

    const combinedRef = useCallback((node: HTMLButtonElement | null) => {
      (btnRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
    }, [ref])

    const handleRipple = useCallback((e: MouseEvent<HTMLButtonElement>) => {
      if (variant === 'link') return
      const rect = btnRef.current?.getBoundingClientRect()
      if (!rect) return
      const id = Date.now()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setRipples((prev) => [...prev, { id, x, y }])
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600)
    }, [variant])

    return (
      <motion.div
        whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
        className="inline-block"
      >
        <button
          ref={combinedRef}
          disabled={disabled || loading}
          onClick={(e) => {
            handleRipple(e)
            props.onClick?.(e as unknown as MouseEvent<HTMLButtonElement>)
          }}
          className={cn(
            'inline-flex items-center justify-center font-semibold transition-all duration-300 relative overflow-hidden',
            'disabled:cursor-not-allowed',
            variantStyles[variant],
            sizeStyles[size],
            success && 'bg-[var(--success)] !shadow-[0_0_20px_color-mix(in_srgb,var(--success)_20%,transparent)]',
            className,
          )}
          {...props}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.span key="loading" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="shrink-0">
                <Loader2 size={size === 'sm' ? 14 : 16} className="animate-spin" />
              </motion.span>
            ) : success ? (
              <motion.span key="success" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="shrink-0">
                <Check size={size === 'sm' ? 14 : 16} />
              </motion.span>
            ) : icon ? (
              <motion.span key="icon" initial={false} animate={{ opacity: 1 }} className="shrink-0">
                {icon}
              </motion.span>
            ) : null}
          </AnimatePresence>
          {children}
          {iconRight}
          {/* Ripple effects */}
          {ripples.map((r) => (
            <span
              key={r.id}
              className="absolute rounded-full bg-white/20 pointer-events-none"
              style={{
                left: r.x - 10, top: r.y - 10, width: 20, height: 20,
                animation: 'rippleExpand 0.6s ease-out forwards',
              }}
            />
          ))}
        </button>
      </motion.div>
    )
  }
)
Button.displayName = 'Button'
