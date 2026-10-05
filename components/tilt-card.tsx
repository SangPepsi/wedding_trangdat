'use client'

import { useRef } from 'react'

const MAX_TILT = 4

/** Nghiêng 3D nhẹ theo con trỏ chuột (chỉ trên thiết bị có chuột) */
export function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  const update = (x: number, y: number, active: boolean) => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const el = ref.current
      if (!el) return
      el.style.setProperty('--tilt-x', `${active ? (0.5 - y) * MAX_TILT * 2 : 0}deg`)
      el.style.setProperty('--tilt-y', `${active ? (x - 0.5) * MAX_TILT * 2 : 0}deg`)
      el.style.setProperty('--glare-x', `${x * 100}%`)
      el.style.setProperty('--glare-y', `${y * 100}%`)
      el.dataset.tilting = active ? 'true' : 'false'
    })
  }

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const rect = e.currentTarget.getBoundingClientRect()
        update((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height, true)
      }}
      onPointerLeave={() => update(0.5, 0.5, false)}
    >
      {children}
      <span className="tilt-glare" aria-hidden />
    </div>
  )
}
