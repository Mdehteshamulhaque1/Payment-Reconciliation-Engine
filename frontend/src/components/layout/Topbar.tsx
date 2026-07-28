import { useState, useEffect, useCallback } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Bell, Moon, Sun, Monitor, Menu, PanelLeftClose, PanelLeft, LogOut, User, Settings, Clock, Wifi, Shield, Code, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useDevStore } from '@/store/devStore'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { AnimatedLogo } from '@/components/ui/AnimatedLogo'

const navLinks = [
  { label: 'Home', path: '/home' },
  { label: 'Features', path: '/home#features' },
  { label: 'Docs', path: '/docs' },
  { label: 'API', path: '/api-docs' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

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
          <Link to="/home" className="flex items-center gap-2">
            <AnimatedLogo size="sm" showText={false} animate={false} />
            <span className="text-lg font-bold tracking-tight text-[var(--text)] hidden sm:inline" style={{ fontFamily: 'Outfit' }}>PayFlow</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-[#1e40af] hover:bg-[#1e40af]/10"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1 mr-1">
            <div className="flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-mono text-[var(--muted)]">
              <Wifi size={10} className="text-[var(--success)]" /><span>LIVE</span>
            </div>
            <div className="flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-mono text-[var(--muted)]">
              <Shield size={10} className="text-[var(--accent-cyan)]" /><span>TLS</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-[color-mix(in_srgb,var(--primary)_8%,var(--border))] bg-[color-mix(in_srgb,var(--primary)_3%,transparent)] px-2.5 py-1 text-[10px] font-mono text-[var(--primary)]">
            <Clock size={10} />
            <motion.span key={formattedTime} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
              {formattedTime}
            </motion.span>
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
      </div>
    </header>
  )
}
