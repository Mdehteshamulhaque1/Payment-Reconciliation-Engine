import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react'
import { Loader2, Check } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link' | 'glass' | 'brutal' | 'skeuo'
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
    'bg-[var(--primary)] text-[var(--on-primary)]',
    'hover:bg-[var(--primary-deep)]',
    'active:bg-[var(--primary-press)]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ),
  secondary: cn(
    'border border-[var(--hairline)] bg-[var(--canvas)] text-[var(--ink)]',
    'hover:border-[var(--primary)] hover:text-[var(--primary)]',
    'active:bg-[color-mix(in_srgb,var(--primary)_6%,transparent)]',
  ),
  outline: cn(
    'border border-[var(--hairline)] bg-transparent text-[var(--ink)]',
    'hover:border-[var(--primary)] hover:text-[var(--primary)]',
    'active:bg-[color-mix(in_srgb,var(--primary)_6%,transparent)]',
  ),
  ghost: cn(
    'text-[var(--ink-mute)] hover:text-[var(--ink)]',
    'hover:bg-[color-mix(in_srgb,var(--primary)_6%,transparent)]',
    'active:scale-[0.97]',
  ),
  danger: cn(
    'bg-[var(--danger)] text-white',
    'hover:opacity-90',
    'active:opacity-80',
  ),
  link: cn(
    'text-[var(--primary)] underline-offset-4 hover:underline p-0 h-auto',
  ),
  glass: cn(
    'glass text-[var(--ink)] hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)]',
    'active:scale-[0.97]',
  ),
  brutal: cn(
    'brutal-border-sm bg-[var(--canvas)] text-[var(--ink)] font-bold uppercase tracking-[0.02em]',
    'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none',
    'active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_var(--ink)]',
  ),
  skeuo: cn(
    'skeuo-btn text-white font-medium',
    'active:skeuo-press',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ),
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-4 text-button-sm gap-1.5',
  md: 'h-10 px-5 text-button-md gap-2',
  lg: 'h-12 px-7 text-button-md gap-2.5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, iconRight, disabled, children, success, ...props }, ref) => {
    return (
      <motion.div
        whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
        className="inline-block"
      >
        <button
          ref={ref}
          disabled={disabled || loading}
          className={cn(
            'pill-button',
            variantStyles[variant],
            sizeStyles[size],
            success && '!bg-[var(--success)]',
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
        </button>
      </motion.div>
    )
  }
)
Button.displayName = 'Button'
