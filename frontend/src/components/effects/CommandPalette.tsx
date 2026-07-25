import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FileText, Settings, Shield, BarChart3, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface CommandItem {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  shortcut?: string
  href?: string
  action?: () => void
}

const defaultItems: CommandItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/', shortcut: 'G D' },
  { id: 'transactions', label: 'Transactions', icon: CreditCard, href: '/transactions', shortcut: 'G T' },
  { id: 'gateways', label: 'Gateways', icon: Shield, href: '/gateways', shortcut: 'G G' },
  { id: 'reconciliation', label: 'Reconciliation', icon: FileText, href: '/reconciliation' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
]

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  items?: CommandItem[]
}

export function CommandPalette({ open, onClose, items = defaultItems }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const handleSelect = useCallback(
    (item: CommandItem) => {
      onClose()
      if (item.action) item.action()
      else if (item.href) navigate(item.href)
    },
    [navigate, onClose]
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (open) onClose()
      }
      if (e.key === 'Escape' && open) onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 bg-black/40 backdrop-blur-sm'
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className='fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl'
          >
            <div className='flex items-center gap-3 border-b border-border px-4 py-3'>
              <Search size={18} className='shrink-0 text-muted-foreground' />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search commands...'
                className='flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground'
              />
              <kbd className='rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground'>
                ESC
              </kbd>
            </div>
            <div className='max-h-72 overflow-y-auto p-2'>
              {filtered.length === 0 ? (
                <div className='py-8 text-center text-sm text-muted-foreground'>
                  No results found
                </div>
              ) : (
                filtered.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className='flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-muted/50'
                  >
                    <item.icon size={16} className='text-muted-foreground' />
                    <span className='flex-1 text-left'>{item.label}</span>
                    {item.shortcut && (
                      <kbd className='rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground'>
                        {item.shortcut}
                      </kbd>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
