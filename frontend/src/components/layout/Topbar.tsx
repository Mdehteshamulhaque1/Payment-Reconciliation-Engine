import { useState, useEffect, useCallback } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Bell, Moon, Sun, Monitor, Menu, PanelLeftClose, PanelLeft, LogOut, User, Settings, Clock, Wifi, Shield, Code } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useDevStore } from '@/store/devStore'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { AnimatedLogo } from '@/components/ui/AnimatedLogo'

const routeMap: Record<string, { title: string; description: string }> = {
  '/': { title: 'Dashboard', description: 'System overview' },
  '/dashboard': { title: 'Dashboard', description: 'System overview' },
  '/transactions': { title: 'Transactions', description: 'Transaction monitor' },
  '/gateways': { title: 'Gateways', description: 'Gateway health matrix' },
  '/reconciliation': { title: 'Reconciliation', description: 'Record matching engine' },
  '/settlements': { title: 'Settlements', description: 'Settlement tracker' },
  '/ledger': { title: 'Ledger', description: 'Financial journal' },
  '/fraud': { title: 'Fraud Detection', description: 'Threat analysis' },
  '/reports': { title: 'Reports', description: 'Intelligence reports' },
  '/notifications': { title: 'Notifications', description: 'Event log' },
  '/settings': { title: 'Settings', description: 'System configuration' },
}

const themeIcons: Record<string, React.ReactNode> = {
  light: <Sun size={14} />, dim: <Moon size={14} />, dark: <Monitor size={14} />,
}

interface TopbarProps {
  onMenuToggle: () => void; onCollapseToggle: () => void; collapsed: boolean
}

