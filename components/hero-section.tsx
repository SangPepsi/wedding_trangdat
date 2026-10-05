import { ChevronDown } from 'lucide-react'
import { Countdown } from './countdown'
import { HeroPhoto } from './hero-photo'
import { TiltCard } from './tilt-card'
import { CornerOrnament, OrnamentDivider } from './invitation-ornaments'
import { WEDDING } from '@/lib/constants'

export function HeroSection() {
  const { ceremony } = WEDDING

  return (
    <section className="pt-20 sm:pt-24 md:pt-28 pb-10 sm:pb-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <TiltCard className="hero-card-in">
          <article className="invite-fold grid md:grid-cols-2">
            {/* Trang trái: ảnh cưới lồng khung, chữ nằm dưới ảnh để không che mặt */}
            <div className="invite-photo relative p-3 sm:p-4">
              <div className="invite-card-inner h-full flex flex-col p-2.5 sm:p-3">
                <HeroPhoto className="aspect-[4/5] md:aspect-auto md:flex-1 md:min-h-[22rem]" />
                <div className="pt-4 pb-1.5 text-center">
                  <p className="invite-kicker">Lễ thành hôn</p>
                  <p className="mt-1.5 text-xl sm:text-2xl font-light tracking-[0.25em] tabular-nums invite-date">
                    {WEDDING.dateShort.replaceAll('/', ' · ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Trang phải: lời mời */}
            <div className="invite-paper p-3 sm:p-4">
              <div className="invite-card-inner h-full flex flex-col items-center justify-center text-center px-5 sm:px-8 py-10 sm:py-12">
                <CornerOrnament position="top-left" />
                <CornerOrnament position="top-right" />
                <CornerOrnament position="bottom-left" />
                <CornerOrnament position="bottom-right" />

                <p className="invite-hy" aria-hidden>
                  囍
                </p>
                <p className="invite-kicker mt-2">Trân trọng kính mời</p>

                <h1 className="mt-4 font-serif text-[2.6rem] sm:text-5xl leading-[1.1] invite-names invite-shimmer">
                  <span className="block">{WEDDING.groomShort}</span>
                  <span className="block text-2xl sm:text-3xl invite-amp my-0.5">&amp;</span>
                  <span className="block">{WEDDING.brideShort}</span>
                </h1>

                <OrnamentDivider className="mt-5" />

                <div className="mt-4 flex items-center justify-center gap-3 sm:gap-4 invite-date">
                  <span className="w-[5.5rem] sm:w-24 text-right text-[0.7rem] sm:text-xs uppercase tracking-[0.2em] whitespace-nowrap">
                    {ceremony.dayOfWeek}
                  </span>
                  <span className="invite-date-day px-3 sm:px-4 text-4xl sm:text-5xl font-semibold tabular-nums">
                    {ceremony.day}
                  </span>
                  <span className="w-[5.5rem] sm:w-24 text-left text-[0.7rem] sm:text-xs uppercase tracking-[0.2em] whitespace-nowrap">
                    {ceremony.month}
                    <br />
                    {ceremony.year}
                  </span>
                </div>
                <p className="mt-2 text-xs sm:text-sm italic invite-muted">({ceremony.lunarDate})</p>
                <p className="mt-1 text-xs sm:text-sm invite-muted">Vào lúc {ceremony.timeDisplay.toLowerCase()}</p>

                <div className="mt-6">
                  <Countdown />
                </div>
              </div>
            </div>
          </article>
        </TiltCard>

        <a
          href="#cau-chuyen"
          className="mt-6 sm:mt-8 mx-auto w-fit flex flex-col items-center gap-0.5 text-w-muted hover:text-w-strong transition-colors p-2 touch-manipulation"
          aria-label="Cuộn xuống phần câu chuyện"
        >
          <span className="text-[0.65rem] uppercase tracking-[0.3em]">Xem thêm</span>
          <ChevronDown className="w-5 h-5 motion-safe:animate-bounce" aria-hidden />
        </a>
      </div>
    </section>
  )
}
