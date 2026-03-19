/**
 * Hiệu ứng pháo phun - phun từ 2 bên dưới lên trên như thiệp cưới
 * Màu: trắng, vàng, đỏ
 */
import confetti from 'canvas-confetti'

const COLORS = ['#ffffff', '#d4a574', '#fcd34d', '#dc2626', '#b91c1c', '#fef3c7']

function fireFromBottomSide(originX: number, angle: number, count = 100) {
  const defaults = {
    origin: { x: originX, y: 1 },
    spread: 70,
    startVelocity: 45,
    colors: COLORS,
    shapes: ['square', 'circle'] as const,
    scalar: 0.9,
    ticks: 350,
    gravity: 0.5,
    drift: 0.2,
  }
  confetti({ ...defaults, particleCount: count, angle })
}

export function fireWeddingConfetti() {
  // Phun từ bên trái dưới lên trên (góc hơi chếch phải)
  fireFromBottomSide(0.15, 85)
  // Phun từ bên phải dưới lên trên (góc hơi chếch trái)
  fireFromBottomSide(0.85, 95)
  // Đợt 2 - mạnh hơn
  setTimeout(() => {
    fireFromBottomSide(0.12, 88, 120)
    fireFromBottomSide(0.88, 92, 120)
  }, 120)
  // Đợt 3
  setTimeout(() => {
    fireFromBottomSide(0.18, 86, 90)
    fireFromBottomSide(0.82, 94, 90)
  }, 280)
  // Đợt 4 - kéo dài hiệu ứng
  setTimeout(() => {
    fireFromBottomSide(0.15, 90, 70)
    fireFromBottomSide(0.85, 90, 70)
  }, 480)
  // Đợt 5 - nhẹ cuối
  setTimeout(() => {
    fireFromBottomSide(0.2, 88, 50)
    fireFromBottomSide(0.8, 92, 50)
  }, 700)
}
