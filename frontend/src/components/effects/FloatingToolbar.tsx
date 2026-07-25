import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingToolbarProps {
  className?: string
  visible?: boolean
}

export function FloatingToolbar({ className, visible = true }: FloatingToolbarProps) {
  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn(
        'fixed bottom-6 left-1/2 z-50 -translate-x-1/2',
        'flex items-center gap-1 rounded-2xl border border-border bg-card/90 px-2 py-1.5 shadow-2xl backdrop-blur-xl',
        className
      )}
    >
      <ToolbarButton icon={ArrowUp} tooltip='Scroll up' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
      <ToolbarButton icon={ArrowDown} tooltip='Scroll down' onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} />
      <div className='mx-1 h-4 w-px bg-border' />
      <ToolbarButton
        icon={Maximize2}
        tooltip='Fullscreen'
        onClick={() => {
          if (!document.fullscreenElement) document.documentElement.requestFullscreen()
          else document.exitFullscreen()
        }}
      />
    </motion.div>
  )
}

function ToolbarButton({
  icon: Icon,
  tooltip,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  tooltip: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className='rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
    >
      <Icon size={16} />
    </button>
  )
}
