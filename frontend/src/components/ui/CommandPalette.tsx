import { useEffect, useCallback, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, LayoutDashboard, ArrowRightLeft, Network, GitCompareArrows, Wallet, BookOpen, ShieldAlert, FileBarChart, Bell, Settings, Moon, Sun, Monitor, Code } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { useDevStore } from '@/store/devStore'

const commands = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/', category: 'Navigation' },
  { id: 'transactions', label: 'Transactions', icon: ArrowRightLeft, path: '/transactions', category: 'Navigation' },
  { id: 'gateways', label: 'Gateways', icon: Network, path: '/gateways', category: 'Navigation' },
  { id: 'reconciliation', label: 'Reconciliation', icon: GitCompareArrows, path: '/reconciliation', category: 'Navigation' },
  { id: 'settlements', label: 'Settlements', icon: Wallet, path: '/settlements', category: 'Navigation' },
  { id: 'ledger', label: 'Ledger', icon: BookOpen, path: '/ledger', category: 'Navigation' },
  { id: 'fraud', label: 'Fraud Detection', icon: ShieldAlert, path: '/fraud', category: 'Navigation' },
  { id: 'reports', label: 'Reports', icon: FileBarChart, path: '/reports', category: 'Navigation' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications', category: 'Navigation' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', category: 'Navigation' },
]

const actions = [
  { id: 'theme-light', label: 'Switch to Light Theme', icon: Sun, category: 'Theme', action: 'theme-light' },
  { id: 'theme-dim', label: 'Switch to Dim Theme', icon: Moon, category: 'Theme', action: 'theme-dim' },
  { id: 'theme-dark', label: 'Switch to Dark Theme', icon: Monitor, category: 'Theme', action: 'theme-dark' },
  { id: 'toggle-dev', label: 'Toggle Developer Mode', icon: Code, category: 'System', action: 'toggle-dev' },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { setTheme } = useThemeStore()
  const toggleDevMode = useDevStore((s) => s.toggleDevMode)

  const allItems = [...commands, ...actions]
  const filtered = query
    ? allItems.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : allItems

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const execute = useCallback(
    (item: (typeof allItems)[0]) => {
      if ('path' in item && item.path) {
        navigate(item.path)
      } else if ('action' in item) {
        if (item.action === 'theme-light') setTheme('light')
        else if (item.action === 'theme-dim') setTheme('dim')
        else if (item.action === 'theme-dark') setTheme('dark')
        else if (item.action === 'toggle-dev') toggleDevMode()
      }
      setOpen(false)
    },
    [navigate, setTheme, toggleDevMode],
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)) }
    else if (e.key === 'Enter' && filtered[selected]) { execute(filtered[selected]) }
    else if (e.key === 'Escape') { setOpen(false) }
  }

  let lastCategory = ''

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-[20%] z-[201] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_15%,var(--border))] bg-[color-mix(in_srgb,var(--surface-strong)_95%,var(--bg2))] backdrop-blur-xl shadow-hud-lg overflow-hidden"
          >
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
              <Search size={16} className="text-[var(--accent-cyan)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(0) }}
                onKeyDown={handleKeyDown}
                placeholder="Type a command..."
                className="flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
              />
              <kbd className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[9px] font-mono text-[var(--muted)]">ESC</kbd>
            </div>

            <div className="max-h-[300px] overflow-auto py-1">
              {filtered.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-[var(--muted)]">No results found</div>
              )}
              {filtered.map((item, i) => {
                const showCategory = item.category !== lastCategory
                if (showCategory) lastCategory = item.category
                const Icon = item.icon
                return (
                  <div key={item.id}>
                    {showCategory && (
                      <div className="px-4 pt-2 pb-1 text-[9px] font-mono uppercase tracking-widest text-[var(--muted)]">{item.category}</div>
                    )}
                    <button
                      onClick={() => execute(item)}
                      onMouseEnter={() => setSelected(i)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        i === selected ? 'bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)] text-[var(--accent-cyan)]' : 'text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_4%,transparent)]'
                      }`}
                    >
                      <Icon size={16} className={i === selected ? 'text-[var(--accent-cyan)]' : 'text-[var(--muted)]'} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {i === selected && <kbd className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[8px] font-mono text-[var(--muted)]">↵</kbd>}
                    </button>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
