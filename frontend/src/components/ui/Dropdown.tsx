import { type ReactNode, createContext, useContext, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DropdownContextType {
  open: boolean; setOpen: (open: boolean) => void
}
const DropdownContext = createContext<DropdownContextType>({ open: false, setOpen: () => {} })

interface DropdownProps {
  trigger: ReactNode; children: ReactNode; align?: 'left' | 'right'; className?: string
}

function DropdownMenu({ trigger, children, align = 'right', className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative">
        <motion.div
          onClick={() => setOpen((o) => !o)}
          whileTap={{ scale: 0.97 }}
          className="cursor-pointer"
        >
          {trigger}
        </motion.div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={cn(
                'absolute z-50 mt-1 min-w-[180px] overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--accent-cyan)_15%,var(--border))] bg-[color-mix(in_srgb,var(--surface-strong)_95%,var(--bg2))] backdrop-blur-xl py-1',
                'shadow-hud-lg',
                align === 'right' ? 'right-0' : 'left-0',
                className,
              )}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DropdownContext.Provider>
  )
}

interface DropdownItemProps {
  children: ReactNode; icon?: ReactNode; onClick?: () => void; danger?: boolean; className?: string
}

function DropdownItem({ children, icon, onClick, danger, className }: DropdownItemProps) {
  const { setOpen } = useContext(DropdownContext)
  return (
    <motion.button
      onClick={() => { onClick?.(); setOpen(false) }}
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors',
        danger
          ? 'text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_8%,transparent)]'
          : 'text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_5%,transparent)]',
        className,
      )}
    >
      {icon && <span className="shrink-0 text-[var(--muted)]">{icon}</span>}
      {children}
    </motion.button>
  )
}

function DropdownDivider() {
  return <div className="my-1 h-px bg-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))]" />
}

export const Dropdown = Object.assign(DropdownMenu, { Item: DropdownItem, Divider: DropdownDivider })
