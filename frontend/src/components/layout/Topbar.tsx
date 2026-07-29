import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, Moon, Sun, Monitor, Menu, PanelLeftClose, PanelLeft, User, Settings, Clock, Wifi, Shield, Code, BarChart3 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useDevStore } from '@/store/devStore'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'

const themeIcons: Record<string, React.ReactNode> = {
  light: <Sun size={14} />, dim: <Moon size={14} />, dark: <Monitor size={14} />,
}

interface TopbarProps {
  onMenuToggle: () => void; onCollapseToggle: () => void; collapsed: boolean
}

export function Topbar({ onMenuToggle, onCollapseToggle, collapsed }: TopbarProps) {
  const user = useAuthStore((s) => s.user)
  const { theme, cycleTheme } = useThemeStore()
  const { devMode, toggleDevMode, setDevPanelOpen } = useDevStore()
  const [time, setTime] = useState(new Date())
  const [bellAnimating, setBellAnimating] = useState(false)

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
    <header className="sticky top-0 z-50 border-b border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onMenuToggle} className="rounded-lg p-2 text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)] hover:text-[var(--accent-cyan)] transition-colors lg:hidden">
            <Menu size={18} />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onCollapseToggle} className="hidden lg:flex rounded-lg p-2 text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)] hover:text-[var(--accent-cyan)] transition-colors">
            {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </motion.button>
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent-cyan)]" style={{ boxShadow: '0 0 12px color-mix(in srgb, var(--primary) 20%, transparent)' }}>
              <BarChart3 size={16} className="text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight text-[var(--text)]" style={{ fontFamily: 'Outfit' }}>PayFlow</span>
              <span className="text-[9px] font-mono text-[var(--muted)] uppercase tracking-wider">Reconciliation Engine</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 ml-4 pl-4 border-l border-[var(--border)]">
            <div className="flex items-center gap-1.5 rounded-md bg-[color-mix(in_srgb,var(--success)_8%,transparent)] px-2 py-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              </span>
              <span className="text-[9px] font-mono font-semibold text-[var(--success)] uppercase tracking-wider">Connected</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden xl:flex items-center rounded-lg border border-[color-mix(in_srgb,var(--primary)_8%,var(--border))] bg-[color-mix(in_srgb,var(--primary)_3%,transparent)] px-2.5 py-1">
            <span className="text-[9px] font-mono text-[var(--muted)] mr-2">{formattedDate}</span>
            <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--primary)]">
              <Clock size={10} />
              <motion.span key={formattedTime} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
                {formattedTime}
              </motion.span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1 mr-1">
            <div className="flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-mono text-[var(--muted)]">
              <Wifi size={10} className="text-[var(--success)]" /><span>LIVE</span>
            </div>
            <div className="flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-mono text-[var(--muted)]">
              <Shield size={10} className="text-[var(--accent-cyan)]" /><span>TLS</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleDevMode}
            className={`rounded-lg p-2 transition-colors ${devMode ? 'bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-[var(--primary)]' : 'text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] hover:text-[var(--primary)]'}`}
            title={`Developer Mode: ${devMode ? 'ON' : 'OFF'}`}
          >
            <Code size={14} />
          </motion.button>

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
              <span className="absolute -top-0.5 -right-0.5 h-3.5 min-w-[14px] flex items-center justify-center rounded-full bg-[var(--primary)] px-1 text-[7px] font-bold text-white" style={{ boxShadow: '0 0 8px color-mix(in srgb, var(--primary) 30%, transparent)' }}>3</span>
            </Button>
          </motion.div>

          <Dropdown
            trigger={
              <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all hover:bg-[color-mix(in_srgb,var(--accent-cyan)_5%,transparent)] group">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold text-white font-mono" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))', boxShadow: '0 0 12px color-mix(in srgb, var(--primary) 20%, transparent)' }}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden lg:block text-xs font-medium text-[var(--text)]">{user?.name || 'User'}</span>
              </button>
            }
          >
            <div className="px-3 py-2 border-b border-[var(--border)]">
              <p className="text-sm font-medium text-[var(--text)]">{user?.name || 'User'}</p>
              <p className="text-[10px] text-[var(--muted)] font-mono">{user?.email}</p>
            </div>
            <Dropdown.Item icon={<User size={14} />} onClick={() => window.location.href = '/settings'}>Profile</Dropdown.Item>
            <Dropdown.Item icon={<Settings size={14} />} onClick={() => window.location.href = '/settings'}>Settings</Dropdown.Item>
            {devMode && <Dropdown.Item icon={<Code size={14} />} onClick={() => setDevPanelOpen(true)}>API Metrics</Dropdown.Item>}
            <Dropdown.Divider />
            <Dropdown.Item icon={<User size={14} />} onClick={() => {}}>Signed in as {user.name}</Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </header>
  )
}
