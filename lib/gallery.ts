/**
 * Ảnh album - sửa trong content/wedding.json hoặc trang /admin (thứ tự trong mảng = thứ tự trình chiếu)
 * - alt: mô tả ảnh cho trình đọc màn hình
 * - caption (tuỳ chọn): dòng chữ hiện trên ảnh khi trình chiếu
 */
import { CONTENT } from './content'

export interface GalleryImage {
  src: string
  alt: string
  caption?: string
}

export const GALLERY_IMAGES: GalleryImage[] = CONTENT.gallery.map((g) => ({
  src: g.src,
  alt: g.alt,
  caption: g.caption || undefined,
}))
