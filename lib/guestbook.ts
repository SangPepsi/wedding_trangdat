/**
 * Sổ lưu bút - lưu lời chúc vào Google Sheets qua Google Apps Script
 * Hướng dẫn cài đặt: xem scripts/guestbook-apps-script.gs
 */
const GUESTBOOK_URL = process.env.NEXT_PUBLIC_GUESTBOOK_URL

export const isGuestbookEnabled = Boolean(GUESTBOOK_URL)

/** Khi chạy dev vẫn hiện mục lưu bút (kèm hướng dẫn) để dễ cấu hình; bản production chỉ hiện khi đã có URL */
export const isGuestbookVisible = isGuestbookEnabled || process.env.NODE_ENV === 'development'

export const GUESTBOOK_LIMITS = { name: 60, message: 500 }

export interface GuestbookEntry {
  name: string
  message: string
  createdAt: string
}

function isEntry(value: unknown): value is GuestbookEntry {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return typeof v.name === 'string' && typeof v.message === 'string' && typeof v.createdAt === 'string'
}

export async function fetchGuestbook(): Promise<GuestbookEntry[]> {
  if (!GUESTBOOK_URL) return []
  const res = await fetch(GUESTBOOK_URL, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Guestbook ${res.status}`)
  const data: unknown = await res.json()
  const entries = (data as { entries?: unknown })?.entries
  return Array.isArray(entries) ? entries.filter(isEntry) : []
}

export async function postGuestbook(entry: { name: string; message: string; website?: string }) {
  if (!GUESTBOOK_URL) throw new Error('Guestbook chưa được cấu hình')
  // text/plain để trình duyệt không gửi preflight CORS - Apps Script không hỗ trợ OPTIONS
  const res = await fetch(GUESTBOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(entry),
  })
  if (!res.ok) throw new Error(`Guestbook ${res.status}`)
  const data = (await res.json()) as { ok?: boolean; error?: string }
  if (!data.ok) throw new Error(data.error || 'Gửi thất bại')
}
