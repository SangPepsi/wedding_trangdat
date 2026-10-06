import { clientIp, isRedisConfigured, notConfigured, withAdmin } from '@/lib/redis'
import { allowRsvp, cleanRsvp, listRsvps, saveRsvp } from '@/lib/rsvp-store'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  return withAdmin(request, async () => Response.json({ entries: await listRsvps() }), 'Không tải được danh sách')
}

export async function POST(request: Request) {
  if (!isRedisConfigured) return notConfigured()

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return Response.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 })
  }

  // Trường ẩn chống spam: người thật không bao giờ điền
  if (body._gotcha) return Response.json({ ok: true })

  const input = cleanRsvp(body)
  if (typeof input === 'string') return Response.json({ error: input }, { status: 400 })

  try {
    if (!(await allowRsvp(clientIp(request)))) {
      return Response.json({ error: 'Bạn gửi hơi nhanh, vui lòng thử lại sau ít phút' }, { status: 429 })
    }
    await saveRsvp(input)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Không thể lưu xác nhận' }, { status: 502 })
  }
}
