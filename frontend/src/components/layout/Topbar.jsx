import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, Bell, ChevronDown, LogOut, UserCircle2, Search, SunMedium, Lightbulb, MoonStar } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const THEME_KEY = 'recon-theme'
const CURRENCY_KEY = 'recon-currency'
const THEMES = ['light', 'dim', 'dark']

export default function Topbar({ onMenuToggle }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState('light')
  const [currency, setCurrency] = useState('INR')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const greeting = useMemo(() => {
    const hour = new Date().getHours()

    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const firstName = useMemo(() => {
    const fullName = user?.name?.trim() || 'User'
    return fullName.split(/\s+/)[0]
  }, [user?.name])

  const initials = useMemo(() => {
    const fullName = user?.name?.trim() || 'U'
    return fullName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
  }, [user?.name])

  const applyTheme = useCallback((nextTheme) => {
    const root = document.documentElement
    root.classList.remove('dark', 'dim')

    if (nextTheme === 'dark' || nextTheme === 'dim') {
      root.classList.add(nextTheme)
    }

    localStorage.setItem(THEME_KEY, nextTheme)
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY)
    const savedCurrency = localStorage.getItem(CURRENCY_KEY)

    if (savedTheme && THEMES.includes(savedTheme)) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      applyTheme('light')
    }

    if (savedCurrency === 'USD' || savedCurrency === 'INR') {
      setCurrency(savedCurrency)
    }
  }, [applyTheme])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [applyTheme, theme])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/login', { replace: true })
  }

  const handleSearch = () => {
    window.alert('Search modal coming soon')
  }

  const cycleTheme = () => {
    setTheme((current) => {
      const currentIndex = THEMES.indexOf(current)
      return THEMES[(currentIndex + 1) % THEMES.length]
    })
  }

  const toggleCurrency = (nextCurrency) => {
    setCurrency(nextCurrency)
    localStorage.setItem(CURRENCY_KEY, nextCurrency)
  }

  return (
    <header
      className="sticky top-0 z-50 border-b transition-all duration-300 ease-out"
      style={{
        backgroundColor: scrolled ? 'rgba(17, 17, 16, 0.85)' : 'var(--bg2)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottomColor: 'var(--border)',
      }}
    >
      <div className="flex min-h-[88px] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button onClick={onMenuToggle} className="rounded-2xl border border-[var(--border)] bg-[var(--bg3)] p-2.5 text-[var(--text)] lg:hidden" aria-label="Toggle sidebar">
          <Menu size={18} />
        </button>

        <div className="hidden min-w-0 flex-1 lg:flex">
          <div className="flex w-full items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111110] text-[#E8FF47] ring-1 ring-black/20">
                <span className="text-sm font-bold">R</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--text)]">Recon Studio</div>
                <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <span>{greeting}, {firstName}</span>
                  <span className="h-1 w-1 rounded-full bg-[var(--border)]" aria-hidden="true" />
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    Live
                  </span>
                </div>
              </div>
            </div>

            <span className="h-8 w-px bg-[var(--border)]" aria-hidden="true" />

            <button
              type="button"
              onClick={handleSearch}
              className="flex w-full max-w-[560px] items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition hover:shadow-[0_0_0_4px_rgba(79,70,229,0.08)]"
              style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}
            >
              <span className="flex items-center gap-3 text-sm text-[var(--muted)]">
                <Search size={16} />
                <span>Search transactions, merchants... /</span>
              </span>
              <kbd className="rounded-lg border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-2.5 py-1 text-[11px] font-semibold tracking-[0.2em] text-[var(--muted)]">
                CMD K
              </kbd>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden rounded-full border border-[var(--border)] bg-[var(--bg3)] p-1 text-xs font-medium text-[var(--text)] sm:flex">
            <button
              type="button"
              onClick={() => toggleCurrency('INR')}
              className={`rounded-full px-3 py-2 transition ${currency === 'INR' ? 'bg-[#1A1A2E] text-[#E8FF47]' : 'text-[var(--muted)]'}`}
            >
              ₹ INR
            </button>
            <button
              type="button"
              onClick={() => toggleCurrency('USD')}
              className={`rounded-full px-3 py-2 transition ${currency === 'USD' ? 'bg-[#1A1A2E] text-[#E8FF47]' : 'text-[var(--muted)]'}`}
            >
              $ USD
            </button>
          </div>

          <button
            type="button"
            onClick={cycleTheme}
            className="hidden items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition hover:shadow-[0_0_0_4px_rgba(79,70,229,0.08)] sm:inline-flex"
            style={{ background: 'var(--bg3)', borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            {theme === 'light' && <SunMedium size={16} className="text-amber-300" />}
            {theme === 'dim' && <Lightbulb size={16} className="text-sky-300" />}
            {theme === 'dark' && <MoonStar size={16} className="text-indigo-300" />}
            <span>{theme === 'light' ? 'Light' : theme === 'dim' ? 'Dim' : 'Dark'}</span>
          </button>

          <button type="button" className="relative hidden rounded-2xl border border-[var(--border)] bg-[var(--bg3)] p-2.5 text-[var(--text)] transition hover:shadow-[0_0_0_4px_rgba(79,70,229,0.08)] sm:inline-flex" aria-label="Notifications">
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[var(--bg3)]" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg3)] px-3 py-2 text-left text-sm text-[var(--text)] transition hover:shadow-[0_0_0_4px_rgba(79,70,229,0.08)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A2E] text-[#E8FF47] ring-1 ring-indigo-400/20">
                {initials}
              </span>
              <span className="hidden sm:block">
                <span className="block font-medium text-[var(--text)]">{user?.name || 'Demo user'}</span>
                <span className="block text-xs text-[var(--muted)]">{user?.role || 'analyst'} · {user?.email || 'user@company.com'}</span>
              </span>
              <ChevronDown size={16} className={`${menuOpen ? 'rotate-180' : ''} transition-transform`} />
            </button>

            {menuOpen ? (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border p-2 shadow-2xl shadow-black/30 backdrop-blur-2xl"
                style={{ background: 'rgba(10, 10, 8, 0.96)', borderColor: 'var(--border)' }}
              >
                <div className="px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Signed in as</div>
                  <div className="mt-1 text-sm font-semibold" style={{ color: 'var(--text)' }}>{user?.name || 'Demo user'}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{user?.email || 'user@company.com'}</div>
                </div>
                <Link to="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition hover:bg-white/5" style={{ color: 'var(--text)' }}>
                  <UserCircle2 size={16} />
                  Profile settings
                </Link>
                <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-rose-300 transition hover:bg-rose-500/10">
                  <LogOut size={16} />
                  Logout
                </button>
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
