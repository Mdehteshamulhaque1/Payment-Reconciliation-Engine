import { ResponsiveContainer, RadarChart as ReRadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts'
import { cn } from '@/lib/utils'
import { ChartTooltip } from './ChartTooltip'

interface RadarDataPoint {
  name: string
  value: number
  fullMark?: number
}

interface RadarChartProps {
  data: RadarDataPoint[]
  dataKey?: string
  color?: string
  height?: number
  className?: string
}

export function RadarChart({
  data,
  dataKey = 'value',
  color = 'var(--accent-cyan)',
  height = 280,
  className,
}: RadarChartProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <ReRadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid
            stroke="var(--border)"
            strokeOpacity={0.4}
          />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fontSize: 9, fill: 'var(--muted)' }}
            axisLine={false}
          />
          <Tooltip content={<ChartTooltip />} />
          <Radar
            name="Value"
            dataKey={dataKey}
            stroke={color}
            fill={color}
            fillOpacity={0.15}
            strokeWidth={2}
            dot={{ r: 3, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: color, stroke: 'var(--bg1)', strokeWidth: 2 }}
          />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
