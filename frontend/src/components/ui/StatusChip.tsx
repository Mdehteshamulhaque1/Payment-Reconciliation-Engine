import { cn, getStatusColor, getStatusLabel } from '@/lib/utils'

interface StatusChipProps {
  status: string
  size?: 'sm' | 'md'
  pulse?: boolean
}

const colorMap: Record<string, string> = {
  success: 'bg-success/10 text-success border-success/20',
  info: 'bg-info/10 text-info border-info/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  neutral: 'bg-muted text-muted-foreground border-border',
}

const dotColorMap: Record<string, string> = {
  success: 'bg-success',
  info: 'bg-info',
  warning: 'bg-warning',
  danger: 'bg-danger',
  neutral: 'bg-muted-foreground',
}

export function StatusChip({ status, size = 'sm', pulse = false }: StatusChipProps) {
  const color = getStatusColor(status)
  const label = getStatusLabel(status)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        colorMap[color] ?? colorMap.neutral
      )}
    >
      <span className='relative flex h-1.5 w-1.5'>
        {pulse && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              dotColorMap[color] ?? dotColorMap.neutral
            )}
          />
        )}
        <span
          className={cn(
            'relative inline-flex h-1.5 w-1.5 rounded-full',
            dotColorMap[color] ?? dotColorMap.neutral
          )}
        />
      </span>
      {label}
    </span>
  )
}
