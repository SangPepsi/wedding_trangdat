'use client'

import { useInView } from '@/hooks/use-in-view'

export type RevealVariant = 'up' | 'left' | 'right' | 'zoom' | 'mask'

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Độ trễ hiệu ứng (ms) để các phần tử xuất hiện lần lượt */
  delay?: number
  variant?: RevealVariant
}

/** Hiện dần nội dung khi cuộn tới (mờ nhòe -> rõ nét) */
export function Reveal({ children, className = '', delay = 0, variant = 'up' }: RevealProps) {
  const { ref, isInView } = useInView()

  return (
    <div
      ref={ref}
      className={`reveal reveal-${variant} ${isInView ? 'is-visible' : ''} ${className}`}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  )
}
