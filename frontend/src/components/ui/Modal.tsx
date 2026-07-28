import { type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean; onOpenChange?: (open: boolean) => void; onClose?: () => void
  title?: string; description?: string; children: ReactNode
  className?: string; maxWidth?: string
}

export function Modal({ open, onOpenChange, onClose, title, description, children, className, maxWidth = 'max-w-lg' }: ModalProps) {
  const handleClose = () => { onClose?.(); onOpenChange?.(false) }
  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={cn(
                  'fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_15%,var(--border))] bg-[color-mix(in_srgb,var(--surface-strong)_95%,var(--bg2))] p-6 backdrop-blur-xl',
                  'max-h-[85vh] overflow-y-auto',
                  'shadow-hud-lg',
                  maxWidth,
                  className,
                )}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent opacity-40" />

                {(title || description) && (
                  <div className="mb-4">
                    {title && <Dialog.Title className="text-lg font-semibold text-[var(--text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>{title}</Dialog.Title>}
                    {description && <Dialog.Description className="mt-1 text-sm text-[var(--muted)]">{description}</Dialog.Description>}
                  </div>
                )}
                {children}
                <Dialog.Close asChild>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-4 top-4 rounded-lg p-1.5 text-[var(--muted)] transition-colors hover:bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)] hover:text-[var(--accent-cyan)]"
                  >
                    <X size={16} />
                  </motion.button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
