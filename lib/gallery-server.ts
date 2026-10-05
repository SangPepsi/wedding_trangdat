import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { GALLERY_IMAGES, type GalleryImage } from './gallery'
import { getPublicImageSize } from './image-size'

/** Bỏ ảnh đã bị xoá khỏi thư mục public và kèm tỉ lệ khung để album chọn cách hiển thị */
export function getGalleryImages(): GalleryImage[] {
  return GALLERY_IMAGES.flatMap((image) => {
    if (!existsSync(join(process.cwd(), 'public', image.src))) return []
    const size = getPublicImageSize(image.src)
    return [{ ...image, ratio: size ? size.width / size.height : undefined }]
  })
}
