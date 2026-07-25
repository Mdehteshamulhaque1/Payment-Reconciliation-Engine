import { type ReactNode, createContext, useContext } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TabsContextType {
  active: string
  setActive: (value: string) => void
}

const TabsContext = createContext<TabsContextType>({ active: '', setActive: () => {} })

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
  className?: string
}

function TabsRoot({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ active: value, setActive: onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: ReactNode
  className?: string
}

function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={cn('inline-flex gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg3)] p-1', className)}>
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: ReactNode
  count?: number
  className?: string
}

function TabsTrigger({ value, children, count, className }: TabsTriggerProps) {
  const { active, setActive } = useContext(TabsContext)
  const isActive = active === value
  return (
    <button
      onClick={() => setActive(value)}
      className={cn(
        'relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
        isActive ? 'text-[var(--primary)]' : 'text-[var(--muted)] hover:text-[var(--text)]',
        className,
      )}
    >
      {isActive && (
        <motion.div
          layoutId="tabs-indicator"
          className="absolute inset-0 rounded-lg bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]"
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      )}
      <span className="relative z-10">{children}</span>
      {count !== undefined && (
        <span className="relative z-10 rounded-full bg-[var(--bg3)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--muted)]">{count}</span>
      )}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

function TabsContent({ value, children, className }: TabsContentProps) {
  const { active } = useContext(TabsContext)
  if (active !== value) return null
  return <div className={cn('mt-4', className)}>{children}</div>
}

export const Tabs = Object.assign(TabsRoot, { List: TabsList, Trigger: TabsTrigger, Content: TabsContent })
