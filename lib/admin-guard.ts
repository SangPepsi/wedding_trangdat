import { NextResponse } from 'next/server'

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]'])

/**
 * Trang quản trị chỉ hoạt động khi chạy npm run dev trên chính máy này:
 * bản deploy (production) và máy khác trong mạng LAN đều bị từ chối
 */
export function isAdminAllowed(host: string | null) {
  if (process.env.NODE_ENV !== 'development') return false
  const hostname = (host ?? '').replace(/:\d+$/, '')
  return LOCAL_HOSTS.has(hostname)
}

/** Trang web lạ mở trong cùng trình duyệt có thể gửi form tới localhost, nên kiểm tra cả Origin */
function isLocalOrigin(origin: string | null) {
  if (!origin) return true
  try {
    return LOCAL_HOSTS.has(new URL(origin).hostname) || new URL(origin).hostname === '::1'
  } catch {
    return false
  }
}

export function rejectIfNotAdmin(request: Request) {
  if (isAdminAllowed(request.headers.get('host')) && isLocalOrigin(request.headers.get('origin'))) return null
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
