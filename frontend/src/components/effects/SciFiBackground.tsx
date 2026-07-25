import { memo } from 'react'
import { ParticleField } from './ParticleField'
import { ScanLine } from './ScanLine'

function SciFiBackgroundInner() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* ─── Background photo layer ─── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.12]"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&q=80")`,
          filter: 'saturate(0.6) brightness(0.7)',
        }}
      />
      {/* Dark overlay on top of photo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg1)]/80 via-[var(--bg1)]/60 to-[var(--bg1)]/90" />

      {/* ─── Gradient mesh blobs (animated) ─── */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Blob 1 — Cyan */}
        <div
          className="gradient-blob"
          style={{
            width: '50vw', height: '50vw', maxWidth: '600px', maxHeight: '600px',
            background: 'radial-gradient(circle, rgba(0, 240, 255, 0.1), transparent 70%)',
            top: '5%', left: '5%', animationDuration: '22s', animationDelay: '0s',
          }}
        />
        {/* Blob 2 — Violet */}
        <div
          className="gradient-blob"
          style={{
            width: '45vw', height: '45vw', maxWidth: '550px', maxHeight: '550px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08), transparent 70%)',
            top: '60%', right: '5%', animationDuration: '28s', animationDelay: '4s',
          }}
        />
        {/* Blob 3 — Pink */}
        <div
          className="gradient-blob"
          style={{
            width: '35vw', height: '35vw', maxWidth: '450px', maxHeight: '450px',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.06), transparent 70%)',
            bottom: '10%', left: '35%', animationDuration: '32s', animationDelay: '8s',
          }}
        />
        {/* Blob 4 — Primary (large, subtle) */}
        <div
          className="gradient-blob"
          style={{
            width: '60vw', height: '40vw', maxWidth: '700px', maxHeight: '500px',
            background: 'radial-gradient(ellipse, rgba(91, 92, 235, 0.04), transparent 70%)',
            top: '25%', left: '30%', animationDuration: '35s', animationDelay: '2s',
          }}
        />
      </div>

      {/* ─── Animated gradient wave ─── */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40%] opacity-[0.015]"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(0, 240, 255, 0.3) 50%, rgba(139, 92, 246, 0.2))',
          animation: 'meshDrift 20s ease-in-out infinite',
        }}
      />

      {/* ─── Grid overlay ─── */}
      <div
        className="absolute inset-0 animate-grid-pulse"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.025,
        }}
      />

      {/* ─── Hex grid overlay ─── */}
      <div
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2300f0ff' fill-opacity='0.3'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* ─── Particles ─── */}
      <ParticleField />

      {/* ─── Scan line ─── */}
      <ScanLine />

      {/* ─── Corner accent brackets ─── */}
      <div className="fixed top-4 left-4 h-16 w-16 opacity-[0.06]">
        <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-[var(--accent-cyan)] to-transparent" />
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-[var(--accent-cyan)] to-transparent" />
      </div>
      <div className="fixed top-4 right-4 h-16 w-16 opacity-[0.06]">
        <div className="absolute top-0 right-0 h-px w-full bg-gradient-to-l from-[var(--accent-cyan)] to-transparent" />
        <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-[var(--accent-cyan)] to-transparent" />
      </div>
      <div className="fixed bottom-4 left-4 h-16 w-16 opacity-[0.06]">
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-[var(--accent-cyan)] to-transparent" />
        <div className="absolute bottom-0 left-0 h-full w-px bg-gradient-to-t from-[var(--accent-cyan)] to-transparent" />
      </div>
      <div className="fixed bottom-4 right-4 h-16 w-16 opacity-[0.06]">
        <div className="absolute bottom-0 right-0 h-px w-full bg-gradient-to-l from-[var(--accent-cyan)] to-transparent" />
        <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-t from-[var(--accent-cyan)] to-transparent" />
      </div>

      {/* ─── Noise ─── */}
      <div className="noise-overlay absolute inset-0" />
    </div>
  )
}

export const SciFiBackground = memo(SciFiBackgroundInner)
