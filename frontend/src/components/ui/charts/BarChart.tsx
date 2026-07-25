import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { cn } from '@/lib/utils'
import { ChartTooltip } from './ChartTooltip'

interface ChartBar {
  dataKey: string
  color?: string
  radius?: [number, number, number, number]
}

interface BarChartProps {
  data: Record<string, unknown>[]
  bars: ChartBar[]
  xKey?: string
  height?: number
  className?: string
  showGrid?: boolean
  showAxis?: boolean
  tooltipFormatter?: (value: number, name: string) => string
}

const DEFAULT_COLORS = ['#5B5CEB', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6']

export function BarChart({
  data,
  bars,
  xKey = 'name',
  height = 300,
  className,
  showGrid = true,
  showAxis = true,
  tooltipFormatter,
}: BarChartProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width='100%' height={height}>
        <ReBarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='hsl(var(--border))'
              strokeOpacity={0.5}
              vertical={false}
            />
          )}
          {showAxis && (
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
          )}
          {showAxis && (
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
          )}
          <Tooltip content={<ChartTooltip formatter={tooltipFormatter} />} />
          {bars.map((bar, i) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              fill={bar.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
              radius={bar.radius ?? [4, 4, 0, 0]}
              maxBarSize={40}
            />
          ))}
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  )
}
