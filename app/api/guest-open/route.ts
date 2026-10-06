import { allowOpen, recordOpen } from '@/lib/guest-store'
import { clientIp, isRedisConfigured, notConfigured } from '@/lib/redis'

export async function POST(request: Request) {
  if (!isRedisConfigured) return notConfigured()
  const body = (await request.json().catch(() => ({}))) as { name?: unknown }
  const name = typeof body.name === 'string' ? body.name : ''
  if (!name.trim()) return Response.json({ error: 'Thiếu tên' }, { status: 400 })
  try {
    if (!(await allowOpen(clientIp(request)))) return Response.json({ ok: false }, { status: 429 })
    return Response.json({ ok: await recordOpen(name) })
  } catch {
    return Response.json({ error: 'Không ghi nhận được' }, { status: 502 })
  }
}
