import { timingSafeEqual } from 'node:crypto'
import { GUESTBOOK_LIMITS, type GuestbookEntry } from './guestbook'

/**
 * Lưu lời chúc trên Upstash Redis qua REST API.
 * Cài từ Vercel (Storage → Upstash Redis) sẽ tự có KV_REST_API_URL / KV_REST_API_TOKEN;
 * tạo database trực tiếp trên upstash.com thì dùng UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN.
 */
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

const LIST_KEY = 'guestbook:entries'
const MAX_STORED = 1000
const MAX_SHOWN = 300
const RATE_LIMIT = { max: 5, windowSeconds: 600 }
const AUTH_LIMIT = { max: 10, windowSeconds: 900 }

export const isGuestbookConfigured = Boolean(REDIS_URL && REDIS_TOKEN)

type RedisResult = { result?: unknown; error?: string }

async function pipeline(commands: (string | number)[][]): Promise<unknown[]> {
  if (!REDIS_URL || !REDIS_TOKEN) throw new Error('Guestbook storage is not configured')
  const res = await fetch(`${REDIS_URL.replace(/\/$/, '')}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Redis ${res.status}`)
  const results = (await res.json()) as RedisResult[]
  const failed = results.find((r) => r.error)
  if (failed) throw new Error(`Redis: ${failed.error}`)
  return results.map((r) => r.result)
}

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

/** Trả về false khi IP này đã thực hiện quá số lần cho phép trong khoảng thời gian giới hạn */
async function allowAttempt(kind: string, ip: string, limit: { max: number; windowSeconds: number }) {
  const key = `guestbook:${kind}:${ip}`
  const [count] = await pipeline([
    ['INCR', key],
    ['EXPIRE', key, limit.windowSeconds, 'NX'],
  ])
  return Number(count) <= limit.max
}

export const allowSubmission = (ip: string) => allowAttempt('rate', ip, RATE_LIMIT)

/** Chống dò mật khẩu: chỉ đếm những lần nhập sai */
export const allowWrongPassword = (ip: string) => allowAttempt('auth', ip, AUTH_LIMIT)

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

function passwordMatches(input: string | null) {
  const expected = process.env.GUESTBOOK_ADMIN_PASSWORD
  if (!expected || !input) return false
  const a = Buffer.from(input)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function clientIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

/** Trả về Response lỗi nếu không được phép, null nếu mật khẩu đúng */
export async function rejectIfWrongPassword(request: Request): Promise<Response | null> {
  if (!process.env.GUESTBOOK_ADMIN_PASSWORD) {
    return Response.json({ error: 'Chưa đặt GUESTBOOK_ADMIN_PASSWORD' }, { status: 503 })
  }
  const ip = clientIp(request)
  const locked = Response.json({ error: 'Nhập sai quá nhiều lần, thử lại sau 15 phút' }, { status: 429 })
  const [failures] = await pipeline([['GET', `guestbook:auth:${ip}`]])
  if (Number(failures) >= AUTH_LIMIT.max) return locked
  if (passwordMatches(request.headers.get('x-admin-password'))) return null
  if (!(await allowWrongPassword(ip))) return locked
  return Response.json({ error: 'Sai mật khẩu' }, { status: 401 })
}
