'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { WEDDING, ANNOUNCEMENT } from '@/lib/constants'
import { useGuestName } from '@/hooks/use-guest-name'
import { WEDDING_OPEN_EVENT } from '@/hooks/use-background-music'
import { playGateSounds } from '@/lib/gate-sounds'

/** closed → knocking (vòng cửa gõ 3 tiếng) → opening (tiếng cồng, chữ Hỷ tách, hai cánh cổng mở) → hidden */
type Stage = 'closed' | 'knocking' | 'opening' | 'hidden'

/** Phải khớp với animation cn-knock / cn-medal-pulse (2.1s) và transition .cn-door trong globals.css */
const KNOCKS_S = [0.15, 0.85, 1.55]
const KNOCK_MS = 2100
const DOOR_OPEN_S = 3.4
const OPEN_MS = 4200
const HERO_AT_MS = 1300
const CONFETTI_AT_MS = 1800
const MUSIC_AFTER_OPEN_MS = 2800

/** Khách quay lại lần sau: bỏ màn gõ cửa, cổng mở luôn */
const OPENED_KEY = 'wedding-opened'

function takeReturningVisit() {
  try {
    const returning = localStorage.getItem(OPENED_KEY) === '1'
    localStorage.setItem(OPENED_KEY, '1')
    return returning
  } catch {
    return false
  }
}

const loadConfetti = () => import('@/lib/confetti')

function Lantern({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`cn-lantern cn-lantern-${side}`} aria-hidden>
      <span className="cn-lantern-string" />
      <span className="cn-lantern-cap" />
      <span className="cn-lantern-body">
        <span className="cn-lantern-char">囍</span>
      </span>
      <span className="cn-lantern-cap cn-lantern-cap-bottom" />
      <span className="cn-lantern-tassel" />
    </div>
  )
}

/** Câu đối dán trên hai cánh cổng: vế trên bên phải, vế dưới bên trái (khi đứng nhìn vào cổng) */
const COUPLETS = { left: '永結同心', right: '百年好合' } as const

function Door({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`cn-door cn-door-${side}`}>
      <span className="cn-door-panel">
        <span className="cn-studs" />
        <span className="cn-couplet">
          {[...COUPLETS[side]].map((char) => (
            <span key={char}>{char}</span>
          ))}
        </span>
      </span>
    </div>
  )
}

const MANE = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2
  return { cx: Math.round((50 + 35 * Math.cos(a)) * 100) / 100, cy: Math.round((46 + 35 * Math.sin(a)) * 100) / 100 }
})

/** Vòng gõ cửa: mặt sư tử đồng ngậm vòng (phô thủ) */
function Knocker({ side }: { side: 'left' | 'right' }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const gold = `${id}-gold`
  const mane = `${id}-mane`
  const ink = '#5a3a0c'
  return (
    <span className={`cn-knocker cn-knocker-${side}`} aria-hidden>
      <span className="cn-knocker-ring" />
      <svg className="cn-knocker-lion" viewBox="0 0 100 100">
        <defs>
          <radialGradient id={gold} cx="40%" cy="32%" r="75%">
            <stop offset="0" stopColor="#fff3c4" />
            <stop offset="0.45" stopColor="#e3b24f" />
            <stop offset="1" stopColor="#7a4e12" />
          </radialGradient>
          <radialGradient id={mane} cx="45%" cy="35%" r="70%">
            <stop offset="0" stopColor="#f0c868" />
            <stop offset="0.6" stopColor="#9a6a1c" />
            <stop offset="1" stopColor="#5a3a0c" />
          </radialGradient>
        </defs>
        {MANE.map((p) => (
          <circle key={`${p.cx}-${p.cy}`} cx={p.cx} cy={p.cy} r="10" fill={`url(#${mane})`} stroke={ink} strokeWidth="1" />
        ))}
        <circle cx="50" cy="46" r="34" fill={`url(#${mane})`} />
        <circle cx="50" cy="46" r="27" fill={`url(#${gold})`} stroke={ink} strokeWidth="1.5" />
        <circle cx="50" cy="29" r="2.5" fill="#fff3c4" />
        <path d="M31 38 Q39 29 47 37 M53 37 Q61 29 69 38" stroke={ink} strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="39" cy="43" r="4.5" fill="#fff6d8" stroke={ink} strokeWidth="1.5" />
        <circle cx="61" cy="43" r="4.5" fill="#fff6d8" stroke={ink} strokeWidth="1.5" />
        <circle cx="39" cy="43.5" r="2" fill="#3a2208" />
        <circle cx="61" cy="43.5" r="2" fill="#3a2208" />
        <path d="M43 52 Q50 45 57 52 Q57 58 50 59 Q43 58 43 52Z" fill="#b07a22" stroke={ink} strokeWidth="1.5" />
        <circle cx="32" cy="55" r="3.5" fill="none" stroke={ink} strokeWidth="1.2" />
        <circle cx="68" cy="55" r="3.5" fill="none" stroke={ink} strokeWidth="1.2" />
        <path d="M37 63 Q50 72 63 63" stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="44" y="63" width="12" height="9" rx="3" fill={`url(#${gold})`} stroke={ink} strokeWidth="1.5" />
      </svg>
    </span>
  )
}

