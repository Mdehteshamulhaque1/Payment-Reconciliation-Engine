interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  formatter?: (value: number, name: string) => string
}

export function ChartTooltip({ active, payload, label, formatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className='rounded-xl border border-border bg-card/95 px-3 py-2 shadow-xl backdrop-blur-sm'>
      {label && <p className='mb-1 text-xs font-medium text-muted-foreground'>{label}</p>}
      {payload.map((item, i) => (
        <div key={i} className='flex items-center gap-2 text-sm'>
          <span
            className='h-2 w-2 rounded-full'
            style={{ backgroundColor: item.color }}
          />
          <span className='text-muted-foreground'>{item.name}:</span>
          <span className='font-medium'>
            {formatter ? formatter(item.value, item.name) : item.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

interface ChartLegendProps {
  payload?: Array<{ color: string; value: string }>
}

export function ChartLegend({ payload }: ChartLegendProps) {
  if (!payload?.length) return null

  return (
    <div className='flex flex-wrap gap-4 pt-2'>
      {payload.map((item, i) => (
        <div key={i} className='flex items-center gap-1.5 text-xs text-muted-foreground'>
          <span
            className='h-2 w-2 rounded-full'
            style={{ backgroundColor: item.color }}
          />
          {item.value}
        </div>
      ))}
    </div>
  )
}
