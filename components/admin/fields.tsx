'use client'

import { useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Loader2, Trash2, Upload } from 'lucide-react'

export function AdminSection({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl bg-white border border-stone-200 shadow-sm p-5 sm:p-7">
      <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-stone-500">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  )
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-stone-700">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-xs text-stone-500">{hint}</span>}
    </label>
  )
}

const inputClass =
  'w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100'

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="text" {...props} className={`${inputClass} ${props.className ?? ''}`} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} {...props} className={`${inputClass} resize-y ${props.className ?? ''}`} />
}

export function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>
}

export function SmallButton({
  children,
  tone = 'default',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'default' | 'danger' }) {
  const toneClass =
    tone === 'danger'
      ? 'text-red-600 hover:bg-red-50 border-red-200'
      : 'text-stone-700 hover:bg-stone-100 border-stone-300'
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition disabled:opacity-40 disabled:pointer-events-none ${toneClass} ${props.className ?? ''}`}
    >
      {children}
    </button>
  )
}

/** Nút lên / xuống / xoá dùng cho các danh sách có thứ tự */
export function ListControls({
  index,
  length,
  onMove,
  onRemove,
}: {
  index: number
  length: number
  onMove: (from: number, to: number) => void
  onRemove: (index: number) => void
}) {
  return (
    <div className="flex items-center gap-1">
      <SmallButton aria-label="Lên trên" disabled={index === 0} onClick={() => onMove(index, index - 1)}>
        <ArrowUp className="w-3.5 h-3.5" />
      </SmallButton>
      <SmallButton aria-label="Xuống dưới" disabled={index === length - 1} onClick={() => onMove(index, index + 1)}>
        <ArrowDown className="w-3.5 h-3.5" />
      </SmallButton>
      <SmallButton tone="danger" aria-label="Xoá" onClick={() => onRemove(index)}>
        <Trash2 className="w-3.5 h-3.5" />
      </SmallButton>
    </div>
  )
}

export type UploadFolder = 'gallery' | 'qrcode' | 'music'

/** Tải file lên public/<folder>/ qua API quản trị, trả về đường dẫn để lưu vào nội dung */
export function UploadButton({
  folder,
  accept,
  multiple = false,
  label,
  onUploaded,
}: {
  folder: UploadFolder
  accept: string
  multiple?: boolean
  label: string
  onUploaded: (paths: string[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (files: FileList | null) => {
    if (!files?.length) return
    setBusy(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('folder', folder)
      for (const f of Array.from(files)) form.append('files', f)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Tải lên thất bại')
      onUploaded(data.paths)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Tải lên thất bại')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-rose-300 bg-rose-50 px-3.5 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {busy ? 'Đang tải lên...' : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(e) => upload(e.target.files)}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export function moveItem<T>(list: T[], from: number, to: number) {
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}
