import { useState, useEffect, type RefObject } from 'react'

interface MousePosition {
  x: number
  y: number
}

export function useMousePosition(ref?: RefObject<HTMLElement | null>): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const el = ref?.current
    const handler = (e: MouseEvent) => {
      if (el) {
        const rect = el.getBoundingClientRect()
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      } else {
        setPosition({ x: e.clientX, y: e.clientY })
      }
    }

    const target = el || window
    target.addEventListener('mousemove', handler as EventListener)
    return () => target.removeEventListener('mousemove', handler as EventListener)
  }, [ref])

  return position
}
