'use client'

export const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export const BTN =
  'inline-flex items-center gap-1.5 rounded-lg border border-w-gold/40 px-3 py-2 text-sm text-w-text hover:bg-w-tint transition-colors disabled:opacity-60'
export const BTN_DANGER =
  'inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-sm font-medium transition-colors disabled:opacity-60'

export function errorText(err: unknown) {
  return err instanceof Error ? err.message : 'Có lỗi xảy ra'
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    el.remove()
  }
}

/** Tải file CSV mở được bằng Excel (có BOM để giữ dấu tiếng Việt) */
export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
  const csv = '\uFEFF' + rows.map((r) => r.map(escape).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="card-wedding rounded-2xl px-4 py-3">
      <p className="text-xs text-w-muted">{label}</p>
      <p className="font-serif text-3xl text-w-strong leading-tight">{value}</p>
      {hint && <p className="text-xs text-w-muted">{hint}</p>}
    </div>
  )
}

export function FilterChips<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { id: T; label: string }[]
  onChange: (id: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={`rounded-full px-3 py-1 text-sm border transition-colors ${
            value === o.id ? 'bg-w-btn text-white border-transparent' : 'border-w-gold/40 text-w-text hover:bg-w-tint'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Badge({ tone, children }: { tone: 'green' | 'red' | 'gray' | 'gold'; children: React.ReactNode }) {
  const tones = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-stone-100 text-stone-600',
    gold: 'bg-amber-100 text-amber-800',
  }
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>
}
