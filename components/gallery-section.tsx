'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { useInView } from '@/hooks/use-in-view'
import { GALLERY_IMAGES } from '@/lib/gallery'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function GallerySection() {
  const { ref, isInView } = useInView()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const goPrev = useCallback(() => {
    setSelectedIndex((i) =>
      i === null ? null : i === 0 ? GALLERY_IMAGES.length - 1 : i - 1
    )
  }, [])

  const goNext = useCallback(() => {
    setSelectedIndex((i) =>
      i === null ? null : (i + 1) % GALLERY_IMAGES.length
    )
  }, [])

  useEffect(() => {
    if (selectedIndex === null) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'Escape') setSelectedIndex(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedIndex, goPrev, goNext])

  // Swipe trên mobile
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX)
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev()
    setTouchStart(null)
  }

  return (
    <>
      <section id="khoanh-khac" className="py-16 sm:py-20 md:py-28" data-theme-section="main">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            ref={ref}
            className={`text-center mb-10 sm:mb-14 transition-all duration-700 ease-out ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-red-900">
              Khoảnh khắc đẹp
            </h2>
          </div>

          {/* Grid layout: ảnh đầu lớn hơn, các ảnh sau đều nhau */}
          <div
            className={`border-wedding-section rounded-2xl p-4 sm:p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 transition-all duration-700 ease-out ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {/* Ảnh đầu - chiếm 2 cột trên desktop */}
            <button
              type="button"
              onClick={() => setSelectedIndex(0)}
              className="col-span-2 row-span-2 relative aspect-square md:aspect-auto md:min-h-[320px] rounded-xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:ring-offset-2 border-2 border-white/40 ring-1 ring-[#d4a574]/30"
              style={{ transitionDelay: '0ms' }}
            >
              <Image
                src={GALLERY_IMAGES[0].src}
                alt={GALLERY_IMAGES[0].alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Các ảnh còn lại */}
            {GALLERY_IMAGES.slice(1).map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setSelectedIndex(index + 1)}
                className={`relative aspect-square rounded-xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:ring-offset-2 border-2 border-white/40 ring-1 ring-[#d4a574]/30 ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${(index + 1) * 50}ms` }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl w-full p-0 overflow-hidden border-0 bg-black rounded-lg gap-0 [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:bg-white/20 [&_[data-slot=dialog-close]]:hover:bg-white/30 [&_[data-slot=dialog-close]]:top-2 [&_[data-slot=dialog-close]]:right-2">
          <DialogTitle className="sr-only">
            {selectedIndex !== null ? GALLERY_IMAGES[selectedIndex].alt : 'Xem ảnh'}
          </DialogTitle>
          {selectedIndex !== null && (
            <div
              className="relative w-full min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center select-none touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div className="relative w-full h-[50vh] sm:h-[60vh]">
                <Image
                  src={GALLERY_IMAGES[selectedIndex].src}
                  alt={GALLERY_IMAGES[selectedIndex].alt}
                  fill
                  className="object-contain"
                  sizes="95vw"
                />
              </div>

              {/* Nút prev/next */}
              {GALLERY_IMAGES.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goPrev() }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors touch-manipulation"
                    aria-label="Ảnh trước"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goNext() }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors touch-manipulation"
                    aria-label="Ảnh sau"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/50 text-white text-sm font-medium">
                {selectedIndex + 1} / {GALLERY_IMAGES.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
