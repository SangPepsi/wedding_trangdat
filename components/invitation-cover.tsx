'use client'

import { useState, useEffect } from 'react'
import { Heart, Palette } from 'lucide-react'
import { WEDDING, ANNOUNCEMENT } from '@/lib/constants'
import { fireWeddingConfetti } from '@/lib/confetti'
import { THEMES, type ThemeId } from '@/lib/themes'

const THEME_ORDER: ThemeId[] = ['red', 'green', 'pink', 'white', 'tho', 'moc', 'bordeaux']

interface InvitationCoverProps {
  onOpen: () => void
}

export function InvitationCover({ onOpen }: InvitationCoverProps) {
  const [isOpening, setIsOpening] = useState(false)
  const [isClosed, setIsClosed] = useState(false)
  const [theme, setTheme] = useState<ThemeId>('bordeaux')

  useEffect(() => {
    const saved = localStorage.getItem('wedding-theme') as ThemeId | null
    const initial = saved && saved in THEMES ? saved : 'bordeaux'
    setTheme(initial)
    document.documentElement.dataset.theme = initial
  }, [])

  const cycleTheme = () => {
    const idx = THEME_ORDER.indexOf(theme)
    const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length]
    setTheme(next)
    localStorage.setItem('wedding-theme', next)
    document.documentElement.dataset.theme = next
  }

  const handleOpen = () => {
    if (isOpening) return
    setIsOpening(true)
    fireWeddingConfetti()
    window.dispatchEvent(new CustomEvent('wedding-open'))
    setTimeout(() => {
      setIsClosed(true)
      setTimeout(onOpen, 600)
    }, 1400)
  }

  const dateFormatted = WEDDING.dateShort.replace(/\//g, '.')

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center theme-cover overflow-visible p-4 transition-opacity duration-700 ${
        isClosed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Nút đổi màu - góc trên phải */}
      <button
        type="button"
        onClick={cycleTheme}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white shadow-lg border border-white/50 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label={`Đổi màu nền (hiện: ${THEMES[theme].name})`}
        title={`Đổi màu (${THEMES[theme].name})`}
      >
        <Palette className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <div className="perspective-[1200px] w-full max-w-[420px]">
        {/* Khung viền kép sang trọng */}
        <div
          className={`envelope-card cover-card relative w-full overflow-visible transition-transform duration-1000 ${
            isOpening ? 'scale-95' : 'scale-100'
          }`}
        >
          {/* Viền ngoài vàng */}
          <div className="cover-border-outer absolute -inset-[1px] rounded-[2rem] bg-gradient-to-b from-[#d4a574] via-[#e8c88a] to-[#c4956a] opacity-90" />
          {/* Viền trong - màu theo theme */}
          <div className="cover-border-inner absolute -inset-[2px] rounded-[1.5rem] m-[3px]" />
          {/* Card chính */}
          <div className="relative w-full h-full rounded-[1.25rem] overflow-hidden">
            {/* Nắp phong bì */}
            <div
              className={`envelope-flap cover-flap absolute top-0 left-0 right-0 h-28 sm:h-32 rounded-t-[1.25rem] rounded-b-[2rem] origin-bottom transition-transform duration-[1200ms] ease-out ${
                isOpening ? 'envelope-flap-open' : ''
              }`}
            >
              {/* Con dấu vàng sang trọng */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="cover-seal-glow absolute inset-0 rounded-full blur-xl opacity-60 scale-150" />
                  <div className="cover-seal relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-4 shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.4)]">
                    <Heart className="cover-seal-heart w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow-sm" aria-hidden />
                  </div>
                </div>
              </div>
            </div>

            {/* Nội dung thiệp */}
            <div
              className={`cover-content relative pt-16 pb-10 px-10 sm:px-12 text-center transition-transform duration-1000 ease-out rounded-b-[1.25rem] ${
                isOpening ? '-translate-y-2' : ''
              }`}
            >
              {/* Lời báo tin */}
              <p className="cover-text-announcement text-[10px] sm:text-xs uppercase tracking-[0.35em] mb-4 font-light leading-relaxed">
                {ANNOUNCEMENT}
              </p>
              {/* Tên cặp đôi */}
              <h1 className="cover-text-names font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.15em] mb-6 flex flex-nowrap items-center justify-center gap-x-3 sm:gap-x-4">
                <span className="drop-shadow-sm">{WEDDING.groomShort}</span>
                <Heart className="cover-icon-heart w-6 h-6 sm:w-7 sm:h-7 fill-current shrink-0 drop-shadow-sm" aria-hidden />
                <span className="drop-shadow-sm">{WEDDING.brideShort}</span>
              </h1>

              {/* Đường kẻ trang trí */}
              <div className="cover-divider flex items-center justify-center gap-3 mb-6">
                <span className="cover-divider-line cover-divider-left w-8 h-px opacity-70" />
                <span className="cover-divider-dot w-2 h-2 rounded-full" />
                <span className="cover-divider-line w-16 h-px opacity-80" />
                <span className="cover-divider-dot w-2 h-2 rounded-full" />
                <span className="cover-divider-line cover-divider-right w-8 h-px opacity-70" />
              </div>

              <p className="cover-text-date font-serif text-xl sm:text-2xl tracking-[0.2em] mb-2">
                {dateFormatted}
              </p>
              <p className="cover-text-invite text-xs uppercase tracking-[0.35em] mb-10 font-light">
                Trân trọng kính mời
              </p>

              {/* Nút mở thiệp */}
              <button
                type="button"
                onClick={handleOpen}
                disabled={isOpening}
                className="cover-btn w-full py-4 font-bold text-sm uppercase tracking-[0.25em] rounded-xl shadow-lg active:scale-[0.98] transition-all duration-300 disabled:opacity-90 disabled:cursor-not-allowed border"
              >
                Mở thiệp cưới
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