function Medallion() {
  return (
    <div className="cn-medal" aria-hidden>
      {(['whole', 'left', 'right'] as const).map((part) => (
        <span key={part} className={`cn-medal-piece cn-medal-${part}`}>
          <span className="cn-medal-char">囍</span>
        </span>
      ))}
    </div>
  )
}

export function InvitationCover() {
  const [stage, setStage] = useState<Stage>('closed')
  const guestName = useGuestName()

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

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timersRef.current.forEach(clearTimeout), [])

  const later = (fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms))
  }

  const reveal = () => {
    document.documentElement.dataset.opened = 'true'
  }
  const hide = () => {
    setStage('hidden')
    window.scrollTo({ top: 0 })
  }

  const handleOpen = () => {
    if (stage !== 'closed') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const returning = takeReturningVisit()
    const knockMs = reduceMotion || returning ? 0 : KNOCK_MS
    // Âm thanh và nhạc phải được khởi động ngay trong thao tác bấm, trình duyệt mới cho phép
    if (!reduceMotion) {
      playGateSounds({ knocks: knockMs ? KNOCKS_S : [], open: knockMs / 1000, openDuration: DOOR_OPEN_S })
    }
    window.dispatchEvent(
      new CustomEvent(WEDDING_OPEN_EVENT, {
        detail: { delayMs: reduceMotion ? 0 : knockMs + MUSIC_AFTER_OPEN_MS },
      }),
    )

    const startOpening = () => {
      setStage('opening')
      later(reveal, reduceMotion ? 0 : HERO_AT_MS)
      later(() => loadConfetti().then((m) => m.fireOpeningCelebration()), reduceMotion ? 0 : CONFETTI_AT_MS)
      later(hide, reduceMotion ? 0 : OPEN_MS)
    }
    if (knockMs) {
      setStage('knocking')
      later(startOpening, knockMs)
    } else {
      startOpening()
    }
  }

  if (stage === 'hidden') return null

  const dateFormatted = WEDDING.dateShort.replace(/\//g, '.')

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cover-title"
      data-stage={stage}
      className="cover-root cn-cover fixed inset-0 z-[100]"
    >
      <div className="cn-gate" aria-hidden>
        <Door side="left" />
        <Door side="right" />
      </div>
      <div className="cn-light" aria-hidden />
      <div className="cn-roof" aria-hidden>
        <span className="cn-roof-beam" />
        <span className="cn-roof-tiles" />
      </div>

      <Lantern side="left" />
      <Lantern side="right" />

      <div className="absolute inset-0 overflow-y-auto">
        <div className="cn-content min-h-full flex flex-col items-center justify-center px-5 py-24 sm:py-28 text-center">
          <p className="cn-fade cn-sub text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-4 max-w-[17rem] sm:max-w-sm leading-relaxed">
            {ANNOUNCEMENT}
          </p>

          <div className="cn-fade cn-plaque mb-7 sm:mb-9">
            <h2
              id="cover-title"
              className="font-serif text-[1.65rem] sm:text-4xl font-bold flex flex-nowrap items-center justify-center gap-x-2 sm:gap-x-3"
            >
              <span className="cn-names whitespace-nowrap">{WEDDING.groomShort}</span>
              <span className="cn-names cn-amp" aria-hidden>
                &
              </span>
              <span className="sr-only">và</span>
              <span className="cn-names whitespace-nowrap">{WEDDING.brideShort}</span>
            </h2>
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-7 sm:mb-9">
            <Knocker side="left" />
            <Medallion />
            <Knocker side="right" />
          </div>

          <div className="cn-fade">
            <p className="cn-date font-serif text-xl sm:text-2xl tracking-[0.2em] mb-1">{dateFormatted}</p>
            {WEDDING.ceremony.lunarDate && (
              <p className="cn-sub text-xs italic mb-5">({WEDDING.ceremony.lunarDate})</p>
            )}

            {guestName ? (
              <div className="mb-7">
                <p className="cn-sub text-xs uppercase tracking-[0.3em] mb-1.5">Trân trọng kính mời</p>
                <p className="cn-names font-serif text-2xl sm:text-3xl break-words">{guestName}</p>
              </div>
            ) : (
              <p className="cn-sub text-xs uppercase tracking-[0.35em] mb-7">Trân trọng kính mời</p>
            )}

            <button
              type="button"
              onClick={handleOpen}
              disabled={stage !== 'closed'}
              autoFocus
              className="cn-btn relative overflow-hidden px-10 py-3.5 font-bold text-sm uppercase tracking-[0.25em] rounded-full active:scale-[0.98] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f3d27a]/80"
            >
              Mở thiệp cưới
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
