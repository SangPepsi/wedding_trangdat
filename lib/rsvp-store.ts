import { allowAttempt, hashValues, pipeline } from './redis'
import { normalizePhone, RSVP_GUEST_OPTIONS, RSVP_LIMITS, VN_PHONE, type RsvpEntry } from './rsvp'

const HASH_KEY = 'rsvp:entries'
const RATE_LIMIT = { max: 5, windowSeconds: 600 }

export const allowRsvp = (ip: string) => allowAttempt(`rsvp:rate:${ip}`, RATE_LIMIT)

const oneLine = (value: unknown, max: number) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max)

/** Kiểm tra dữ liệu khách gửi lên; trả về chuỗi lỗi nếu không hợp lệ */
export function cleanRsvp(body: Record<string, unknown>): Omit<RsvpEntry, 'createdAt' | 'updatedAt'> | string {
  const name = oneLine(body.name, RSVP_LIMITS.name)
  const phone = normalizePhone(String(body.phone ?? ''))
  if (!name) return 'Vui lòng nhập họ tên'
  if (!VN_PHONE.test(phone)) return 'Số điện thoại chưa đúng'
  const attending = body.attending === true
  const side = body.side === 'bride' ? 'bride' : 'groom'
  const guests = (RSVP_GUEST_OPTIONS as readonly string[]).includes(String(body.guests)) ? String(body.guests) : '1'
  const note = String(body.note ?? '')
    .replace(/\r\n?/g, '\n')
    .trim()
    .slice(0, RSVP_LIMITS.note)
  const invite = body.invite ? oneLine(body.invite, 60) : undefined
  return { id: phone, name, phone, attending, side, guests: attending ? guests : '0', note, invite }
}

function parse(raw: string): RsvpEntry | null {
  try {
    const v = JSON.parse(raw) as RsvpEntry
    return typeof v.id === 'string' && typeof v.name === 'string' ? v : null
  } catch {
    return null
  }
}

export async function saveRsvp(input: Omit<RsvpEntry, 'createdAt' | 'updatedAt'>) {
  const [existing] = await pipeline([['HGET', HASH_KEY, input.id]])
  const now = new Date().toISOString()
  const createdAt = (typeof existing === 'string' && parse(existing)?.createdAt) || now
  const entry: RsvpEntry = { ...input, createdAt, updatedAt: now }
  await pipeline([['HSET', HASH_KEY, input.id, JSON.stringify(entry)]])
  return entry
}

export async function listRsvps(): Promise<RsvpEntry[]> {
  const [raw] = await pipeline([['HGETALL', HASH_KEY]])
  return hashValues(raw)
    .map(parse)
    .filter((e): e is RsvpEntry => e !== null)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function deleteRsvp(id: string) {
  const [removed] = await pipeline([['HDEL', HASH_KEY, id]])
  return Number(removed) > 0
}