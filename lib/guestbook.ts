/**
 * Sổ lưu bút - lời chúc lưu trên Upstash Redis qua API /api/guestbook
 * Phần lưu trữ phía server: lib/guestbook-store.ts
 */
export const GUESTBOOK_LIMITS = { name: 60, message: 500 }

export interface GuestbookEntry {
  id?: string
  name: string
  message: string
  createdAt: string
}

async function readJson<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) throw new Error(data.error || `Guestbook ${res.status}`)
  return data
}

export async function fetchGuestbook(): Promise<GuestbookEntry[]> {
  const res = await fetch('/api/guestbook', { cache: 'no-store' })
  const data = await readJson<{ entries?: GuestbookEntry[] }>(res)
  return Array.isArray(data.entries) ? data.entries : []
}

export async function postGuestbook(entry: { name: string; message: string; website?: string }) {
  const res = await fetch('/api/guestbook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  })
  const data = await readJson<{ entry?: GuestbookEntry }>(res)
  return data.entry
}

export async function deleteGuestbookEntry(id: string, password: string) {
  const res = await fetch(`/api/guestbook/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'x-admin-password': password },
  })
  await readJson(res)
}

export async function verifyGuestbookPassword(password: string) {
  const res = await fetch('/api/guestbook/auth', { method: 'POST', headers: { 'x-admin-password': password } })
  await readJson(res)
}
