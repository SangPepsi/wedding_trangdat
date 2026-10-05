'use client'

import { useCallback, useEffect, useState } from 'react'
import { LogOut, RefreshCw, Trash2 } from 'lucide-react'
import {
  deleteGuestbookEntry,
  fetchGuestbook,
  verifyGuestbookPassword,
  type GuestbookEntry,
} from '@/lib/guestbook'

const PASSWORD_KEY = 'guestbook-admin-password'

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function errorText(err: unknown) {
  return err instanceof Error ? err.message : 'Có lỗi xảy ra'
}

export function GuestbookManager() {
  const [password, setPassword] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [checking, setChecking] = useState(false)
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setEntries(await fetchGuestbook())
    } catch (err) {
      setError(errorText(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const saved = sessionStorage.getItem(PASSWORD_KEY)
    if (!saved) return
    verifyGuestbookPassword(saved)
      .then(() => {
        setPassword(saved)
        return load()
      })
      .catch(() => sessionStorage.removeItem(PASSWORD_KEY))
  }, [load])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setChecking(true)
    setError('')
    try {
      await verifyGuestbookPassword(input)
      sessionStorage.setItem(PASSWORD_KEY, input)
      setPassword(input)
      setInput('')
      await load()
    } catch (err) {
      setError(errorText(err))
    } finally {
      setChecking(false)
    }
  }

  const logout = () => {
    sessionStorage.removeItem(PASSWORD_KEY)
    setPassword(null)
    setEntries([])
  }

  const remove = async (entry: GuestbookEntry) => {
    if (!entry.id || !password) return
    if (!window.confirm(`Xoá lời chúc của "${entry.name}"?`)) return
    setDeletingId(entry.id)
    setError('')
    try {
      await deleteGuestbookEntry(entry.id, password)
      setEntries((prev) => prev.filter((e) => e.id !== entry.id))
    } catch (err) {
      setError(errorText(err))
    } finally {
      setDeletingId(null)
    }
  }

  if (!password) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <form onSubmit={login} className="card-wedding rounded-2xl p-6 sm:p-8 w-full max-w-sm space-y-4">
          <h1 className="font-serif text-3xl text-w-strong text-center">Quản lý lời chúc</h1>
          <label htmlFor="gb-admin-pass" className="block text-sm font-medium text-w-text">
            Mật khẩu
          </label>
          <input
            id="gb-admin-pass"
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
            autoFocus
            autoComplete="current-password"
            className="field-wedding"
          />
          {error && (
            <p className="error-wedding text-center" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={checking}
            className="w-full bg-w-btn hover:bg-w-btn-hover text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-70"
          >
            {checking ? 'Đang kiểm tra...' : 'Đăng nhập'}
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-serif text-3xl sm:text-4xl text-w-strong">Quản lý lời chúc</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-w-gold/40 px-3 py-2 text-sm text-w-text hover:bg-w-tint transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden />
            Tải lại
          </button>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-w-gold/40 px-3 py-2 text-sm text-w-text hover:bg-w-tint transition-colors"
          >
            <LogOut className="w-4 h-4" aria-hidden />
            Thoát
          </button>
        </div>
      </div>

      <p className="text-sm text-w-muted mb-4">
        {entries.length} lời chúc · Xoá xong khách tải lại trang thiệp là không còn thấy.
      </p>

      {error && (
        <p className="error-wedding mb-4" role="alert">
          {error}
        </p>
      )}

      {!loading && entries.length === 0 && !error && (
        <p className="card-wedding rounded-2xl p-8 text-center text-w-muted">Chưa có lời chúc nào.</p>
      )}

      <ul className="space-y-3">
        {entries.map((entry, i) => (
          <li key={entry.id ?? i} className="card-wedding rounded-2xl p-4 sm:p-5 flex gap-4 items-start">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-w-strong break-words">{entry.name}</p>
              <p className="text-xs text-w-muted mb-2">{dateFormatter.format(new Date(entry.createdAt))}</p>
              <p className="text-w-text whitespace-pre-line break-words">{entry.message}</p>
            </div>
            <button
              type="button"
              onClick={() => remove(entry)}
              disabled={!entry.id || deletingId === entry.id}
              aria-label={`Xoá lời chúc của ${entry.name}`}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-sm font-medium transition-colors disabled:opacity-60"
            >
              <Trash2 className="w-4 h-4" aria-hidden />
              {deletingId === entry.id ? 'Đang xoá...' : 'Xoá'}
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
