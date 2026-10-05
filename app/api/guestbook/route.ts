import {
  addEntry,
  allowSubmission,
  cleanMessage,
  cleanName,
  clientIp,
  isGuestbookConfigured,
  listEntries,
} from '@/lib/guestbook-store'

export const dynamic = 'force-dynamic'

const notConfigured = () => Response.json({ error: 'Sổ lưu bút chưa được cấu hình' }, { status: 503 })

export async function GET() {
  if (!isGuestbookConfigured) return notConfigured()
  try {
    const entries = await listEntries()
    return Response.json({ entries })
  } catch {
    return Response.json({ error: 'Không tải được lời chúc' }, { status: 502 })
  }
}

export async function POST(request: Request) {
  if (!isGuestbookConfigured) return notConfigured()

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return Response.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 })
  }

  // Trường ẩn chống spam: người thật không bao giờ điền
  if (body.website) return Response.json({ ok: true })

  const name = cleanName(body.name)
  const message = cleanMessage(body.message)
  if (!name || !message) return Response.json({ error: 'Vui lòng nhập tên và lời chúc' }, { status: 400 })

  try {
    if (!(await allowSubmission(clientIp(request)))) {
      return Response.json({ error: 'Bạn gửi hơi nhanh, vui lòng thử lại sau ít phút' }, { status: 429 })
    }
    const entry = await addEntry(name, message)
    return Response.json({ ok: true, entry })
  } catch {
    return Response.json({ error: 'Không thể lưu lời chúc' }, { status: 502 })
  }
}
