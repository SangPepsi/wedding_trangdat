'use client'

import { useEffect, useState } from 'react'
import { WEDDING } from '@/lib/constants'

interface CountdownState {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function Countdown() {
  const [countdown, setCountdown] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isPast, setIsPast] = useState(false)

  useEffect(() => {
    const calculateCountdown = () => {
      const weddingDate = new Date(WEDDING.dateISO).getTime()
      const now = new Date().getTime()
      const difference = weddingDate - now

      if (difference <= 0) {
        setIsPast(true)
      } else {
        setIsPast(false)
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateCountdown()
    const timer = setInterval(calculateCountdown, 1000)
    return () => clearInterval(timer)
  }, [])

  const CountdownItem = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-red-700 text-white flex items-center justify-center font-bold text-base sm:text-lg md:text-xl tabular-nums mb-1">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[10px] sm:text-xs text-red-200 font-medium">{label}</span>
    </div>
  )

  if (isPast) {
    return (
      <p className="text-lg sm:text-xl text-red-100 font-medium italic">
        Cảm ơn quý khách đã đến dự ngày trọng đại của chúng tôi!
      </p>
    )
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-4 md:gap-6 flex-wrap">
      <CountdownItem value={countdown.days} label="Ngày" />
      <CountdownItem value={countdown.hours} label="Giờ" />
      <CountdownItem value={countdown.minutes} label="Phút" />
      <CountdownItem value={countdown.seconds} label="Giây" />
    </div>
  )
}
