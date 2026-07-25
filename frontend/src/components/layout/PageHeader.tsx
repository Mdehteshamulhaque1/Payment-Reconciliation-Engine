import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  breadcrumb?: BreadcrumbItem[]
  className?: string
}

export function PageHeader({ title, description, actions, breadcrumb, className }: PageHeaderProps) {
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={cn('mb-6', className)}>
      {breadcrumb && breadcrumb.length > 0 && (
        <div className="mb-2 flex items-center gap-1.5 text-[10px] text-[var(--muted)] font-mono uppercase tracking-wider">
          {breadcrumb.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={10} className="text-[var(--accent-cyan)] opacity-40" />}
              {item.href ? (
                <Link to={item.href} className="hover:text-[var(--accent-cyan)] transition-colors">{item.label}</Link>
              ) : (
                <span className="text-[var(--text-secondary)] font-medium">{item.label}</span>
              )}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {title}
          </h1>
          {description && <p className="mt-1 text-sm text-[var(--muted)] font-mono">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </motion.div>
  )
}
