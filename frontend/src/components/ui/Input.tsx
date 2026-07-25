import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
  icon?: ReactNode
  endIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, iconLeft: _il, iconRight: _ir, icon, endIcon, id, ...props }, ref) => {
    const iconLeft = _il ?? icon
    const iconRight = _ir ?? endIcon
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-[var(--text)]">
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
              {iconLeft}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-xl border bg-[var(--bg3)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition-all duration-200',
              'placeholder:text-[var(--muted)] placeholder:opacity-60',
              'focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-glow)] focus:-translate-y-px',
              error ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--glow-danger)]' : 'border-[var(--border)]',
              iconLeft && 'pl-10',
              iconRight && 'pr-10',
              className,
            )}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
              {iconRight}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-[var(--danger)]">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-[var(--muted)]">{helperText}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
