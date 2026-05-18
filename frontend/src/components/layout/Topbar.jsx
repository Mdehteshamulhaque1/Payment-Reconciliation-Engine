import { useState } from 'react'
import { Menu, Bell, ChevronDown, LogOut, UserCircle2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Topbar({ onMenuToggle }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-100 lg:hidden" aria-label="Toggle sidebar">
            <Menu size={18} />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Fintech dashboard</p>
            <h2 className="text-lg font-semibold text-white">Good to see you, {user?.name || 'User'}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button className="hidden rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 sm:inline-flex">
            <Bell size={18} />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/10"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/20">
                <UserCircle2 size={20} />
              </span>
              <span className="hidden sm:block">
                <span className="block font-medium text-white">{user?.name || 'Demo user'}</span>
                <span className="block text-xs text-slate-400">{user?.email || 'user@company.com'}</span>
              </span>
              <ChevronDown size={16} className={`${menuOpen ? 'rotate-180' : ''} transition-transform`} />
            </button>

            {menuOpen ? (
              <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <Link to="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10">
                  <UserCircle2 size={16} />
                  Profile settings
                </Link>
                <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-rose-300 transition hover:bg-rose-500/10">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}