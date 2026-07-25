import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { FilterTab } from '@/types'

interface FilterTabsProps {
  tabs: FilterTab[]
  active: string
  onChange: (key: string) => void
  className?: string
}

export function FilterTabs({ tabs, active, onChange, className }: FilterTabsProps) {
  return (
    <div className={cn('flex gap-1 rounded-xl bg-muted/50 p-1', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            'relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            active === tab.key
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground/80'
          )}
        >
          {active === tab.key && (
            <motion.div
              layoutId='activeFilterTab'
              className='absolute inset-0 rounded-lg bg-card shadow-sm'
              transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
            />
          )}
          <span className='relative z-10'>{tab.label}</span>
          {tab.count !== undefined && (
            <span
              className={cn(
                'relative z-10 rounded-md px-1.5 py-0.5 text-xs',
                active === tab.key
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
