'use client'

import Image from 'next/image'
import { ChevronDown, Heart } from 'lucide-react'
import { Countdown } from './countdown'
import { WEDDING, HERO_BACKGROUND } from '@/lib/constants'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Ảnh nền */}
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_BACKGROUND}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient overlay - từ trên xuống, tối dần để chữ dễ đọc */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70"
          aria-hidden
        />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-14 md:pt-32 md:pb-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm md:text-base text-red-100 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4 font-medium">
            Chúng tôi sắp kết hôn
          </p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white tracking-wide leading-tight mb-3 sm:mb-4 px-2 drop-shadow-lg flex flex-nowrap items-center justify-center gap-x-2 sm:gap-x-4 md:gap-x-5">
            <span className="whitespace-nowrap">{WEDDING.groomShort}</span>
            <Heart className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-red-200 fill-current shrink-0" aria-hidden />
            <span className="whitespace-nowrap">{WEDDING.brideShort}</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-red-100 mb-1 sm:mb-2">{WEDDING.date}</p>
          <p className="text-sm sm:text-base text-red-200/90 mb-8 sm:mb-12 px-2">
            Chúng tôi rất vinh dự mời bạn chia sẻ ngày trọng đại
          </p>

          <Countdown />
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#cau-chuyen"
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors p-2 touch-manipulation"
        aria-label="Cuộn xuống"
      >
        <ChevronDown className="w-6 h-6" />
      </a>
    </section>
  )
}
