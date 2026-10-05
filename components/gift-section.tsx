'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Check, Copy, Gift, Hand, RotateCcw } from 'lucide-react'
import { GIFT_QR } from '@/lib/gift'
import { WEDDING } from '@/lib/constants'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'

type GiftAccount = (typeof GIFT_QR)[keyof typeof GIFT_QR]
type EnvelopeStage = 'closed' | 'opening' | 'open'

/** Thời gian nắp lật + thiệp trượt lên trước khi hiện thẻ QR (khớp với transition trong globals.css) */
const OPEN_DURATION = 1150

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Trình duyệt trong app Zalo/Messenger cũ không có Clipboard API
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  }
}

function CopyAccountButton({ accountNumber }: { accountNumber: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleCopy = async () => {
    if (!(await copyText(accountNumber.replace(/\s/g, '')))) return
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-w-line bg-w-tint px-3 py-1.5 text-xs font-medium text-w-strong hover:border-w-line-strong transition-colors"
      aria-live="polite"
    >
      {copied ? <Check className="w-3.5 h-3.5" aria-hidden /> : <Copy className="w-3.5 h-3.5" aria-hidden />}
      {copied ? 'Đã sao chép' : 'Sao chép số tài khoản'}
    </button>
  )
}

function GiftEnvelope({
  account,
  fullName,
  shortName,
  delay,
  onQRClick,
}: {
  account: GiftAccount
  fullName: string
  shortName: string
  delay: number
  onQRClick: () => void
}) {
  const [stage, setStage] = useState<EnvelopeStage>('closed')
  const envelopeRef = useRef<HTMLButtonElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const shouldFocusCard = useRef(false)

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    if (stage === 'open' && shouldFocusCard.current) {
      shouldFocusCard.current = false
      cardRef.current?.focus({ preventScroll: true })
    }
  }, [stage])

  const handleOpen = () => {
    if (stage !== 'closed') return
    shouldFocusCard.current = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStage('open')
      return
    }
    setStage('opening')
    const rect = envelopeRef.current?.getBoundingClientRect()
    timer.current = setTimeout(() => {
      setStage('open')
      if (rect) {
        const x = (rect.left + rect.width / 2) / window.innerWidth
        const y = (rect.top + rect.height * 0.3) / window.innerHeight
        import('@/lib/confetti').then(({ fireGiftBurst }) => fireGiftBurst(x, y))
      }
    }, OPEN_DURATION)
  }

  return (
    <Reveal delay={delay} className="flex flex-col items-center">
      {stage !== 'open' ? (
        <div className="w-full flex flex-col items-center pt-10 sm:pt-12">
          <button
            ref={envelopeRef}
            type="button"
            onClick={handleOpen}
            disabled={stage === 'opening'}
            className={`gift-env ${stage === 'opening' ? 'is-open' : ''}`}
            aria-label={`Mở phong bì mừng cưới ${account.name.toLowerCase()} ${fullName} để xem mã QR`}
          >
            <span className="gift-env-back" aria-hidden />
            <span className="gift-env-letter" aria-hidden>
              <span className="gift-env-letter-mark">囍</span>
              <span className="gift-env-letter-text">Mã QR mừng cưới</span>
            </span>
            <span className="gift-env-pocket" aria-hidden>
              <span className="gift-env-title">Mừng cưới</span>
              <span className="gift-env-name">
                {account.name} · {shortName}
              </span>
            </span>
            <span className="gift-env-flap" aria-hidden />
            <span className="gift-env-seal" aria-hidden>
              囍
            </span>
          </button>
          <p
            className={`mt-5 inline-flex items-center gap-1.5 text-sm text-w-muted transition-opacity ${
              stage === 'opening' ? 'opacity-0' : ''
            }`}
          >
            <Hand className="w-4 h-4 gift-hint-icon" aria-hidden />
            Chạm vào phong bì để mở
          </p>
        </div>
      ) : (
        <div
          ref={cardRef}
          tabIndex={-1}
          className="gift-reveal w-full bg-w-qr rounded-2xl p-6 sm:p-8 border-2 border-w-gold text-center focus:outline-none"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-w-muted mb-3">{account.name}</p>
          <button
            type="button"
            onClick={onQRClick}
            className="relative block w-40 h-40 bg-white rounded-lg overflow-hidden mx-auto mb-4 p-2 hover:ring-2 hover:ring-w-gold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-w-gold cursor-zoom-in"
            aria-label={`Phóng to mã QR của ${fullName}`}
          >
            <Image
              src={account.qrPath}
              alt={`Mã QR chuyển khoản của ${fullName}`}
              fill
              className="object-contain"
              sizes="160px"
            />
          </button>
          <h3 className="text-lg font-semibold text-w-strong mb-2">{fullName}</h3>
          <div className="space-y-0.5 text-sm text-w-text">
            {account.bankName && <p className="font-medium">{account.bankName}</p>}
            {account.accountNumber && <p className="font-mono text-base tracking-wider">{account.accountNumber}</p>}
            {account.accountName && <p className="text-xs uppercase text-w-muted">{account.accountName}</p>}
          </div>
          {account.accountNumber && <CopyAccountButton accountNumber={account.accountNumber} />}
          <div>
            <button
              type="button"
              onClick={() => setStage('closed')}
              className="mt-4 inline-flex items-center gap-1 text-xs text-w-muted hover:text-w-strong underline-offset-2 hover:underline"
            >
              <RotateCcw className="w-3 h-3" aria-hidden />
              Gói lại phong bì
            </button>
          </div>
        </div>
      )}
    </Reveal>
  )
}

