import { useState, useRef, useCallback, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { PanelLeftClose, PanelLeft } from 'lucide-react'

interface SplitViewProps {
  left: ReactNode
  right: ReactNode
  defaultRatio?: number
}

export function SplitView({ left, right, defaultRatio = 55 }: SplitViewProps) {
  const [ratio, setRatio] = useState(defaultRatio)
  const [collapsed, setCollapsed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    dragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct = ((e.clientX - rect.left) / rect.width) * 100
      setRatio(Math.max(25, Math.min(75, pct)))
    }

    const handleMouseUp = () => {
      dragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [])

  return (
    <div ref={containerRef} className="flex h-full min-h-0 relative">
      {/* Left panel */}
      <motion.div
        animate={{ width: collapsed ? '48px' : `${ratio}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="overflow-auto shrink-0 relative"
      >
        <div className="absolute top-2 right-2 z-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)] hover:text-[var(--accent-cyan)] transition-colors"
          >
            {collapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={14} />}
          </motion.button>
        </div>
        {!collapsed && left}
      </motion.div>

      {/* Divider */}
      {!collapsed && (
        <div
          onMouseDown={handleMouseDown}
          className="w-1 shrink-0 cursor-col-resize hover:bg-[var(--accent-cyan)] transition-colors relative group"
        >
          <div className="absolute inset-y-0 -left-1 -right-1 z-10" />
        </div>
      )}

      {/* Right panel */}
      <motion.div
        animate={{ width: collapsed ? 'calc(100% - 48px)' : `${100 - ratio}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="overflow-auto shrink-0"
      >
        {right}
      </motion.div>
    </div>
  )
}
