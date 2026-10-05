'use client'

import { useEffect, useRef } from 'react'

const COLORS = ['#f6c6cf', '#f3b4c0', '#fbe0e5', '#efd3a8', '#f8d9c4']

interface Petal {
  x: number
  y: number
  size: number
  speed: number
  drift: number
  phase: number
  sway: number
  rotation: number
  spin: number
  flip: number
  color: string
}

function createPetal(width: number, height: number, anywhere: boolean): Petal {
  return {
    x: Math.random() * width,
    y: anywhere ? Math.random() * height : -20 - Math.random() * height * 0.3,
    size: 8 + Math.random() * 8,
    speed: 0.35 + Math.random() * 0.45,
    drift: (Math.random() - 0.3) * 0.25,
    phase: Math.random() * Math.PI * 2,
    sway: 0.6 + Math.random() * 0.9,
    rotation: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.02,
    flip: Math.random() * Math.PI * 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }
}

function drawPetal(ctx: CanvasRenderingContext2D, p: Petal) {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)
  ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.flip)))
  ctx.beginPath()
  ctx.moveTo(0, -p.size)
  ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.6, p.size * 0.7, p.size * 0.7, 0, p.size)
  ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.7, -p.size * 0.9, -p.size * 0.6, 0, -p.size)
  ctx.fillStyle = p.color
  ctx.fill()
  ctx.restore()
}

/** Cánh hoa rơi nhẹ phía sau nội dung; tắt khi người dùng chọn giảm chuyển động */
export function PetalLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let width = 0
    let height = 0
    let petals: Petal[] = []
    let frame = 0
    let last = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = width < 640 ? 10 : 18
      petals = Array.from({ length: count }, (_, i) => petals[i] ?? createPetal(width, height, true))
    }

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.7, 3)
      last = now
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i]
        p.phase += 0.012 * dt
        p.flip += 0.03 * dt
        p.rotation += p.spin * dt
        p.y += p.speed * dt
        p.x += (p.drift + Math.sin(p.phase) * p.sway * 0.4) * dt
        if (p.y > height + 20 || p.x < -30 || p.x > width + 30) petals[i] = createPetal(width, height, false)
        drawPetal(ctx, petals[i])
      }
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      cancelAnimationFrame(frame)
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
    const onVisibility = () => (document.hidden ? cancelAnimationFrame(frame) : start())

    resize()
    start()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className="petal-layer" aria-hidden />
}
