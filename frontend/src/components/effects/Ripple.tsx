import { type ReactNode, useRef, useCallback, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'

interface RippleProps {
  children: ReactNode
  className?: string
  color?: string
}

export function Ripple({ children, className, color = 'rgba(255,255,255,0.3)' }: RippleProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const size = Math.max(rect.width, rect.height) * 2

    const ripple = document.createElement('span')
    ripple.style.cssText = `
      position:absolute;border-radius:50%;pointer-events:none;
      width:${size}px;height:${size}px;left:${x - size / 2}px;top:${y - size / 2}px;
      background:${color};opacity:0.4;transform:scale(0);
      animation:rippleExpand 0.6s ease-out forwards;
    `
    container.appendChild(ripple)
    setTimeout(() => ripple.remove(), 600)
  }, [color])

  return (
    <div ref={containerRef} onClick={handleClick} className={cn('relative overflow-hidden', className)}>
      {children}
    </div>
  )
}
