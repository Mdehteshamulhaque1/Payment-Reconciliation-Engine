import { Bell, Check, CheckCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { ScrollReveal } from '@/components/effects/ScrollReveal'
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications'
import { formatRelativeTime } from '@/lib/utils'
import { showToast } from '@/components/effects/Toast'

const typeColors: Record<string, string> = {
  info: 'border-l-info bg-info/5',
  warning: 'border-l-warning bg-warning/5',
  error: 'border-l-danger bg-danger/5',
  success: 'border-l-success bg-success/5',
}

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications()
  const markReadMutation = useMarkNotificationRead()
  const markAllMutation = useMarkAllNotificationsRead()

  const unreadCount = notifications?.filter((n) => !n.is_read).length ?? 0

  return (
    <motion.div className='space-y-6' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <ScrollReveal>
        <PageHeader
          title='Notifications'
          description={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
          breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Notifications' }]}
          actions={
            unreadCount > 0 ? (
              <Button
                variant='outline'
                onClick={() => markAllMutation.mutate(undefined, { onSuccess: () => showToast('success', 'All marked as read') })}
                loading={markAllMutation.isPending}
              >
                <CheckCheck size={16} className='mr-1.5' /> Mark all read
              </Button>
            ) : undefined
          }
        />
      </ScrollReveal>

      {isLoading ? (
        <div className='space-y-3'>
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className='h-20 rounded-xl' />)}
        </div>
      ) : !notifications?.length ? (
        <ScrollReveal><EmptyState icon={Bell} title='No notifications' description='No notifications yet' /></ScrollReveal>
      ) : (
        <div className='space-y-2'>
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ x: 4 }}
              className={`flex items-start gap-4 rounded-xl border-l-4 p-4 transition-colors cursor-default ${
                typeColors[n.status] ?? 'border-l-muted bg-card'
              } ${n.is_read ? 'opacity-60' : ''} bg-card border border-border`}
            >
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2'>
                  <h4 className='text-sm font-semibold'>{n.subject}</h4>
                  {!n.is_read && <span className='h-2 w-2 rounded-full bg-[var(--accent-neon)] animate-pulse shadow-[0_0_8px_var(--accent-neon)]' />}
                </div>
                <p className='mt-1 text-sm text-muted-foreground line-clamp-2'>{n.body}</p>
                <p className='mt-2 text-xs text-muted-foreground font-mono'>{formatRelativeTime(n.created_at)}</p>
              </div>
              {!n.is_read && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => markReadMutation.mutate(n.id)}
                    title='Mark as read'
                  >
                    <Check size={14} />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
