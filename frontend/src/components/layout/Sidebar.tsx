import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, ArrowRightLeft, Network, GitCompareArrows,
  Wallet, BookOpen, ShieldAlert, FileBarChart, Bell, Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string; href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}
interface NavSection { label: string; items: NavItem[] }

const sections: NavSection[] = [
  { label: 'CORE', items: [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SidebarProps {
}

export function Sidebar(_props: SidebarProps) {
  const location = useLocation()

  return (
    <nav className="sticky top-16 z-40 flex items-center gap-1 overflow-x-auto border-b px-4 py-2 scrollbar-none"
      style={{
        borderColor: 'color-mix(in srgb, var(--accent-cyan) 8%, var(--border))',
        background: 'color-mix(in srgb, var(--surface) 85%, transparent)',
        backdropFilter: 'blur(12px)',
      }}>
      {sections.map((section) =>
        section.items.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                'group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 shrink-0',
                isActive
                  ? 'text-[var(--accent-cyan)] bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_5%,transparent)]',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--accent-cyan) 20%, transparent)',
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <motion.div
                className="shrink-0"
                whileHover={{ scale: 1.15 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <Icon
                  size={16}
                  className={cn(
                    'transition-all duration-300',
                    isActive && 'drop-shadow-[0_0_6px_var(--accent-cyan)]',
                  )}
                />
              </motion.div>
              <span>{item.label}</span>
            </NavLink>
          )
        }),
      )}
    </nav>
  )
}
