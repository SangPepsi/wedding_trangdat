'use client'

import { MapPin, CalendarPlus } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'
import { WEDDING, ANNOUNCEMENT, FAMILY_ADDRESSES } from '@/lib/constants'

export function CeremonyAnnouncementSection() {
  const { ref, isInView } = useInView()

  return (
    <section id="thong-bao-le" className="py-16 sm:py-20 md:py-28 overflow-x-hidden" data-theme-section="main">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`ceremony-announcement-card rounded-2xl p-6 sm:p-8 md:p-10 text-center transition-all duration-700 ease-out overflow-hidden ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="ceremony-card-subtitle text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.28em] font-light mb-4 whitespace-nowrap text-center overflow-hidden max-w-full">
            {ANNOUNCEMENT}
          </p>

          <h2 className="ceremony-card-names font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3">
            <span>{WEDDING.groomShort}</span>
            <span className="ceremony-accent text-[#d4a574]">&</span>
            <span>{WEDDING.brideShort}</span>
          </h2>

          <p className="ceremony-card-subtitle text-sm sm:text-base font-serif mb-6 opacity-95">
            Lễ Thành Hôn được cử hành tại tư gia
          </p>

          {/* 3 cột: Giờ | Ngày | Năm - mobile: xếp dọc, desktop: ngang */}
          <div className="ceremony-card-datetime flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 py-4 sm:py-5 mb-2 border-y border-[#d4a574]/40">
            {/* Cột giờ */}
            <div className="ceremony-card-subtitle text-xs sm:text-base font-medium text-center">
              {WEDDING.ceremony.timeDisplay}
            </div>
            <div className="ceremony-divider hidden sm:block w-px self-stretch min-h-[2.5rem] bg-[#d4a574]/50 shrink-0" />
            <div className="ceremony-divider sm:hidden w-full max-w-[4rem] h-px bg-[#d4a574]/40" />
            {/* Cột ngày */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 shrink-0 flex-wrap">
              <span className="ceremony-card-subtitle text-[10px] sm:text-sm uppercase tracking-wider leading-tight">
                {WEDDING.ceremony.dayOfWeek}
              </span>
              <span className="ceremony-card-names text-lg sm:text-2xl font-bold">/</span>
              <span className="ceremony-card-names text-2xl sm:text-4xl font-bold tabular-nums">
                {WEDDING.ceremony.day}
              </span>
              <span className="ceremony-card-names text-lg sm:text-2xl font-bold">/</span>
              <span className="ceremony-card-subtitle text-[10px] sm:text-sm uppercase tracking-wider leading-tight">
                {WEDDING.ceremony.month}
              </span>
            </div>
            <div className="ceremony-divider hidden sm:block w-px self-stretch min-h-[2.5rem] bg-[#d4a574]/50 shrink-0" />
            <div className="ceremony-divider sm:hidden w-full max-w-[4rem] h-px bg-[#d4a574]/40" />
            {/* Cột năm */}
            <div className="ceremony-card-subtitle text-xs sm:text-base text-center">
              {WEDDING.ceremony.year}
              <span className="ceremony-accent text-[#d4a574]/90"> / ({WEDDING.ceremony.lunarYear})</span>
            </div>
          </div>

          <p className="ceremony-card-lunar text-xs sm:text-sm font-serif mb-6">
            ({WEDDING.ceremony.lunarDate})
          </p>

          <p className="ceremony-card-names text-sm sm:text-base font-semibold mb-8 leading-relaxed px-1 break-words">
            Tại: {WEDDING.ceremony.location}
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <a
              href={FAMILY_ADDRESSES.groomFamily.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#e8c88a]/90 hover:bg-[#e8c88a] text-[#4a0101] font-semibold text-sm transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Chỉ đường
            </a>
            <a
              href={WEDDING.addToCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#e8c88a]/90 hover:bg-[#e8c88a] text-[#4a0101] font-semibold text-sm transition-colors"
            >
              <CalendarPlus className="w-4 h-4" />
              Thêm lịch
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
