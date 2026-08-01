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

export function Sidebar() {
  const location = useLocation()

  return (
    <nav className="sticky top-12 z-40 flex items-center gap-0.5 overflow-x-auto border-b border-[var(--hairline)] glass-strong px-4 py-1.5 scrollbar-none">
      {sections.map((section) =>
        section.items.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                'group relative flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-body-md whitespace-nowrap transition-all duration-200 shrink-0',
                isActive
                  ? 'text-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_8%,transparent)]'
                  : 'text-[var(--ink-mute)] hover:text-[var(--ink)] hover:bg-[color-mix(in_srgb,var(--primary)_4%,transparent)]',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-pill"
                  style={{
                    boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--primary) 20%, transparent)',
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon size={15} className="shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          )
        }),
      )}
    </nav>
  )
}
