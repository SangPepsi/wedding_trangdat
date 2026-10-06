import { GUESTBOOK_LIMITS, type GuestbookEntry } from './guestbook'
import { allowAttempt, isRedisConfigured, pipeline } from './redis'

export { clientIp, rejectIfWrongPassword } from './redis'

const LIST_KEY = 'guestbook:entries'
const MAX_STORED = 1000
const MAX_SHOWN = 300
const RATE_LIMIT = { max: 5, windowSeconds: 600 }

export const isGuestbookConfigured = isRedisConfigured

type StoredEntry = GuestbookEntry & { id: string }

function parse(raw: unknown): StoredEntry | null {
  if (typeof raw !== 'string') return null
  try {
    const v = JSON.parse(raw) as Partial<StoredEntry>
    if (typeof v.id !== 'string' || typeof v.name !== 'string' || typeof v.message !== 'string') return null
    if (typeof v.createdAt !== 'string') return null
    return { id: v.id, name: v.name, message: v.message, createdAt: v.createdAt }
  } catch {
    return null
  }
}

export async function listEntries(): Promise<StoredEntry[]> {
  const [raw] = await pipeline([['LRANGE', LIST_KEY, 0, MAX_SHOWN - 1]])
  return Array.isArray(raw) ? raw.map(parse).filter((e): e is StoredEntry => e !== null) : []
}

export function cleanName(value: unknown) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, GUESTBOOK_LIMITS.name)
}

export function cleanMessage(value: unknown) {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, GUESTBOOK_LIMITS.message)
}

export const allowSubmission = (ip: string) => allowAttempt(`guestbook:rate:${ip}`, RATE_LIMIT)

export async function addEntry(name: string, message: string): Promise<StoredEntry> {
  const entry: StoredEntry = { id: crypto.randomUUID(), name, message, createdAt: new Date().toISOString() }
  await pipeline([
    ['LPUSH', LIST_KEY, JSON.stringify(entry)],
    ['LTRIM', LIST_KEY, 0, MAX_STORED - 1],
  ])
  return entry
}

export async function deleteEntry(id: string) {
  const [raw] = await pipeline([['LRANGE', LIST_KEY, 0, -1]])
  const match = Array.isArray(raw) ? raw.find((r) => parse(r)?.id === id) : undefined
  if (typeof match !== 'string') return false
  const [removed] = await pipeline([['LREM', LIST_KEY, 1, match]])
  return Number(removed) > 0
}
