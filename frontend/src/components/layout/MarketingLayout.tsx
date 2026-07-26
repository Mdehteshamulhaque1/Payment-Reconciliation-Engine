import { Link, useLocation, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { AnimatedLogo } from '@/components/ui/AnimatedLogo'
import { Button } from '@/components/ui/Button'

const navLinks = [
  { label: 'Home', path: '/home', color: '#5B5CEB' },
  { label: 'Features', path: '/home#features', color: '#06B6D4' },
  { label: 'Pricing', path: '/pricing', color: '#22C55E' },
  { label: 'Docs', path: '/docs', color: '#F59E0B' },
  { label: 'API', path: '/api-docs', color: '#EF4444' },
  { label: 'About', path: '/about', color: '#A855F7' },
  { label: 'Contact', path: '/contact', color: '#EC4899' },
]

function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <header className="sticky top-0 z-50 border-b border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/home" className="flex items-center gap-2">
          <AnimatedLogo size="sm" showText={false} animate={false} />
          <span className="text-lg font-bold tracking-tight text-[var(--text)]" style={{ fontFamily: 'Outfit' }}>PayFlow</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            return (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ color: link.color }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${link.color}18`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = ''
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/">
              <Button variant="primary" size="sm">Dashboard <ChevronRight size={14} className="ml-1" /></Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Get Started <ChevronRight size={14} className="ml-1" /></Button>
              </Link>
            </>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded-lg p-2 text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)] hover:text-[var(--accent-cyan)] transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_95%,var(--bg2))] backdrop-blur-xl"
        >
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ color: link.color }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${link.color}10`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = ''
                }}
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
    <footer className="border-t border-[color-mix(in_srgb,var(--accent-cyan)_8%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_80%,transparent)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AnimatedLogo size="sm" showText={false} animate={false} />
              <span className="text-lg font-bold text-[var(--text)]" style={{ fontFamily: 'Outfit' }}>PayFlow</span>
            </div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Modern payment reconciliation platform for fintech teams.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)] mb-3">Product</h4>
            <ul className="space-y-2">
              {[
                { label: 'Features', to: '/home#features' },
                { label: 'Pricing', to: '/pricing' },
                { label: 'Docs', to: '/docs' },
                { label: 'API Reference', to: '/api-docs' },
              ].map((item) => (
                <li key={item.label}><Link to={item.to} className="text-sm text-[var(--muted)] hover:text-[var(--accent-cyan)] transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)] mb-3">Company</h4>
            <ul className="space-y-2">
              {[
                { label: 'About', to: '/about' },
                { label: 'Contact', to: '/contact' },
                { label: 'Blog', to: '/about' },
                { label: 'Careers', to: '/about' },
              ].map((item) => (
                <li key={item.label}><Link to={item.to} className="text-sm text-[var(--muted)] hover:text-[var(--accent-cyan)] transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)] mb-3">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'].map((item) => (
                <li key={item}><span className="text-sm text-[var(--muted)] hover:text-[var(--accent-cyan)] transition-colors cursor-pointer">{item}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--muted)] font-mono">&copy; 2026 PayFlow. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider">Built for fintech teams</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function MarketingLayout() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/home'

  return (
    <div className="min-h-screen bg-[var(--bg1)] flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isLandingPage && <PublicFooter />}
    </div>
  )
}
