'use client'

import { memo } from 'react'

const orbs = [
  { color: 'var(--aurora-1)', size: 600, x: '15%', y: '10%', duration: 30, delay: 0 },
  { color: 'var(--aurora-2)', size: 500, x: '70%', y: '20%', duration: 25, delay: 2 },
  { color: 'var(--aurora-3)', size: 450, x: '40%', y: '70%', duration: 35, delay: 4 },
  { color: 'var(--aurora-4)', size: 350, x: '80%', y: '80%', duration: 28, delay: 6 },
]

function AuroraBackgroundInner() {
  return (
    <div className="noise-overlay pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--muted) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Aurora orbs */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-[120px] animate-aurora"
          style={{
            background: orb.color,
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            animationDuration: `${orb.duration}s`,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export const AuroraBackground = memo(AuroraBackgroundInner)
