'use client'

import { useCallback, useEffect, useState } from 'react'
import { Check, ExternalLink, Loader2, RotateCcw, Save } from 'lucide-react'
import type { WeddingContent } from '@/lib/content'
import {
  CoupleSection,
  EventSection,
  FamilySection,
  GiftSection,
  ImagesSection,
  MusicSection,
  StorySection,
  type Update,
} from './admin-sections'

const NAV = [
  { id: 'co-dau-chu-re', label: 'Cô dâu & chú rể' },
  { id: 'su-kien', label: 'Ngày giờ & địa điểm' },
  { id: 'gia-dinh', label: 'Gia đình' },
  { id: 'cau-chuyen', label: 'Câu chuyện' },
  { id: 'anh', label: 'Ảnh bìa & album' },
  { id: 'mung-cuoi', label: 'Mừng cưới' },
  { id: 'nhac', label: 'Nhạc nền' },
]

type Status = { kind: 'idle' } | { kind: 'saving' } | { kind: 'saved' } | { kind: 'error'; message: string }

export function AdminEditor({ initial }: { initial: WeddingContent }) {
  const [saved, setSaved] = useState(initial)
  const [content, setContent] = useState(initial)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const dirty = content !== saved

  const update: Update = useCallback((fn) => {
    setContent((prev) => {
      const next = structuredClone(prev)
      fn(next)
      return next
    })
    setStatus({ kind: 'idle' })
  }, [])

  const save = useCallback(async () => {
    setStatus({ kind: 'saving' })
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Lưu thất bại')
      setSaved(content)
      setStatus({ kind: 'saved' })
    } catch (e) {
      setStatus({ kind: 'error', message: e instanceof Error ? e.message : 'Lưu thất bại' })
    }
  }, [content])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        save()
      }
    }
    window.addEventListener('beforeunload', warn)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('beforeunload', warn)
      window.removeEventListener('keydown', onKey)
    }
  }, [dirty, save])

  const props = { content, update }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div>
            <h1 className="text-base font-semibold text-stone-900">Quản trị thiệp cưới</h1>
            <p className="text-xs text-stone-500">
              {content.couple.groomShort} &amp; {content.couple.brideShort} · lưu vào content/wedding.json
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusText status={status} dirty={dirty} />
            <a
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              <ExternalLink className="w-4 h-4" /> Xem thiệp
            </a>
            <button
              type="button"
              disabled={!dirty || status.kind === 'saving'}
              onClick={() => {
                setContent(saved)
                setStatus({ kind: 'idle' })
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-40"
            >
              <RotateCcw className="w-4 h-4" /> Hoàn tác
            </button>
            <button
              type="button"
              disabled={!dirty || status.kind === 'saving'}
              onClick={save}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 disabled:opacity-40"
            >
              {status.kind === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Lưu
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[13rem_1fr]">
        <nav className="hidden lg:block" aria-label="Các phần">
          <ul className="sticky top-24 space-y-1">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="block rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-white hover:text-stone-900">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="space-y-6 pb-16">
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Trang này chỉ chạy trên máy của bạn khi chạy <code className="font-mono">npm run dev</code>. Lưu xong, thiệp
            trên máy cập nhật ngay. Muốn khách thấy thì commit và deploy lại lên Vercel.
          </p>
          <CoupleSection {...props} />
          <EventSection {...props} />
          <FamilySection {...props} />
          <StorySection {...props} />
          <ImagesSection {...props} />
          <GiftSection {...props} />
          <MusicSection {...props} />
        </main>
      </div>
    </div>
  )
}

function StatusText({ status, dirty }: { status: Status; dirty: boolean }) {
  if (status.kind === 'error') return <span className="text-sm text-red-600">{status.message}</span>
  if (status.kind === 'saved')
    return (
      <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
        <Check className="w-4 h-4" /> Đã lưu
      </span>
    )
  if (dirty) return <span className="text-sm text-amber-600">Chưa lưu (Ctrl + S)</span>
  return null
}
