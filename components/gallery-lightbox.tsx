'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react'
import type { GalleryImage } from '@/lib/gallery'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { SlideProgress } from './gallery-progress'

const LIGHTBOX_INTERVAL = 4000

interface GalleryLightboxProps {
  images: GalleryImage[]
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
}

export function GalleryLightbox({ images, index, onIndexChange, onClose }: GalleryLightboxProps) {
  const total = images.length
  const [playing, setPlaying] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const thumbsRef = useRef<HTMLDivElement>(null)
  const open = index !== null
  const current = index === null ? null : images[index]

  const goPrev = () => index !== null && onIndexChange((index - 1 + total) % total)
  const goNext = () => index !== null && onIndexChange((index + 1) % total)

  useEffect(() => {
    if (index === null) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onIndexChange((index - 1 + total) % total)
      if (e.key === 'ArrowRight') onIndexChange((index + 1) % total)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [index, total, onIndexChange])

  useEffect(() => {
    const strip = thumbsRef.current
    const thumb = strip?.querySelector<HTMLElement>(`[data-index="${index}"]`)
    if (!strip || !thumb) return
    strip.scrollTo({ left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2, behavior: 'smooth' })
  }, [index])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext()
      else goPrev()
    }
    touchStartX.current = null
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setPlaying(false)
          onClose()
        }
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        showCloseButton={false}
        className="top-0 left-0 translate-x-0 translate-y-0 w-screen max-w-none sm:max-w-none h-[100svh] rounded-none border-0 bg-black/95 backdrop-blur-md p-0 gap-0 flex flex-col text-white"
      >
        <DialogTitle className="sr-only">{current?.alt ?? 'Xem ảnh'}</DialogTitle>

        {total > 1 && index !== null && (
          <div className="absolute top-0 inset-x-0 h-0.5 bg-white/10 z-10" aria-hidden>
            {playing && (
              <SlideProgress
                slideKey={index}
                duration={LIGHTBOX_INTERVAL}
                running
                onDone={goNext}
                className="bg-w-gold"
              />
            )}
          </div>
        )}

        <div className="flex items-center justify-between px-4 sm:px-6 h-14 shrink-0">
          <span className="text-sm font-medium tracking-[0.2em] tabular-nums text-white/80" aria-live="polite">
            {index !== null && `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}
          </span>
          <div className="flex items-center gap-2">
            {total > 1 && (
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="gallery-icon-btn"
                aria-label={playing ? 'Dừng trình chiếu' : 'Trình chiếu tự động'}
                aria-pressed={playing}
              >
                {playing ? <Pause className="w-4 h-4" aria-hidden /> : <Play className="w-4 h-4" aria-hidden />}
              </button>
            )}
            <DialogClose className="gallery-icon-btn" aria-label="Đóng">
              <X className="w-5 h-5" aria-hidden />
            </DialogClose>
          </div>
        </div>

        {current && index !== null && (
          <div
            className="relative flex-1 min-h-0 select-none touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div key={index} className="gallery-lightbox-slide absolute inset-0 sm:inset-x-20">
              <Image src={current.src} alt={current.alt} fill className="object-contain" sizes="100vw" />
            </div>
            {current.caption && (
              <p className="absolute bottom-3 inset-x-0 text-center font-serif text-2xl sm:text-3xl text-white drop-shadow-lg px-6">
                {current.caption}
              </p>
            )}

            {total > 1 && (
              <>
                <button type="button" onClick={goPrev} className="gallery-nav left-2 sm:left-5" aria-label="Ảnh trước">
                  <ChevronLeft className="w-6 h-6" aria-hidden />
                </button>
                <button type="button" onClick={goNext} className="gallery-nav right-2 sm:right-5" aria-label="Ảnh sau">
                  <ChevronRight className="w-6 h-6" aria-hidden />
                </button>
              </>
            )}
          </div>
        )}

        {total > 1 && (
          <div ref={thumbsRef} className="gallery-strip shrink-0 flex gap-2 overflow-x-auto px-4 py-4">
            {images.map((image, i) => (
              <button
                key={image.src + i}
                type="button"
                data-index={i}
                onClick={() => onIndexChange(i)}
                className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all first:ml-auto last:mr-auto ${
                  i === index ? 'ring-2 ring-w-gold opacity-100' : 'opacity-40 hover:opacity-80'
                }`}
                aria-label={`Ảnh ${i + 1}`}
                aria-current={i === index}
              >
                <Image src={image.src} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
