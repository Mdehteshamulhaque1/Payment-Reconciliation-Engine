import React, { useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  RefreshCw,
  BarChart3,
  ShieldAlert,
  Activity,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const COLLAPSE_KEY = 'recon-sidebar-collapsed'

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === '1')

  const items = useMemo(
    () => [
      { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
      { to: '/transactions', label: 'Transactions', Icon: ArrowLeftRight },
      { to: '/reconciliation', label: 'Reconciliation', Icon: RefreshCw, badge: { text: '18', tone: 'amber' } },
      { to: '/fraud-alerts', label: 'Fraud Alerts', Icon: ShieldAlert, badge: { text: '3', tone: 'rose' } },
      { to: '/monitoring', label: 'Monitoring', Icon: Activity },
      { to: '/reports', label: 'Reports', Icon: BarChart3 },
      { to: '/settings', label: 'Settings', Icon: Settings },
    ],
    [],
  )

  function doLogout() {
    logout()
    navigate('/login')
  }

  function toggleCollapse() {
    setCollapsed((s) => {
      const next = !s
      localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0')
      return next
    })
  }

  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

  return (
    <>
      {open && <button className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} aria-label="Close sidebar" />}

      <aside
        className={`fixed z-40 h-screen border-r border-[var(--border)] bg-[var(--surface)] transition-all duration-300 lg:static ${open ? 'left-0' : '-left-64 lg:left-0'}`}
        style={{ width: collapsed ? 64 : 240, transition: 'width 0.3s ease' }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="grid h-10 w-10 place-items-center rounded bg-[#050504] text-[#E8FF47] font-bold">R</div>
              {!collapsed && (
                <div>
                  <div className="text-sm font-semibold">Recon Studio</div>
                  <div className="text-xs text-[var(--muted)]">Payment Engine</div>
                </div>
              )}
            </div>
            <button className="rounded p-1 hover:bg-white/5" onClick={toggleCollapse} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
            <button className="rounded p-1 hover:bg-white/5 lg:hidden" onClick={onClose}>
              <X size={14} />
            </button>
          </div>

          <nav className="mt-2 flex-1 space-y-1 px-2">
            {items.map(({ to, label, Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                title={collapsed ? label : undefined}
                className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${isActive ? 'border-l-[3px] border-l-[#4f46e5] bg-[rgba(79,70,229,0.1)] text-[#4f46e5]' : 'text-[var(--muted)] hover:bg-[rgba(79,70,229,0.06)] hover:text-[#4f46e5]'}`}
              >
                <Icon size={16} />
                {!collapsed && <span>{label}</span>}
                {!collapsed && badge && (
                  <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold ${badge.tone === 'rose' ? 'bg-rose-500 text-white' : 'bg-amber-400 text-black'}`}>
                    {badge.text}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-[var(--border)] p-3">
            {!collapsed && (
              <div className="mb-3 flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white">{initials}</div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{user?.name || 'User'}</div>
                  <div className="truncate text-xs text-[var(--muted)]">{user?.email || ''}</div>
                </div>
              </div>
            )}
            <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-white/5" onClick={doLogout}>
              <LogOut size={16} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
