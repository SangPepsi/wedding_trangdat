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
  /** Vị trí giữ lại khi ảnh bị cắt cho vừa khung, ví dụ "50% 80%" */
  focus?: string
  /** Rộng / cao, đọc từ file ảnh phía server (lib/gallery-server.ts) */
  ratio?: number
}

export const GALLERY_IMAGES: GalleryImage[] = CONTENT.gallery.map((g) => ({
  src: g.src,
  alt: g.alt,
  caption: g.caption || undefined,
  focus: g.focus || undefined,
}))
