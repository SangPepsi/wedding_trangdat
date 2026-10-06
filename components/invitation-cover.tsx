'use client'

import { useEffect, useState } from 'react'
import { Heart, Palette } from 'lucide-react'
import { WEDDING, ANNOUNCEMENT } from '@/lib/constants'
import { useGuestName } from '@/hooks/use-guest-name'
import { useWeddingTheme } from '@/hooks/use-wedding-theme'
import { WEDDING_OPEN_EVENT } from '@/hooks/use-background-music'

/** closed → opening (dấu sáp tách, nắp lật) → revealing (chớp sáng, hai cánh cửa mở) → hidden */
type Stage = 'closed' | 'opening' | 'revealing' | 'hidden'

const OPENING_MS = 1150
const REVEALING_MS = 1500

const loadConfetti = () => import('@/lib/confetti')

function SealPiece({ part }: { part: 'whole' | 'left' | 'right' }) {
  return (
    <div
      className={`cover-seal cover-seal-piece cover-seal-${part} absolute inset-0 rounded-full flex items-center justify-center border-4`}
    >
      <Heart className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow-sm" aria-hidden />
    </div>
  )
}

export function InvitationCover() {
  const [stage, setStage] = useState<Stage>('closed')
  const guestName = useGuestName()
  const { themeName, cycleTheme } = useWeddingTheme()

  useEffect(() => {
    loadConfetti()
  }, [])

  useEffect(() => {
    if (stage === 'hidden') return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [stage])

  const handleOpen = () => {
    if (stage !== 'closed') return
    setStage('opening')
    // Phát nhạc phải nằm ngay trong thao tác bấm, trình duyệt mới cho phép
    window.dispatchEvent(new Event(WEDDING_OPEN_EVENT))

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setTimeout(() => {
      setStage('revealing')
      document.documentElement.dataset.opened = 'true'
      loadConfetti().then((m) => m.fireOpeningCelebration())
      setTimeout(() => {
        setStage('hidden')
        window.scrollTo({ top: 0 })
      }, reduceMotion ? 0 : REVEALING_MS)
    }, reduceMotion ? 0 : OPENING_MS)
  }

  if (stage === 'hidden') return null

  const isOpening = stage !== 'closed'
  const dateFormatted = WEDDING.dateShort.replace(/\//g, '.')

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cover-title"
      data-stage={stage}
      className="cover-root fixed inset-0 z-[100]"
    >
      <div className="cover-door cover-door-left" aria-hidden />
      <div className="cover-door cover-door-right" aria-hidden />
      <div className="cover-flash" aria-hidden />

      <button
        type="button"
        onClick={cycleTheme}
        className="cover-palette absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white shadow-lg border border-white/50 flex items-center justify-center text-stone-600 hover:text-stone-800 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label={`Đổi màu nền (hiện: ${themeName})`}
        title={`Đổi màu (${themeName})`}
      >
        <Palette className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="cover-card-wrap perspective-[1200px] w-full max-w-[420px]">
            <div className="envelope-card relative w-full">
              <div className="cover-gold-frame absolute -inset-[1px] rounded-[2rem] opacity-90" />
              <div className="cover-inner-border absolute -inset-[2px] rounded-[1.5rem] m-[3px]" />

              <div className="relative w-full h-full rounded-[1.25rem] overflow-hidden">
                <div className="cover-surface relative pt-[7.5rem] sm:pt-[8.75rem] pb-10 px-8 sm:px-12 text-center rounded-b-[1.25rem]">
                  <div className="cover-letter cover-stagger">
                    <p className="cover-sub text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-4 font-light leading-relaxed">
                      {ANNOUNCEMENT}
                    </p>
                    <h2
                      id="cover-title"
                      className="cover-text font-serif text-[1.75rem] sm:text-4xl font-bold tracking-wide mb-6 flex flex-nowrap items-center justify-center gap-x-2 sm:gap-x-3"
                    >
                      <span className="whitespace-nowrap drop-shadow-sm">{WEDDING.groomShort}</span>
                      <Heart
                        className="cover-accent w-5 h-5 sm:w-7 sm:h-7 fill-current shrink-0 drop-shadow-sm"
                        aria-hidden
                      />
                      <span className="sr-only">và</span>
                      <span className="whitespace-nowrap drop-shadow-sm">{WEDDING.brideShort}</span>
                    </h2>

                    <div className="flex items-center justify-center gap-3 mb-6" aria-hidden>
                      <span className="cover-line-left w-8 h-px opacity-70" />
                      <span className="cover-accent-bg w-2 h-2 rounded-full" />
                      <span className="cover-accent-bg w-16 h-px opacity-80" />
                      <span className="cover-accent-bg w-2 h-2 rounded-full" />
                      <span className="cover-line-right w-8 h-px opacity-70" />
                    </div>

                    <p className="cover-date font-serif text-xl sm:text-2xl tracking-[0.2em] mb-2">{dateFormatted}</p>

                    {guestName ? (
                      <div className="mb-8">
                        <p className="cover-date text-xs uppercase tracking-[0.3em] font-light mb-2">
                          Trân trọng kính mời
                        </p>
                        <p className="cover-text font-serif text-2xl sm:text-3xl break-words">{guestName}</p>
                      </div>
                    ) : (
                      <p className="cover-date text-xs uppercase tracking-[0.35em] mb-10 font-light">
                        Trân trọng kính mời
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleOpen}
                      disabled={isOpening}
                      autoFocus
                      className="cover-btn relative overflow-hidden w-full py-4 font-bold text-sm uppercase tracking-[0.25em] rounded-xl shadow-lg active:scale-[0.98] transition-all duration-300 disabled:opacity-90 disabled:cursor-not-allowed border focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                      Mở thiệp cưới
                    </button>
                  </div>
                </div>

                <div className="envelope-flap cover-surface absolute top-0 left-0 right-0 h-20 sm:h-24 rounded-t-[1.25rem] rounded-b-[2rem]" />
              </div>

              <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 -translate-y-[42%] z-10" aria-hidden>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                  <div className="cover-seal-glow absolute -inset-6 rounded-full opacity-60" />
                  <span className="cover-seal-ring absolute inset-0 rounded-full" />
                  <SealPiece part="left" />
                  <SealPiece part="right" />
                  <SealPiece part="whole" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
