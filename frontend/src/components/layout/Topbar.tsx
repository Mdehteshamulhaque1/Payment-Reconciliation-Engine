import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, Moon, Sun, Monitor, User, Settings, Clock } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'

const themeIcons: Record<string, React.ReactNode> = {
  light: <Sun size={13} />, dark: <Moon size={13} />,
}

export function Topbar() {
  const user = useAuthStore((s) => s.user)
  const { theme, cycleTheme } = useThemeStore()
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

  const formattedTime = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  const formattedDate = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--hairline)] glass-strong">
      <div className="mx-auto flex h-12 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-7 h-7 rounded bg-[var(--primary)] skeuo">
              <span className="text-[11px] font-semibold text-white tracking-tight">P</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-light tracking-tight text-[var(--ink)]">PayFlow</span>
              <span className="text-[9px] text-[var(--ink-mute)] font-normal uppercase tracking-[0.1px]">Reconciliation Engine</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 ml-4 pl-4 border-l border-[var(--hairline)]">
            <div className="flex items-center gap-1.5 rounded-pill px-2 py-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              </span>
              <span className="text-[9px] font-normal text-[var(--success)] uppercase tracking-[0.1px]">Connected</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="hidden xl:flex items-center px-2 py-1">
            <span className="text-[9px] text-[var(--ink-mute)] mr-2 tracking-[0.1px]">{formattedDate}</span>
            <div className="flex items-center gap-1 text-[10px] text-[var(--primary)] tabular-nums">
              <Clock size={10} />
              <motion.span key={formattedTime} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
                {formattedTime}
              </motion.span>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={cycleTheme} className="h-7 w-7 p-0" title={`Theme: ${theme}`}>
            {themeIcons[theme] || <Moon size={13} />}
          </Button>

          <motion.div
            animate={bellAnimating ? { rotate: [0, 14, -12, 8, -6, 3, 0] } : {}}
            transition={{ duration: 0.8 }}
          >
            <Button variant="ghost" size="sm" className="relative h-7 w-7 p-0" onClick={handleBellClick}>
              <Bell size={13} />
              <span className="absolute -top-0.5 -right-0.5 h-3 min-w-[12px] flex items-center justify-center rounded-pill bg-[var(--primary)] px-1 text-[7px] font-normal text-white">3</span>
            </Button>
          </motion.div>

          <Dropdown
            trigger={
              <button className="flex items-center gap-2 rounded-pill px-2 py-1 transition-all hover:bg-[var(--canvas-soft)]">
                <div className="flex h-6 w-6 items-center justify-center rounded text-[10px] font-normal text-white bg-[var(--primary)]">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden lg:block text-xs font-light text-[var(--ink)]">{user?.name || 'User'}</span>
              </button>
            }
          >
            <div className="px-3 py-2 border-b border-[var(--hairline)]">
              <p className="text-sm font-light text-[var(--ink)]">{user?.name || 'User'}</p>
              <p className="text-caption text-[var(--ink-mute)]">{user?.email}</p>
            </div>
            <Dropdown.Item icon={<User size={14} />} onClick={() => window.location.href = '/settings'}>Profile</Dropdown.Item>
            <Dropdown.Item icon={<Settings size={14} />} onClick={() => window.location.href = '/settings'}>Settings</Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </header>
  )
}