export function GiftSection() {
  const [zoomed, setZoomed] = useState<{ account: GiftAccount; fullName: string } | null>(null)

  return (
    <>
      <section id="hop-mung" className="py-16 sm:py-20 md:py-28 scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="section-frame">
            <SectionHeading
              icon={<Gift className="w-7 h-7" aria-hidden />}
              description="Nếu bạn muốn gửi lời chúc mừng qua chuyển khoản, hãy mở phong bì để xem mã QR và số tài khoản."
            >
              Hộp mừng cưới
            </SectionHeading>

            <div className="grid md:grid-cols-2 gap-10 sm:gap-8 items-start">
              <GiftEnvelope
                account={GIFT_QR.groom}
                fullName={WEDDING.groom}
                shortName={WEDDING.groomShort}
                delay={100}
                onQRClick={() => setZoomed({ account: GIFT_QR.groom, fullName: WEDDING.groom })}
              />
              <GiftEnvelope
                account={GIFT_QR.bride}
                fullName={WEDDING.bride}
                shortName={WEDDING.brideShort}
                delay={200}
                onQRClick={() => setZoomed({ account: GIFT_QR.bride, fullName: WEDDING.bride })}
              />
            </div>
          </div>
        </div>
      </section>

      <Dialog open={zoomed !== null} onOpenChange={(open) => !open && setZoomed(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-md w-full p-6 bg-white text-stone-900 rounded-2xl">
          <DialogTitle className="text-lg font-serif font-semibold text-center">
            {zoomed ? `${zoomed.account.name} - ${zoomed.fullName}` : 'Mã QR'}
          </DialogTitle>
          {zoomed && (
            <div className="text-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto bg-white rounded-xl border-2 border-stone-200 p-4">
                <Image
                  src={zoomed.account.qrPath}
                  alt={`Mã QR chuyển khoản của ${zoomed.fullName}`}
                  fill
                  className="object-contain"
                  sizes="320px"
                />
              </div>
              <DialogDescription className="text-stone-600 text-sm mt-4">
                {zoomed.account.bankName} · <span className="font-mono">{zoomed.account.accountNumber}</span>
                <br />
                Quét mã bằng ứng dụng ngân hàng
              </DialogDescription>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
