'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Gift } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'
import { GIFT_QR } from '@/lib/gift'
import { WEDDING } from '@/lib/constants'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

function QRCard({
  qrPath,
  fullName,
  bankName,
  accountNumber,
  isInView,
  delay,
  onQRClick,
}: {
  qrPath: string
  fullName: string
  bankName: string
  accountNumber: string
  isInView: boolean
  delay: string
  onQRClick: () => void
}) {
  return (
    <div
      className={`theme-qr-card rounded-2xl p-6 sm:p-8 border-2 border-[#d4a574] shadow-[0_0_0_1px_rgba(255,255,255,0.2)_inset] transition-all duration-700 ease-out ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: delay }}
    >
      <div className="flex justify-center mb-4">
        <button
          type="button"
          onClick={onQRClick}
          className="relative w-36 h-36 sm:w-40 sm:h-40 bg-white rounded-lg overflow-hidden mx-auto hover:ring-2 hover:ring-[#d4a574] transition-all focus:outline-none focus:ring-2 focus:ring-[#d4a574] cursor-zoom-in p-2"
          aria-label={`Phóng to mã QR ${fullName}`}
        >
          <Image
            src={qrPath}
            alt={`QR chuyển khoản ${fullName}`}
            fill
            className="object-contain"
            sizes="160px"
          />
        </button>
      </div>
      <h3 className="text-lg font-serif font-bold text-white text-center mb-2">
        {fullName}
      </h3>
      {(bankName || accountNumber) && (
        <div className="text-center space-y-0.5 text-sm text-white/95">
          {bankName && <p className="font-medium">{bankName}</p>}
          {accountNumber && <p className="font-mono">{accountNumber}</p>}
        </div>
      )}
    </div>
  )
}

export function GiftSection() {
  const { ref, isInView } = useInView()
  const [zoomedQR, setZoomedQR] = useState<{ qrPath: string; name: string; fullName: string } | null>(null)

  return (
    <>
      <section id="hop-mung" className="py-16 sm:py-20 md:py-28 section-end" data-theme-section="end">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="section-frame-light">
            <div
              ref={ref}
              className={`text-center mb-10 sm:mb-14 transition-all duration-700 ease-out ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <div className="flex justify-center mb-3">
              <div className="gift-icon-wrap w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <Gift className="w-7 h-7 text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-red-900 mb-4">
              Hộp mừng cưới
            </h2>
            <p className="text-red-600 max-w-md mx-auto text-sm sm:text-base px-2">
              Nếu bạn muốn gửi lời chúc mừng qua chuyển khoản, vui lòng quét mã QR bên dưới. Nhấn vào mã QR để phóng to.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 p-6 sm:p-8 theme-card rounded-2xl border-wedding-gold">
            <QRCard
              qrPath={GIFT_QR.groom.qrPath}
              fullName={WEDDING.groom}
              bankName={GIFT_QR.groom.bankName}
              accountNumber={GIFT_QR.groom.accountNumber}
              isInView={isInView}
              delay="100ms"
              onQRClick={() => setZoomedQR({ qrPath: GIFT_QR.groom.qrPath, name: GIFT_QR.groom.name, fullName: WEDDING.groom })}
            />
            <QRCard
              qrPath={GIFT_QR.bride.qrPath}
              fullName={WEDDING.bride}
              bankName={GIFT_QR.bride.bankName}
              accountNumber={GIFT_QR.bride.accountNumber}
              isInView={isInView}
              delay="200ms"
              onQRClick={() => setZoomedQR({ qrPath: GIFT_QR.bride.qrPath, name: GIFT_QR.bride.name, fullName: WEDDING.bride })}
            />
          </div>
          </div>
        </div>
      </section>

      <Dialog open={zoomedQR !== null} onOpenChange={() => setZoomedQR(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-md w-full p-6 bg-white rounded-2xl [&_[data-slot=dialog-close]]:text-red-700 [&_[data-slot=dialog-close]]:bg-red-100 [&_[data-slot=dialog-close]]:hover:bg-red-200">
          <DialogTitle className="sr-only">
            {zoomedQR ? `Mã QR chuyển khoản ${zoomedQR.name}` : 'Phóng to mã QR'}
          </DialogTitle>
          {zoomedQR && (
            <div className="text-center">
              <p className="text-lg font-serif font-semibold text-red-900 mb-1">{zoomedQR.name}</p>
              <p className="text-red-700 text-sm mb-4">{zoomedQR.fullName}</p>
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto bg-white rounded-xl border-2 border-red-200 p-4">
                <Image
                  src={zoomedQR.qrPath}
                  alt={`QR chuyển khoản ${zoomedQR.name}`}
                  fill
                  className="object-contain"
                  sizes="320px"
                />
              </div>
              <p className="text-red-600 text-xs mt-4">Quét mã bằng ứng dụng ngân hàng</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
