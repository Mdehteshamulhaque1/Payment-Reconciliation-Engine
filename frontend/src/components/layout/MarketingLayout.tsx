import { Link, useLocation, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { ChatBot } from '@/components/chat/ChatBot'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Features', path: '/#features' },
  { label: 'Docs', path: '/docs' },
  { label: 'API', path: '/api-docs' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-[var(--hairline)]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded bg-[var(--primary)] skeuo">
            <span className="text-[11px] font-semibold text-white tracking-tight">P</span>
          </div>
          <span className="text-[15px] font-light tracking-tight text-[var(--ink)]">PayFlow</span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="px-3 py-1.5 text-body-md text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="brutal" size="sm">
              Dashboard <ArrowRight size={12} className="ml-1" />
            </Button>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded-sm p-2 text-[var(--ink-mute)] hover:bg-[var(--canvas-soft)] transition-colors"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-[var(--hairline)] glass"
        >
          <nav className="flex flex-col p-4 gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-body-md text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  )
}

function PublicFooter() {
  return (
    <footer className="border-t border-[var(--hairline)] skeuo-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-[var(--primary)]">
                <span className="text-[10px] font-semibold text-white">P</span>
              </div>
              <span className="text-sm font-light text-[var(--ink)]">PayFlow</span>
            </div>
            <p className="text-caption text-[var(--ink-mute)] leading-relaxed">
              Modern payment reconciliation platform for fintech teams.
            </p>
          </div>
          <div>
            <h4 className="text-micro-cap text-[var(--ink-mute)] uppercase tracking-[0.1px] mb-3">Product</h4>
            <ul className="space-y-2">
              {[
                { label: 'Features', to: '/#features' },
                { label: 'Docs', to: '/docs' },
                { label: 'API Reference', to: '/api-docs' },
              ].map((item) => (
                <li key={item.label}><Link to={item.to} className="text-caption text-[var(--ink-mute)] hover:text-[var(--primary)] transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-micro-cap text-[var(--ink-mute)] uppercase tracking-[0.1px] mb-3">Company</h4>
            <ul className="space-y-2">
              {[
                { label: 'About', to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map((item) => (
                <li key={item.label}><Link to={item.to} className="text-caption text-[var(--ink-mute)] hover:text-[var(--primary)] transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-micro-cap text-[var(--ink-mute)] uppercase tracking-[0.1px] mb-3">Legal</h4>
            <ul className="space-y-2">
              {['Privacy', 'Terms', 'Cookies', 'Security'].map((item) => (
                <li key={item}><span className="text-caption text-[var(--ink-mute)] hover:text-[var(--primary)] transition-colors cursor-pointer">{item}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-[var(--hairline)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-caption text-[var(--ink-mute)]">&copy; 2026 PayFlow. All rights reserved.</p>
          <span className="text-micro-cap text-[var(--ink-mute)] uppercase tracking-[0.1px]">Built for fintech teams</span>
        </div>
      </div>
    </footer>
  )
}

interface MarketingLayoutProps {
  children?: ReactNode
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      <ChatBot />
      <PublicHeader />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      {!isLandingPage && <PublicFooter />}
    </div>
  )
}
