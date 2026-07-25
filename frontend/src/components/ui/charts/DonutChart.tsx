import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { cn } from '@/lib/utils'

interface DonutSegment { name: string; value: number; color?: string }

interface DonutChartProps {
  data: DonutSegment[]
  size?: number; innerRadius?: number; outerRadius?: number
  className?: string; showLabel?: boolean
  centerLabel?: string; centerValue?: string | number
  animated?: boolean
}

const DEFAULT_COLORS = ['#06B6D4', '#5B5CEB', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export function DonutChart({
  data, size = 200, innerRadius = 60, outerRadius = 90, className,
  centerLabel, centerValue, animated = true,
}: DonutChartProps) {
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <ResponsiveContainer width={size} height={size}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey="value"
            stroke="none"
            paddingAngle={3}
            isAnimationActive={animated}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={data[i].color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                style={{ filter: `drop-shadow(0 0 4px ${data[i].color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}40)` }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue !== undefined) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue !== undefined && (
            <span className="text-xl font-bold font-mono">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="text-xs text-[var(--muted)] font-mono uppercase tracking-wider">{centerLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}
