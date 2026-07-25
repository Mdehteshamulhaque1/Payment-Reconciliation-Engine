import {
  ResponsiveContainer,
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  type AreaProps,
} from 'recharts'
import { cn } from '@/lib/utils'
import { ChartTooltip } from './ChartTooltip'

interface ChartArea {
  dataKey: string
  color?: string
  fillOpacity?: number
  strokeWidth?: number
  type?: AreaProps['type']
}

interface AreaChartProps {
  data: Record<string, unknown>[]
  areas: ChartArea[]
  xKey?: string
  height?: number
  className?: string
  showGrid?: boolean
  showAxis?: boolean
  tooltipFormatter?: (value: number, name: string) => string
  animated?: boolean
}

const DEFAULT_COLORS = ['#06B6D4', '#5B5CEB', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export function AreaChart({
  data, areas, xKey = 'name', height = 300, className,
  showGrid = true, showAxis = true, tooltipFormatter, animated = true,
}: AreaChartProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <ReAreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              strokeOpacity={0.3}
              vertical={false}
            />
          )}
          {showAxis && (
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 10, fill: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={false}
              tickLine={false}
            />
          )}
          {showAxis && (
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={false}
              tickLine={false}
            />
          )}
          <Tooltip content={<ChartTooltip formatter={tooltipFormatter} />} cursor={{ stroke: 'var(--accent-cyan)', strokeOpacity: 0.15 }} />
          {areas.map((area, i) => (
            <Area
              key={area.dataKey}
              type={area.type ?? 'monotone'}
              dataKey={area.dataKey}
              stroke={area.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
              fill={area.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
              fillOpacity={area.fillOpacity ?? 0.1}
              strokeWidth={area.strokeWidth ?? 2}
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 0,
                fill: area.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
              }}
              isAnimationActive={animated}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          ))}
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  )
}
