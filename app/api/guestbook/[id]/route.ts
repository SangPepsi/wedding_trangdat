import { deleteEntry, isGuestbookConfigured, rejectIfWrongPassword } from '@/lib/guestbook-store'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isGuestbookConfigured) return Response.json({ error: 'Sổ lưu bút chưa được cấu hình' }, { status: 503 })
  try {
    const rejected = await rejectIfWrongPassword(request)
    if (rejected) return rejected
    const { id } = await params
    const removed = await deleteEntry(id)
    return removed
      ? Response.json({ ok: true })
      : Response.json({ error: 'Không tìm thấy lời chúc' }, { status: 404 })
  } catch {
    return Response.json({ error: 'Không xoá được lời chúc' }, { status: 502 })
  }
}
