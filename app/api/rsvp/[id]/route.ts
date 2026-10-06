import { withAdmin } from '@/lib/redis'
import { deleteRsvp } from '@/lib/rsvp-store'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAdmin(
    request,
    async () => {
      const { id } = await params
      return (await deleteRsvp(id))
        ? Response.json({ ok: true })
        : Response.json({ error: 'Không tìm thấy xác nhận' }, { status: 404 })
    },
    'Không xoá được xác nhận',
  )
}
