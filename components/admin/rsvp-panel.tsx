'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Download, Phone, RefreshCw, Trash2 } from 'lucide-react'
import { deleteRsvp, fetchRsvps, headcount, type RsvpEntry } from '@/lib/rsvp'
import { Badge, BTN, BTN_DANGER, dateFormatter, downloadCsv, errorText, FilterChips, StatCard } from './shared'

type Attend = 'all' | 'yes' | 'no'
type Side = 'all' | 'groom' | 'bride'

const SIDE_LABEL = { groom: 'Nhà trai', bride: 'Nhà gái' } as const

function sumPeople(entries: RsvpEntry[]) {
  const total = entries.reduce((n, e) => n + headcount(e), 0)
  const atLeast = entries.some((e) => e.attending && e.guests === '6+')
  return atLeast ? `${total}+` : String(total)
}

export function RsvpPanel({ password }: { password: string }) {
  const [entries, setEntries] = useState<RsvpEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [attend, setAttend] = useState<Attend>('all')
  const [side, setSide] = useState<Side>('all')

  const refresh = useCallback(
    () =>
      fetchRsvps(password)
        .then(setEntries)
        .catch((err) => setError(errorText(err)))
        .finally(() => setLoading(false)),
    [password],
  )
  const load = () => {
    setLoading(true)
    setError('')
    refresh()
  }

  useEffect(() => {
    refresh()
  }, [refresh])

  const coming = entries.filter((e) => e.attending)
  const shown = useMemo(
    () =>
      entries.filter(
        (e) =>
          (attend === 'all' || e.attending === (attend === 'yes')) && (side === 'all' || e.side === side),
      ),
    [entries, attend, side],
  )

  const remove = async (entry: RsvpEntry) => {
    if (!window.confirm(`Xoá xác nhận của "${entry.name}"?`)) return
    setDeletingId(entry.id)
    setError('')
    try {
      await deleteRsvp(entry.id, password)
      setEntries((prev) => prev.filter((e) => e.id !== entry.id))
    } catch (err) {
      setError(errorText(err))
    } finally {
      setDeletingId(null)
    }
  }

  const exportCsv = () =>
    downloadCsv('xac-nhan-tham-du.csv', [
      ['Họ tên', 'Số điện thoại', 'Tham dự', 'Khách của', 'Số người', 'Ghi chú', 'Tên trong link mời', 'Gửi lúc'],
      ...shown.map((e) => [
        e.name,
        e.phone,
        e.attending ? 'Có' : 'Không',
        SIDE_LABEL[e.side],
        e.attending ? e.guests : 0,
        e.note,
        e.invite ?? '',
        dateFormatter.format(new Date(e.updatedAt)),
      ]),
    ])

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard label="Số phản hồi" value={entries.length} hint={`${entries.length - coming.length} không đến`} />
        <StatCard label="Tổng người dự kiến" value={sumPeople(coming)} hint={`${coming.length} phản hồi sẽ đến`} />
        <StatCard label="Nhà trai" value={sumPeople(coming.filter((e) => e.side === 'groom'))} hint="người" />
        <StatCard label="Nhà gái" value={sumPeople(coming.filter((e) => e.side === 'bride'))} hint="người" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-3">
          <FilterChips<Attend>
            value={attend}
            onChange={setAttend}
            options={[
              { id: 'all', label: 'Tất cả' },
              { id: 'yes', label: 'Sẽ đến' },
              { id: 'no', label: 'Không đến' },
            ]}
          />
          <FilterChips<Side>
            value={side}
            onChange={setSide}
            options={[
              { id: 'all', label: 'Hai bên' },
              { id: 'groom', label: 'Nhà trai' },
              { id: 'bride', label: 'Nhà gái' },
            ]}
          />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={load} disabled={loading} className={BTN}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden />
            Tải lại
          </button>
          <button type="button" onClick={exportCsv} disabled={shown.length === 0} className={BTN}>
            <Download className="w-4 h-4" aria-hidden />
            Tải Excel
          </button>
        </div>
      </div>

      {error && (
        <p className="error-wedding mb-4" role="alert">
          {error}
        </p>
      )}
      {!loading && shown.length === 0 && !error && (
        <p className="card-wedding rounded-2xl p-8 text-center text-w-muted">Chưa có xác nhận nào.</p>
      )}

      <ul className="space-y-3">
        {shown.map((e) => (
          <li key={e.id} className="card-wedding rounded-2xl p-4 sm:p-5 flex gap-4 items-start">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="font-semibold text-w-strong break-words">{e.name}</p>
                {e.attending ? (
                  <Badge tone="green">Sẽ đến · {e.guests} người</Badge>
                ) : (
                  <Badge tone="red">Không đến</Badge>
                )}
                <Badge tone="gold">{SIDE_LABEL[e.side]}</Badge>
              </div>
              <p className="text-sm text-w-muted flex flex-wrap gap-x-3">
                <a href={`tel:${e.phone}`} className="inline-flex items-center gap-1 underline underline-offset-2">
                  <Phone className="w-3.5 h-3.5" aria-hidden />
                  {e.phone}
                </a>
                <span>{dateFormatter.format(new Date(e.updatedAt))}</span>
                {e.invite && e.invite !== e.name && <span>Link mời: {e.invite}</span>}
              </p>
              {e.note && <p className="mt-2 text-sm text-w-text whitespace-pre-line break-words">{e.note}</p>}
            </div>
            <button
              type="button"
              onClick={() => remove(e)}
              disabled={deletingId === e.id}
              aria-label={`Xoá xác nhận của ${e.name}`}
              className={`shrink-0 ${BTN_DANGER}`}
            >
              <Trash2 className="w-4 h-4" aria-hidden />
              <span className="hidden sm:inline">{deletingId === e.id ? 'Đang xoá...' : 'Xoá'}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
