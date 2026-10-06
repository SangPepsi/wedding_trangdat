import { deleteGuest } from '@/lib/guest-store'
import { withAdmin } from '@/lib/redis'

export async function DELETE(request: Request, { params }: { params: Promise<{ key: string }> }) {
  return withAdmin(
    request,
    async () => {
      const { key } = await params
      return (await deleteGuest(key))
        ? Response.json({ ok: true })
        : Response.json({ error: 'Không tìm thấy khách' }, { status: 404 })
    },
    'Không xoá được khách',
  )
}
