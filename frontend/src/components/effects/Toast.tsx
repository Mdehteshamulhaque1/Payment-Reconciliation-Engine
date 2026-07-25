import { Toaster, toast } from 'react-hot-toast'
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
} as const

const bgMap = {
  success: 'border-success/30 bg-success/5',
  error: 'border-danger/30 bg-danger/5',
  warning: 'border-warning/30 bg-warning/5',
  info: 'border-info/30 bg-info/5',
} as const

const iconColorMap = {
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-info',
} as const

export function ToastProvider() {
  return (
    <Toaster
      position='top-right'
      gutter={8}
      toastOptions={{
        duration: 4000,
        className: '!bg-transparent !shadow-none !p-0',
      }}
    />
  )
}

export function showToast(type: 'success' | 'error' | 'warning' | 'info', message: string) {
  const Icon = iconMap[type]
  toast.custom(
    (t) => (
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md transition-all',
          bgMap[type],
          t.visible ? 'animate-enter' : 'animate-exit'
        )}
      >
        <Icon size={18} className={iconColorMap[type]} />
        <span className='text-sm font-medium'>{message}</span>
      </div>
    ),
    { duration: type === 'error' ? 6000 : 4000 }
  )
}
