import Image from 'next/image'
import { HERO_IMAGE, WEDDING } from '@/lib/constants'
import { getPublicImageSize } from '@/lib/image-size'

/** Ảnh ngang hơn tỉ lệ này thì hiện trọn ảnh thay vì cắt cho đầy khung */
const LANDSCAPE_RATIO = 1.15
const SIZES = '(min-width: 896px) 380px, (min-width: 768px) 45vw, 92vw'

export function HeroPhoto({ className = '' }: { className?: string }) {
  const size = getPublicImageSize(HERO_IMAGE.src)
  const isLandscape = size ? size.width / size.height > LANDSCAPE_RATIO : false
  const alt = `Ảnh cưới ${WEDDING.groomShort} và ${WEDDING.brideShort}`

  return (
    <div className={`invite-photo-window ${className}`}>
      {isLandscape ? (
        <>
          <Image src={HERO_IMAGE.src} alt="" aria-hidden fill priority sizes={SIZES} className="invite-photo-backdrop" />
          <Image src={HERO_IMAGE.src} alt={alt} fill priority sizes={SIZES} className="object-contain" />
        </>
      ) : (
        <Image
          src={HERO_IMAGE.src}
          alt={alt}
          fill
          priority
          sizes={SIZES}
          className="object-cover"
          style={{ objectPosition: HERO_IMAGE.focus }}
        />
      )}
    </div>
  )
}
