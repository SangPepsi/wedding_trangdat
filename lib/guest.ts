const MAX_GUEST_NAME_LENGTH = 60

/** Tên khách mời từ link dạng ?to=Anh%20Minh - dùng để cá nhân hóa thiệp */
export function readGuestName(search: string): string | null {
  const raw = new URLSearchParams(search).get('to')
  if (!raw) return null
  const name = raw.replace(/\s+/g, ' ').trim().slice(0, MAX_GUEST_NAME_LENGTH)
  return name || null
}
