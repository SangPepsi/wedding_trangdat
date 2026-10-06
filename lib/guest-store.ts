import { guestKey } from './guest'
import type { GuestOpens, GuestRecord } from './guests'
import { allowAttempt, hashValues, pipeline } from './redis'

const LIST_KEY = 'guests:list'
const OPENS_KEY = 'guests:opens'
const MAX_NAME = 60
const MAX_BATCH = 500
const OPEN_LIMIT = { max: 30, windowSeconds: 600 }

export const allowOpen = (ip: string) => allowAttempt(`guests:open-rate:${ip}`, OPEN_LIMIT)

function parseJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export async function listGuests(): Promise<GuestRecord[]> {
  const [list, opens] = await pipeline([
    ['HGETALL', LIST_KEY],
    ['HGETALL', OPENS_KEY],
  ])
  const openMap = new Map<string, GuestOpens>()
  if (Array.isArray(opens)) {
    for (let i = 0; i + 1 < opens.length; i += 2) {
      const value = parseJson<GuestOpens>(String(opens[i + 1]))
      if (value) openMap.set(String(opens[i]), value)
    }
  }
  return hashValues(list)
    .map((raw) => parseJson<GuestRecord>(raw))
    .filter((g): g is GuestRecord => g !== null && typeof g.key === 'string')
    .map((g) => ({ ...g, opens: openMap.get(g.key) }))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

/** Thêm khách (tên đã có thì giữ nguyên); trả về số khách mới */
export async function addGuests(names: unknown[]) {
  const now = Date.now()
  const commands = names
    .map((n) => String(n ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME))
    .filter(Boolean)
    .slice(0, MAX_BATCH)
    .map((name, i) => {
      const record: GuestRecord = { key: guestKey(name), name, createdAt: new Date(now + i).toISOString() }
      return ['HSETNX', LIST_KEY, record.key, JSON.stringify(record)]
    })
  if (commands.length === 0) return 0
  const results = await pipeline(commands)
  return results.filter((r) => Number(r) === 1).length
}

export async function deleteGuest(key: string) {
  const [removed] = await pipeline([
    ['HDEL', LIST_KEY, key],
    ['HDEL', OPENS_KEY, key],
  ])
  return Number(removed) > 0
}

/** Ghi nhận khách mở thiệp - chỉ với tên có trong danh sách khách mời */
export async function recordOpen(name: string) {
  const key = guestKey(name)
  const [exists, raw] = await pipeline([
    ['HEXISTS', LIST_KEY, key],
    ['HGET', OPENS_KEY, key],
  ])
  if (Number(exists) !== 1) return false
  const now = new Date().toISOString()
  const prev = typeof raw === 'string' ? parseJson<GuestOpens>(raw) : null
  const opens: GuestOpens = { first: prev?.first ?? now, last: now, count: (prev?.count ?? 0) + 1 }
  await pipeline([['HSET', OPENS_KEY, key, JSON.stringify(opens)]])
  return true
}
