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

interface Glint {
  x: number
  y: number
  size: number
  rise: number
  phase: number
  twinkle: number
}

function createGlint(width: number, height: number): Glint {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: 2 + Math.random() * 3,
    rise: 0.08 + Math.random() * 0.15,
    phase: Math.random() * Math.PI * 2,
    twinkle: 0.025 + Math.random() * 0.03,
  }
}

/** Ánh sao vàng 4 cánh, sáng lên rồi tắt dần */
function drawGlint(ctx: CanvasRenderingContext2D, g: Glint) {
  const alpha = Math.max(0, Math.sin(g.phase)) ** 3
  if (alpha < 0.02) return
  const r = g.size * (0.6 + alpha * 0.6)
  ctx.save()
  ctx.translate(g.x, g.y)
  ctx.globalAlpha = alpha * 0.9
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.4)
  glow.addColorStop(0, 'rgba(255, 236, 190, 0.85)')
  glow.addColorStop(1, 'rgba(232, 200, 138, 0)')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(0, 0, r * 2.4, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#fff4d6'
  ctx.beginPath()
  ctx.moveTo(0, -r * 2.2)
  ctx.quadraticCurveTo(r * 0.18, -r * 0.18, r * 2.2, 0)
  ctx.quadraticCurveTo(r * 0.18, r * 0.18, 0, r * 2.2)
  ctx.quadraticCurveTo(-r * 0.18, r * 0.18, -r * 2.2, 0)
  ctx.quadraticCurveTo(-r * 0.18, -r * 0.18, 0, -r * 2.2)
  ctx.fill()
  ctx.restore()
}

/** Cánh hoa rơi nhẹ và ánh sao vàng phía sau nội dung; tắt khi người dùng chọn giảm chuyển động */
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
    let glints: Glint[] = []
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
      glints = Array.from({ length: width < 640 ? 7 : 14 }, (_, i) => glints[i] ?? createGlint(width, height))
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
      for (let i = 0; i < glints.length; i++) {
        const g = glints[i]
        const before = Math.sin(g.phase)
        g.phase += g.twinkle * dt
        g.y -= g.rise * dt
        // Đổi chỗ khi vừa tắt hẳn để ánh sao không hiện lặp lại một điểm
        if (before < 0 && Math.sin(g.phase) >= 0) {
          glints[i] = { ...createGlint(width, height), phase: g.phase }
        } else if (g.y < -10) {
          g.y = height + 10
        }
        drawGlint(ctx, glints[i])
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
