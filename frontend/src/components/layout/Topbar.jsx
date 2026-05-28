import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Menu, Bell, ChevronDown, Settings, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const THEME_KEY = 'recon-theme'
const CURRENCY_KEY = 'recon-currency'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const themes = [
  { key: 'light', label: 'Light', emoji: '☀️' },
  { key: 'dim', label: 'Dim', emoji: '💡' },
  { key: 'dark', label: 'Dark', emoji: '🌙' },
]

function applyTheme(theme) {
  const html = document.documentElement
  html.classList.remove('dark', 'dim')
  if (theme === 'dark') html.classList.add('dark')
  if (theme === 'dim') html.classList.add('dim')
}

export default function Topbar({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const firstName = useMemo(() => (user?.name || 'User').split(' ')[0], [user])

  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light')
  const [currency, setCurrency] = useState(() => localStorage.getItem(CURRENCY_KEY) || 'INR')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, currency)
  }, [currency])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const onKeyDown = (event) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const mod = isMac ? event.metaKey : event.ctrlKey
      if (mod && (event.key === 'k' || event.key === 'K')) {
        event.preventDefault()
        alert('Search modal not implemented yet')
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    const onDocClick = (event) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [menuOpen])

  function cycleTheme() {
    const idx = themes.findIndex((t) => t.key === theme)
    setTheme(themes[(idx + 1) % themes.length].key)
  }

  function doLogout() {
    logout()
    navigate('/login')
  }

  const activeTheme = themes.find((t) => t.key === theme) || themes[0]
  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border)] transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'color-mix(in srgb, var(--bg2) 85%, transparent)' : 'var(--bg2)',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
      }}
    >
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button className="rounded p-2 lg:hidden hover:bg-white/5" onClick={onMenuToggle} aria-label="Open menu">
            <Menu size={18} />
          </button>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="grid h-8 w-8 place-items-center rounded bg-[#050504] text-sm font-bold text-[#E8FF47]">R</div>
            <div className="text-sm font-medium text-[var(--muted)]">Recon Studio</div>
            <div className="h-5 w-px bg-[var(--border)]" />
          </div>

          <div className="truncate text-sm text-[var(--muted)]">{getGreeting()}, {firstName}</div>
          <div className="inline-flex items-center gap-2 text-xs">
            <span className="live-dot" />
            <span className="text-emerald-400">Live</span>
          </div>
        </div>

        <button
          onClick={() => alert('Search modal not implemented yet')}
          className="hidden w-full max-w-xl items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg3)] px-4 py-2 text-sm text-[var(--muted)] md:flex"
        >
          <span>Search transactions, merchants... /</span>
          <kbd className="ml-auto rounded bg-black/10 px-2 py-0.5 text-[11px]">CMD K</kbd>
        </button>

        <div className="flex items-center gap-3">
          <div className="rounded-full border border-[var(--border)] bg-[var(--bg3)] p-1 text-sm">
            <button onClick={() => setCurrency('INR')} className={`rounded-full px-3 py-1 ${currency === 'INR' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted)]'}`}>₹ INR</button>
            <button onClick={() => setCurrency('USD')} className={`rounded-full px-3 py-1 ${currency === 'USD' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted)]'}`}>$ USD</button>
          </div>

          <button onClick={cycleTheme} className="rounded-xl border border-[var(--border)] bg-[var(--bg3)] px-3 py-1 text-sm" title="Toggle theme">
            {activeTheme.emoji} {activeTheme.label}
          </button>

          <button className="relative rounded p-2 hover:bg-white/5" aria-label="Notifications">
            <Bell size={18} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />
          </button>

          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen((s) => !s)} className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-white/5">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--surface-strong)] text-xs font-bold">{initials}</div>
              <span className="hidden text-sm sm:block">{user?.name || 'User'}</span>
              <ChevronDown size={14} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 z-20 mt-2 w-44 rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] p-2 shadow-lg">
                <Link to="/settings" className="flex items-center gap-2 rounded px-2 py-2 text-sm hover:bg-white/5"><Settings size={14} /> Settings</Link>
                <button onClick={doLogout} className="mt-1 flex w-full items-center gap-2 rounded px-2 py-2 text-sm hover:bg-white/5"><LogOut size={14} /> Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
