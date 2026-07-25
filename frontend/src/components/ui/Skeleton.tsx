import { cn } from '../../lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-[linear-gradient(90deg,color-mix(in_srgb,var(--muted)_5%,var(--bg3))_25%,color-mix(in_srgb,var(--accent-cyan)_4%,var(--bg3))_37%,color-mix(in_srgb,var(--muted)_5%,var(--bg3))_63%)] bg-[length:400%_100%] animate-skeleton',
        className,
      )}
    />
  )
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-[var(--surface)] p-5', className)}>
      <div className='flex items-center gap-3 mb-4'>
        <Skeleton className='h-11 w-11 rounded-xl' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-3 w-24' />
          <Skeleton className='h-5 w-16' />
        </div>
      </div>
      <Skeleton className='h-2 w-full' />
    </div>
  )
}

export function SkeletonRow({ className }: SkeletonProps) {
  return (
    <div className={cn('flex items-center gap-4 p-4', className)}>
      <Skeleton className='h-10 w-10 rounded-lg shrink-0' />
      <div className='flex-1 space-y-2'>
        <Skeleton className='h-3.5 w-32' />
        <Skeleton className='h-3 w-20' />
      </div>
      <Skeleton className='h-5 w-16' />
      <Skeleton className='h-6 w-20 rounded-full' />
    </div>
  )
}

export function SkeletonTable({ rows = 5, className }: { rows?: number } & SkeletonProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} className='rounded-xl' />
      ))}
    </div>
  )
}

export function SkeletonChart({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-[var(--surface)] p-5', className)}>
      <Skeleton className='h-4 w-32 mb-4' />
      <Skeleton className='h-48 w-full rounded-xl' />
    </div>
  )
}
