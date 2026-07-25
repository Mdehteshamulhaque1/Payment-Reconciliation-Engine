import { memo } from 'react'

function ScanLineInner() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      {/* Horizontal scan line */}
      <div
        className="absolute inset-x-0 h-px opacity-[0.06]"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)',
          animation: 'scanLineY 8s linear infinite',
        }}
      />
      {/* Vertical scan line */}
      <div
        className="absolute inset-y-0 w-px opacity-[0.04]"
        style={{
          background: 'linear-gradient(180deg, transparent, var(--primary), transparent)',
          animation: 'scanLineX 12s linear infinite',
        }}
      />
      {/* CRT scanlines */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />
    </div>
  )
}

export const ScanLine = memo(ScanLineInner)
