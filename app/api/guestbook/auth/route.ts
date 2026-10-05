import { isGuestbookConfigured, rejectIfWrongPassword } from '@/lib/guestbook-store'

export async function POST(request: Request) {
  if (!isGuestbookConfigured) return Response.json({ error: 'Sổ lưu bút chưa được cấu hình' }, { status: 503 })
  try {
    return (await rejectIfWrongPassword(request)) ?? Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Không kiểm tra được mật khẩu' }, { status: 502 })
  }
}
