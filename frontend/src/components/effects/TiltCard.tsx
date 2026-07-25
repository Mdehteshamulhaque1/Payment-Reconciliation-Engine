import { useRef, useState, useCallback, type ReactNode, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TiltCardProps {
  children: ReactNode
  className?: string
  glareColor?: string
  maxTilt?: number
  scale?: number
}

export function TiltCard({ children, className, glareColor = 'rgba(0, 240, 255, 0.06)', maxTilt = 8, scale = 1.02 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, glareOpacity: 0 })

  const handleMouse = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTilt({
      rotateX: (0.5 - y) * maxTilt,
      rotateY: (x - 0.5) * maxTilt,
      glareX: x * 100,
      glareY: y * 100,
      glareOpacity: 0.15,
    })
  }, [maxTilt])

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, glareOpacity: 0 })}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        scale: tilt.glareOpacity > 0 ? scale : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ perspective: 800, transformStyle: 'preserve-3d' }}
      className={cn('relative', className)}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 z-[1]"
        style={{
          opacity: tilt.glareOpacity,
          background: `radial-gradient(600px circle at ${tilt.glareX}% ${tilt.glareY}%, ${glareColor}, transparent 40%)`,
        }}
      />
      {children}
    </motion.div>
  )
}
