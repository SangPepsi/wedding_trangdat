import { addGuests, listGuests } from '@/lib/guest-store'
import { withAdmin } from '@/lib/redis'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  return withAdmin(request, async () => Response.json({ guests: await listGuests() }), 'Không tải được danh sách khách')
}

export async function POST(request: Request) {
  return withAdmin(
    request,
    async () => {
      const body = (await request.json().catch(() => ({}))) as { names?: unknown }
      if (!Array.isArray(body.names)) return Response.json({ error: 'Thiếu danh sách tên' }, { status: 400 })
      return Response.json({ added: await addGuests(body.names) })
    },
    'Không lưu được danh sách khách',
  )
}
