/** Đọc JSON từ API nội bộ, ném lỗi kèm thông báo tiếng Việt do server trả về */
export async function readJson<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) throw Object.assign(new Error(data.error || `Lỗi ${res.status}`), { status: res.status })
  return data
}

export const adminHeaders = (password: string) => ({ 'x-admin-password': password })
