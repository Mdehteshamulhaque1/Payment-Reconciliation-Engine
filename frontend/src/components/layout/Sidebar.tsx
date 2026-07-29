import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ArrowRightLeft, Network, GitCompareArrows,
  Wallet, BookOpen, ShieldAlert, FileBarChart, Bell, Settings,
  ChevronsLeft, ChevronsRight, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip } from '@/components/ui/Tooltip'
import { AnimatedLogo } from '@/components/ui/AnimatedLogo'

interface NavItem {
  label: string; href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}
interface NavSection { label: string; items: NavItem[] }

const sections: NavSection[] = [
  { label: 'CORE', items: [
    { label: 'Home', href: '/home', icon: LayoutDashboard },
    { label: 'Transactions', href: '/transactions', icon: ArrowRightLeft },
    { label: 'Gateways', href: '/gateways', icon: Network },
  ]},
  { label: 'OPERATIONS', items: [
    { label: 'Reconciliation', href: '/reconciliation', icon: GitCompareArrows },
    { label: 'Settlements', href: '/settlements', icon: Wallet },
    { label: 'Ledger', href: '/ledger', icon: BookOpen },
  ]},
  { label: 'INTEL', items: [
    { label: 'Fraud', href: '/fraud', icon: ShieldAlert },
    { label: 'Reports', href: '/reports', icon: FileBarChart },
  ]},
  { label: 'SYSTEM', items: [
    { label: 'Notifications', href: '/notifications', icon: Bell },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]},
]

interface SidebarProps {
  collapsed: boolean; onCollapseToggle: () => void
  mobileOpen: boolean; onMobileClose: () => void
}

function SidebarContent({ collapsed, onCollapseToggle }: { collapsed: boolean; onCollapseToggle: () => void }) {
  const location = useLocation()

  return (
    <div className="flex h-full flex-col">
      <div className={cn('flex items-center px-4 pt-5 pb-3', collapsed ? 'justify-center px-2' : 'gap-3')}>
        <Link to="/home" className="no-underline">
          <AnimatedLogo size="sm" showText={!collapsed} animate={true} />
        </Link>
      </div>

      <div className="mx-3 mb-3 relative">
        <div className="h-px bg-[var(--border)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent opacity-25" />
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 pb-4">
        {sections.map((section, si) => (
          <div key={section.label}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ delay: si * 0.05 }}
                  className="section-label mb-2 px-3"
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.href
                const Icon = item.icon
                const navButton = (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300',
                      collapsed && 'justify-center px-2',
                      isActive
                        ? 'text-[var(--accent-cyan)] bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)]'
                        : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_5%,transparent)]',
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-full"
                        style={{
                          background: 'linear-gradient(180deg, var(--primary), var(--accent-cyan))',
                          boxShadow: '0 0 10px color-mix(in srgb, var(--primary) 30%, transparent)',
                        }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <motion.div
                      className="shrink-0"
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      <Icon
                        size={17}
                        className={cn(
                          'transition-all duration-300',
                          isActive && 'drop-shadow-[0_0_6px_var(--accent-cyan)]',
                        )}
                      />
                    </motion.div>
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                )
                return collapsed ? (
                  <Tooltip key={item.href} content={item.label} side="right">{navButton}</Tooltip>
                ) : (
                  <div key={item.href}>{navButton}</div>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-3 mb-2 overflow-hidden"
          >
            <div className="rounded-lg border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-[color-mix(in_srgb,var(--accent-cyan)_3%,transparent)] px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                </span>
                <span className="text-[9px] font-mono text-[var(--muted)] uppercase tracking-wider">All Systems Nominal</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-[var(--border)] p-3">
        <motion.button
          onClick={onCollapseToggle}
          whileTap={{ scale: 0.95 }}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--muted)] transition-all hover:bg-[color-mix(in_srgb,var(--accent-cyan)_5%,transparent)] hover:text-[var(--accent-cyan)]"
        >
          {collapsed ? <ChevronsRight size={16} /> : <><ChevronsLeft size={16} /><span className="overflow-hidden whitespace-nowrap font-mono text-xs">Collapse</span></>}
        </motion.button>
      </div>
    </div>
  )
}

export function Sidebar({ collapsed, onCollapseToggle, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden lg:block sticky top-0 z-30 h-screen shrink-0"
      >
        <div className="h-full rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_12%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] backdrop-blur-xl m-2 overflow-hidden shadow-hud relative">
          <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent opacity-30" />
          <SidebarContent collapsed={collapsed} onCollapseToggle={onCollapseToggle} />
        </div>
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={onMobileClose} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed inset-y-0 left-0 z-50 w-[260px] lg:hidden">
              <div className="h-full rounded-r-2xl border-r border-[color-mix(in_srgb,var(--accent-cyan)_15%,var(--border))] bg-[color-mix(in_srgb,var(--surface-strong)_95%,var(--bg2))] shadow-hud-lg">
                <button onClick={onMobileClose} className="absolute right-3 top-4 rounded-lg p-1.5 text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)] hover:text-[var(--accent-cyan)]">
                  <X size={16} />
                </button>
                <SidebarContent collapsed={false} onCollapseToggle={onCollapseToggle} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
