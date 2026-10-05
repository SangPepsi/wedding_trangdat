import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export interface ImageSize {
  width: number
  height: number
}

function jpegSize(b: Buffer): ImageSize | null {
  let offset = 2
  while (offset + 9 < b.length) {
    if (b[offset] !== 0xff) return null
    const marker = b[offset + 1]
    const isFrame = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
    if (isFrame) return { height: b.readUInt16BE(offset + 5), width: b.readUInt16BE(offset + 7) }
    offset += 2 + b.readUInt16BE(offset + 2)
  }
  return null
}

function webpSize(b: Buffer): ImageSize | null {
  const chunk = b.toString('ascii', 12, 16)
  if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff }
  if (chunk === 'VP8L') {
    const bits = b.readUInt32LE(21)
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
  }
  if (chunk === 'VP8X') return { width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 }
  return null
}

/** Đọc kích thước ảnh JPG/PNG/WebP trong thư mục public (đường dẫn dạng '/gallery/a.jpg') */
export function getPublicImageSize(publicPath: string): ImageSize | null {
  try {
    const b = readFileSync(join(process.cwd(), 'public', publicPath))
    if (b[0] === 0xff && b[1] === 0xd8) return jpegSize(b)
    if (b.toString('ascii', 1, 4) === 'PNG') return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) }
    if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') return webpSize(b)
    return null
  } catch {
    return null
  }
}