export function Topbar({ onMenuToggle, onCollapseToggle, collapsed }: TopbarProps) {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { theme, cycleTheme } = useThemeStore()
  const { devMode, toggleDevMode, setDevPanelOpen } = useDevStore()
  const [time, setTime] = useState(new Date())
  const [bellAnimating, setBellAnimating] = useState(false)
  // searchFocused tracked inline for animation

  const route = routeMap[location.pathname] || { title: 'PayFlow', description: '' }

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const handleBellClick = useCallback(() => {
    setBellAnimating(true)
    setTimeout(() => setBellAnimating(false), 1000)
    window.location.href = '/notifications'
  }, [])

  const formattedTime = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  const formattedDate = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <header className="sticky top-2 z-20 mx-2 lg:mx-0">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] backdrop-blur-xl px-4 py-2.5 shadow-hud relative overflow-hidden"
      >
        <div className="absolute top-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent opacity-20" />

        <div className="flex items-center gap-3 min-w-0">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onMenuToggle} className="rounded-lg p-2 text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)] hover:text-[var(--accent-cyan)] transition-colors lg:hidden">
            <Menu size={18} />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onCollapseToggle} className="hidden lg:flex rounded-lg p-2 text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)] hover:text-[var(--accent-cyan)] transition-colors">
            {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </motion.button>
          <Link to="/home" className="no-underline flex-shrink-0">
            <AnimatedLogo size="sm" showText={false} animate={false} />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[var(--text)] truncate" style={{ fontFamily: 'Outfit' }}>{route.title}</h2>
              <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-[var(--accent-cyan)] opacity-50" />
              <p className="hidden sm:block text-[10px] text-[var(--muted)] truncate font-mono uppercase tracking-wider">{route.description}</p>
            </div>
          </div>
        </div>

        {/* Search — opens command palette */}
        <motion.div
          animate={{ boxShadow: '0 0 0 rgba(0,0,0,0)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="hidden md:flex items-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-[color-mix(in_srgb,var(--bg3)_50%,transparent)] px-3 py-1.5 min-w-[180px] max-w-[280px] flex-1 mx-4 group cursor-pointer"
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
        >
          <Search size={13} className="text-[var(--muted)] group-hover:text-[var(--accent-cyan)] transition-colors" />
          <input
            placeholder="Search commands..."
            className="flex-1 bg-transparent text-xs font-mono text-[var(--muted)] outline-none placeholder:text-[var(--muted)] pointer-events-none"
            readOnly
          />
          <kbd className="pointer-events-none rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[9px] font-mono font-medium text-[var(--muted)]">⌘K</kbd>
        </motion.div>

        <div className="flex items-center gap-1">
          <div className="hidden lg:flex items-center gap-2 mr-2">
            <div className="flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-mono text-[var(--muted)]">
              <Wifi size={10} className="text-[var(--success)]" /><span>LIVE</span>
            </div>
            <div className="flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-mono text-[var(--muted)]">
              <Shield size={10} className="text-[var(--accent-cyan)]" /><span>TLS</span>
            </div>
          </div>

          {/* Dev Mode toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleDevMode}
            className={`rounded-lg p-2 transition-colors ${devMode ? 'bg-[color-mix(in_srgb,var(--accent-neon)_15%,transparent)] text-[var(--accent-neon)]' : 'text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)] hover:text-[var(--accent-cyan)]'}`}
            title={`Developer Mode: ${devMode ? 'ON' : 'OFF'}`}
          >
            <Code size={14} />
          </motion.button>

          <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))] bg-[color-mix(in_srgb,var(--accent-cyan)_3%,transparent)] px-2.5 py-1 text-[10px] font-mono text-[var(--accent-cyan)]">
            <Clock size={10} />
            <motion.span key={formattedTime} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
              {formattedTime}
            </motion.span>
            <span className="text-[var(--border-strong)]">·</span>
            <span className="text-[var(--muted)]">{formattedDate}</span>
          </div>

          <motion.div whileTap={{ scale: 0.9, rotate: 15 }}>
            <Button variant="ghost" size="sm" onClick={cycleTheme} className="rounded-lg h-8 w-8 p-0" title={`Theme: ${theme}`}>
              {themeIcons[theme]}
            </Button>
          </motion.div>

          <motion.div
            animate={bellAnimating ? { rotate: [0, 14, -12, 8, -6, 3, 0] } : {}}
            transition={{ duration: 0.8 }}
          >
            <Button variant="ghost" size="sm" className="relative rounded-lg h-8 w-8 p-0" onClick={handleBellClick}>
              <Bell size={14} />
              <span className="absolute -top-0.5 -right-0.5 h-3.5 min-w-[14px] flex items-center justify-center rounded-full bg-[var(--accent-cyan)] px-1 text-[7px] font-bold text-[var(--bg1)] animate-badge-pulse" style={{ boxShadow: '0 0 8px rgba(0, 240, 255, 0.4)' }}>3</span>
            </Button>
          </motion.div>

          <Dropdown
            trigger={
              <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all hover:bg-[color-mix(in_srgb,var(--accent-cyan)_5%,transparent)] group">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold text-[var(--bg1)] font-mono" style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--primary))', boxShadow: '0 0 12px rgba(0, 240, 255, 0.2)' }}>
                  {user?.full_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden lg:block text-xs font-medium text-[var(--text)]">{user?.full_name || 'User'}</span>
              </button>
            }
          >
            <div className="px-3 py-2 border-b border-[var(--border)]">
              <p className="text-sm font-medium text-[var(--text)]">{user?.full_name || 'User'}</p>
              <p className="text-[10px] text-[var(--muted)] font-mono">{user?.email}</p>
            </div>
            <Dropdown.Item icon={<User size={14} />} onClick={() => window.location.href = '/settings'}>Profile</Dropdown.Item>
            <Dropdown.Item icon={<Settings size={14} />} onClick={() => window.location.href = '/settings'}>Settings</Dropdown.Item>
            {devMode && <Dropdown.Item icon={<Code size={14} />} onClick={() => setDevPanelOpen(true)}>API Metrics</Dropdown.Item>}
            <Dropdown.Divider />
            <Dropdown.Item icon={<LogOut size={14} />} onClick={logout} danger>Sign out</Dropdown.Item>
          </Dropdown>
        </div>
      </motion.div>
    </header>
  )
}
