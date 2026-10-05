import { mkdir, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { NextResponse } from 'next/server'
import { rejectIfNotAdmin } from '@/lib/admin-guard'

export const dynamic = 'force-dynamic'

const FOLDERS = {
  gallery: { exts: ['.jpg', '.jpeg', '.png', '.webp'], maxMB: 15 },
  qrcode: { exts: ['.jpg', '.jpeg', '.png', '.webp'], maxMB: 5 },
  music: { exts: ['.mp3', '.m4a', '.ogg'], maxMB: 20 },
} as const

type Folder = keyof typeof FOLDERS

/** Tên file không dấu, không khoảng trắng; thêm hậu tố để không ghi đè ảnh cũ (tránh bộ nhớ đệm ảnh cũ) */
function safeName(original: string, ext: string) {
  const base = original
    .slice(0, original.length - ext.length)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return `${base || 'file'}-${Date.now().toString(36)}${ext}`
}

export async function POST(request: Request) {
  const rejected = rejectIfNotAdmin(request)
  if (rejected) return rejected

  const form = await request.formData()
  const folder = form.get('folder')
  if (typeof folder !== 'string' || !(folder in FOLDERS)) {
    return NextResponse.json({ error: 'Thư mục không hợp lệ' }, { status: 400 })
  }
  const rule = FOLDERS[folder as Folder]

  const saved: string[] = []
  for (const file of form.getAll('files')) {
    if (!(file instanceof File)) continue
    const ext = extname(file.name).toLowerCase()
    if (!(rule.exts as readonly string[]).includes(ext)) {
      return NextResponse.json({ error: `${file.name}: chỉ nhận ${rule.exts.join(', ')}` }, { status: 400 })
    }
    if (file.size > rule.maxMB * 1024 * 1024) {
      return NextResponse.json({ error: `${file.name}: quá ${rule.maxMB} MB` }, { status: 400 })
    }
    const dir = join(process.cwd(), 'public', folder)
    await mkdir(dir, { recursive: true })
    const name = safeName(file.name, ext)
    await writeFile(join(dir, name), Buffer.from(await file.arrayBuffer()))
    saved.push(`/${folder}/${name}`)
  }

  if (saved.length === 0) return NextResponse.json({ error: 'Chưa chọn file' }, { status: 400 })
  return NextResponse.json({ paths: saved })
}
