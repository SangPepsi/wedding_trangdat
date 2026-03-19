'use client'

import Image from 'next/image'

interface LongPhungDividerProps {
  className?: string
  maxWidth?: number
  opacity?: number
}

export function LongPhungDivider({
  className = '',
  maxWidth = 280,
  opacity = 0.9,
}: LongPhungDividerProps) {
  return (
    <div
      className={`flex justify-center py-6 ${className}`}
      aria-hidden
    >
      <Image
        src="/long-phung-cover.png"
        alt="Long Phụng - Song Hỷ"
        width={maxWidth}
        height={Math.round(maxWidth * 0.35)}
        className="object-contain"
        style={{ opacity }}
        priority={false}
      />
    </div>
  )
}
