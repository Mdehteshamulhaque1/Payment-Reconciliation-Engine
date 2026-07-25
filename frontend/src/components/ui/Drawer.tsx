import { type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DrawerProps {
  open: boolean; onOpenChange: (open: boolean) => void
  title?: string; children: ReactNode; className?: string; side?: 'right' | 'left'
}

export function Drawer({ open, onOpenChange, title, children, className, side = 'right' }: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ x: side === 'right' ? '100%' : '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: side === 'right' ? '100%' : '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={cn(
                  'fixed inset-y-0 z-[101] flex w-[min(420px,90vw)] flex-col bg-[color-mix(in_srgb,var(--surface-strong)_95%,var(--bg2))] backdrop-blur-xl shadow-hud-lg',
                  side === 'right' ? 'right-0 border-l border-[color-mix(in_srgb,var(--accent-cyan)_12%,var(--border))]' : 'left-0 border-r border-[color-mix(in_srgb,var(--accent-cyan)_12%,var(--border))]',
                  className,
                )}
              >
                {title && (
                  <div className="flex items-center justify-between border-b border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] px-6 py-4">
                    <Dialog.Title className="text-base font-semibold text-[var(--text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>{title}</Dialog.Title>
                    <Dialog.Close asChild>
                      <motion.button whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }} className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)] hover:text-[var(--accent-cyan)]">
                        <X size={16} />
                      </motion.button>
                    </Dialog.Close>
                  </div>
                )}
                <div className="flex-1 overflow-y-auto p-6">{children}</div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
