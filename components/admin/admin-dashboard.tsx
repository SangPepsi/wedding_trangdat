'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { LogOut } from 'lucide-react'
import { verifyGuestbookPassword } from '@/lib/guestbook'
import { GuestbookPanel } from './guestbook-panel'
import { GuestsPanel } from './guests-panel'
import { RsvpPanel } from './rsvp-panel'
import { BTN, errorText } from './shared'

const PASSWORD_KEY = 'guestbook-admin-password'

const TABS = [
  { id: 'xac-nhan', label: 'Xác nhận tham dự' },
  { id: 'khach-moi', label: 'Khách mời' },
  { id: 'loi-chuc', label: 'Lời chúc' },
] as const
type Tab = (typeof TABS)[number]['id']

const noopSubscribe = () => () => {}
const isTab = (v: string | null): v is Tab => TABS.some((t) => t.id === v)

export function AdminDashboard() {
  const urlTab = useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get('tab'),
    () => null,
  )
  const [pickedTab, setPickedTab] = useState<Tab | null>(null)
  const tab: Tab = pickedTab ?? (isTab(urlTab) ? urlTab : 'xac-nhan')

  const [password, setPassword] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = sessionStorage.getItem(PASSWORD_KEY)
    if (!saved) return
    verifyGuestbookPassword(saved)
      .then(() => setPassword(saved))
      .catch(() => sessionStorage.removeItem(PASSWORD_KEY))
  }, [])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setChecking(true)
    setError('')
    try {
      await verifyGuestbookPassword(input)
      sessionStorage.setItem(PASSWORD_KEY, input)
      setPassword(input)
      setInput('')
    } catch (err) {
      setError(errorText(err))
    } finally {
      setChecking(false)
    }
  }

  const logout = () => {
    sessionStorage.removeItem(PASSWORD_KEY)
    setPassword(null)
  }

  const selectTab = (id: Tab) => {
    setPickedTab(id)
    window.history.replaceState(null, '', `?tab=${id}`)
  }

  if (!password) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <form onSubmit={login} className="card-wedding rounded-2xl p-6 sm:p-8 w-full max-w-sm space-y-4">
          <h1 className="font-serif text-3xl text-w-strong text-center">Trang quản lý</h1>
          <label htmlFor="admin-pass" className="block text-sm font-medium text-w-text">
            Mật khẩu
          </label>
          <input
            id="admin-pass"
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
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="font-serif text-3xl sm:text-4xl text-w-strong">Trang quản lý</h1>
        <button type="button" onClick={logout} className={BTN}>
          <LogOut className="w-4 h-4" aria-hidden />
          Thoát
        </button>
      </div>

      <div role="tablist" className="flex gap-1 mb-6 border-b border-w-gold/30 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => selectTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              tab === t.id ? 'border-w-btn text-w-strong' : 'border-transparent text-w-muted hover:text-w-text'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'xac-nhan' && <RsvpPanel password={password} />}
      {tab === 'khach-moi' && <GuestsPanel password={password} />}
      {tab === 'loi-chuc' && <GuestbookPanel password={password} />}
    </main>
  )
}
