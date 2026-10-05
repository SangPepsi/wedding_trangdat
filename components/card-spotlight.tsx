'use client'

import { useEffect } from 'react'

const SELECTOR = '.card-wedding'

/** Quầng sáng nhẹ đi theo con trỏ chuột trên các thẻ (.card-wedding::after đọc --spot-x/--spot-y) */
export function CardSpotlight() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const card = (e.target as Element | null)?.closest<HTMLElement>(SELECTOR)
      if (!card) return
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
      card.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])

  return null
}
