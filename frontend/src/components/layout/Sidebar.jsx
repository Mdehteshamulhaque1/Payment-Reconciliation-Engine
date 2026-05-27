import { useEffect, useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  RefreshCw,
  BarChart3,
  ShieldAlert,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const COLLAPSE_KEY = 'recon-sidebar-collapsed'

const navigationItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/reconciliation', label: 'Reconciliation', icon: RefreshCw, badge: '18', badgeTone: 'orange' },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/fraud-alerts', label: 'Fraud Alerts', icon: ShieldAlert, badge: '3', badgeTone: 'red' },
  { to: '/monitoring', label: 'Monitoring', icon: Activity },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const roleTone = {
  admin: 'bg-violet-500/15 text-violet-200 border-violet-500/20',
  analyst: 'bg-blue-500/15 text-blue-200 border-blue-500/20',
  viewer: 'bg-slate-500/15 text-slate-200 border-slate-500/20',
}

export default function Sidebar({ open, onClose }) {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem(COLLAPSE_KEY)
    setCollapsed(saved === '1')
  }, [])

  const initials = useMemo(() => {
    const name = user?.name?.trim() || 'User'
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
  }, [user?.name])

  const role = user?.role || 'analyst'
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1)

  const handleToggleCollapse = () => {
    setCollapsed((current) => {
      const next = !current
      localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0')
      return next
    })
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[var(--border)] bg-[var(--bg2)] transition-[width,transform] duration-300 ease-in-out lg:static ${collapsed ? 'w-16' : 'w-60'} ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          width: collapsed ? '64px' : '240px',
        }}
      >
        <div className="relative flex items-start justify-between gap-3 px-3 pb-4 pt-4">
          <div className={`flex min-w-0 items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-[#111110] text-[#E8FF47] ring-1 ring-white/10">
              <span className="text-sm font-bold">R</span>
            </div>

            <div className={`${collapsed ? 'pointer-events-none opacity-0' : 'opacity-100'} sidebar-label min-w-0 transition-opacity duration-200`}>
              <div className="truncate text-sm font-semibold text-[var(--text)]">Recon Studio</div>
              <div className="truncate text-xs text-[var(--muted)]">Payment Engine</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleCollapse}
              className="hidden rounded-xl border border-[var(--border)] bg-[var(--bg3)] p-2 text-[var(--text)] transition hover:bg-white/[0.05] lg:inline-flex"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg3)] p-2 text-[var(--text)] lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className={`px-3 pb-4 ${collapsed ? 'pointer-events-none opacity-0' : 'opacity-100'} sidebar-label transition-opacity duration-200`}>
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg3)] px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">Recon Studio</p>
            <p className="mt-2 text-sm font-semibold text-[var(--text)]">Payment Reconciliation</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Track matching status, review exceptions, and move through your workspace modules.</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const title = collapsed ? item.label : undefined

            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={title}
                onClick={onClose}
                className={({ isActive }) => {
                  const base = 'group relative flex items-center gap-3 rounded-2xl border-l-4 px-3 py-3 text-sm font-medium transition-all duration-200'
                  const active = 'border-l-[#4f46e5] bg-[rgba(79,70,229,0.1)] text-[#4f46e5]'
                  const inactive = 'border-l-transparent text-[var(--muted)] hover:bg-[rgba(79,70,229,0.06)] hover:text-[#4f46e5]'

                  return `${base} ${isActive ? active : inactive} ${collapsed ? 'justify-center px-2' : ''}`
                }}
              >
                <Icon size={18} className="shrink-0" />

                <span className={`${collapsed ? 'pointer-events-none opacity-0' : 'opacity-100'} sidebar-label min-w-0 flex-1 truncate transition-opacity duration-200`}>
                  {item.label}
                </span>

                {item.badge ? (
                  <span
                    className={`${collapsed ? 'absolute right-2 top-2' : ''} rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-none ${
                      item.badgeTone === 'red'
                        ? 'border-red-500/20 bg-red-500/15 text-red-200'
                        : 'border-orange-500/20 bg-orange-500/15 text-orange-200'
                    }`}
                    aria-label={`${item.badge} open items`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-auto border-t border-[var(--border)] p-3">
          <div className={`${collapsed ? 'hidden' : 'block'}`}>
            <div className="flex items-center gap-3 rounded-3xl border border-[var(--border)] bg-[var(--bg3)] px-4 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1A1A2E] text-[#E8FF47] ring-1 ring-indigo-400/20">
                <span className="text-sm font-semibold">{initials}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-[var(--text)]">{user?.name || 'Demo user'}</div>
                <div className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${roleTone[role] || roleTone.analyst}`}>
                  {roleLabel}
                </div>
                <div className="mt-2 truncate text-xs text-[var(--muted)]">{user?.email || 'user@company.com'}</div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className={`mt-3 flex w-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg3)] px-3 py-3 text-sm font-medium text-[var(--text)] transition hover:bg-[rgba(79,70,229,0.06)] hover:text-[#4f46e5] ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={18} className="shrink-0" />
            <span className={`${collapsed ? 'pointer-events-none opacity-0' : 'opacity-100'} sidebar-label min-w-0 transition-opacity duration-200`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {open ? <button type="button" onClick={onClose} className="fixed inset-0 z-30 bg-black/50 lg:hidden" aria-label="Close sidebar" /> : null}
    </>
  )
}
