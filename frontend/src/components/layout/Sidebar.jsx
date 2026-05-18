import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Repeat2, LineChart, FileText, Settings, X } from 'lucide-react'

const navigationItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: Repeat2 },
  { to: '/reconciliation', label: 'Reconciliation', icon: LineChart },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-slate-950/95 px-4 py-5 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="mb-8 flex items-center justify-between lg:hidden">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Menu</span>
          <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 lg:hidden">
            <X size={18} />
          </button>
        </div>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Payment Reconciliation</p>
          <h1 className="mt-3 text-xl font-semibold text-white">Engine Control</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">Track matching status, review exceptions, and move between workspace modules.</p>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-5 text-sm text-slate-200">
          <p className="font-semibold text-white">Demo access</p>
          <p className="mt-2 leading-6 text-slate-300">The auth layer is frontend-only and stores a fake token in localStorage for navigation testing.</p>
        </div>
      </aside>

      {open ? <button type="button" onClick={onClose} className="fixed inset-0 z-30 bg-black/50 lg:hidden" aria-label="Close sidebar" /> : null}
    </>
  )
}