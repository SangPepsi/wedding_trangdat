'use client'

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { Check, Copy, Download, ExternalLink, RefreshCw, Trash2, UserPlus } from 'lucide-react'
import { WEDDING } from '@/lib/constants'
import { guestKey, guestLink } from '@/lib/guest'
import { addGuests, deleteGuest, fetchGuests, type GuestRecord } from '@/lib/guests'
import { fetchRsvps, type RsvpEntry } from '@/lib/rsvp'
import { Badge, BTN, BTN_DANGER, copyText, dateFormatter, downloadCsv, errorText, FilterChips, StatCard } from './shared'

type Filter = 'all' | 'unopened' | 'opened' | 'replied' | 'unreplied'

const TEMPLATE_KEY = 'guest-invite-template'
const DEFAULT_TEMPLATE =
  `Trân trọng kính mời {ten} tới dự lễ thành hôn của ${WEDDING.groomShort} & ${WEDDING.brideShort} ` +
  `vào lúc ${WEDDING.ceremony.timeDisplay.toLowerCase()}, ${WEDDING.ceremony.dayOfWeek.toLowerCase()} ngày ${WEDDING.dateShort}.\n` +
  `Thiệp mời: {link}`

const noopSubscribe = () => () => {}

/** "chị lan" -> "Chị Lan"; tách theo dòng, dấu phẩy hoặc chấm phẩy */
function parseNames(text: string) {
  return text
    .split(/[\n,;]/)
    .map((raw) =>
      raw
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map((w) => w.charAt(0).toLocaleUpperCase('vi') + w.slice(1))
        .join(' '),
    )
    .filter(Boolean)
}

function readTemplate() {
  try {
    return localStorage.getItem(TEMPLATE_KEY) || DEFAULT_TEMPLATE
  } catch {
    return DEFAULT_TEMPLATE
  }
}

export function GuestsPanel({ password }: { password: string }) {
  const origin = useSyncExternalStore(noopSubscribe, () => window.location.origin, () => '')
  const savedTemplate = useSyncExternalStore(noopSubscribe, readTemplate, () => DEFAULT_TEMPLATE)
  const [editedTemplate, setEditedTemplate] = useState<string | null>(null)
  const template = editedTemplate ?? savedTemplate

  const [guests, setGuests] = useState<GuestRecord[]>([])
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [namesText, setNamesText] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [copied, setCopied] = useState<string | null>(null)
  const [deletingKey, setDeletingKey] = useState<string | null>(null)

  const refresh = useCallback(
    () =>
      Promise.all([fetchGuests(password), fetchRsvps(password)])
        .then(([g, r]) => {
          setGuests(g)
          setRsvps(r)
        })
        .catch((err) => setError(errorText(err)))
        .finally(() => setLoading(false)),
    [password],
  )
  const load = () => {
    setLoading(true)
    setError('')
    return refresh()
  }

  useEffect(() => {
    refresh()
  }, [refresh])

  const rsvpByGuest = useMemo(() => {
    const map = new Map<string, RsvpEntry>()
    for (const r of rsvps) {
      const key = guestKey(r.invite || r.name)
      if (!map.has(key)) map.set(key, r)
    }
    return map
  }, [rsvps])

  const rows = useMemo(
    () =>
      guests.map((g) => {
        const link = guestLink(origin, g.name)
        return {
          ...g,
          link,
          preview: guestLink(origin, g.name, true),
          message: template.replaceAll('{ten}', g.name).replaceAll('{link}', link),
          rsvp: rsvpByGuest.get(g.key),
        }
      }),
    [guests, origin, template, rsvpByGuest],
  )

  const shown = rows.filter((r) => {
    if (filter === 'unopened') return !r.opens
    if (filter === 'opened') return Boolean(r.opens)
    if (filter === 'replied') return Boolean(r.rsvp)
    if (filter === 'unreplied') return !r.rsvp
    return true
  })

  const pending = parseNames(namesText)

  const add = async () => {
    if (pending.length === 0) return
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const { added } = await addGuests(pending, password)
      const skipped = pending.length - added
      setNotice(`Đã thêm ${added} khách${skipped > 0 ? `, ${skipped} tên đã có sẵn` : ''}.`)
      setNamesText('')
      await load()
    } catch (err) {
      setError(errorText(err))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (g: GuestRecord) => {
    if (!window.confirm(`Xoá "${g.name}" khỏi danh sách khách mời?`)) return
    setDeletingKey(g.key)
    setError('')
    try {
      await deleteGuest(g.key, password)
      setGuests((prev) => prev.filter((x) => x.key !== g.key))
    } catch (err) {
      setError(errorText(err))
    } finally {
      setDeletingKey(null)
    }
  }

  const copy = async (id: string, text: string) => {
    await copyText(text)
    setCopied(id)
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1800)
  }
  const copyIcon = (id: string) =>
    copied === id ? <Check className="w-4 h-4 text-green-600" aria-hidden /> : <Copy className="w-4 h-4" aria-hidden />

  const changeTemplate = (value: string) => {
    setEditedTemplate(value)
    try {
      localStorage.setItem(TEMPLATE_KEY, value)
    } catch {}
  }

  const exportCsv = () =>
    downloadCsv('khach-moi.csv', [
      ['Tên', 'Link mời', 'Đã mở', 'Số lần mở', 'Mở lần cuối', 'Xác nhận', 'Số người'],
      ...shown.map((r) => [
        r.name,
        r.link,
        r.opens ? 'Có' : 'Chưa',
        r.opens?.count ?? 0,
        r.opens ? dateFormatter.format(new Date(r.opens.last)) : '',
        r.rsvp ? (r.rsvp.attending ? 'Sẽ đến' : 'Không đến') : 'Chưa',
        r.rsvp?.attending ? r.rsvp.guests : '',
      ]),
    ])

  const openedCount = rows.filter((r) => r.opens).length
  const repliedCount = rows.filter((r) => r.rsvp).length

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Khách mời" value={rows.length} />
        <StatCard label="Đã mở thiệp" value={openedCount} hint={`${rows.length - openedCount} chưa mở`} />
        <StatCard label="Đã xác nhận" value={repliedCount} hint={`${rows.length - repliedCount} chưa trả lời`} />
      </div>

      <div className="card-wedding rounded-2xl p-5 sm:p-6 space-y-5 mb-6">
        <div>
          <label htmlFor="guest-names" className="block text-sm font-medium text-w-text mb-1.5">
            Thêm khách mời (mỗi dòng một người, hoặc cách nhau bằng dấu phẩy)
          </label>
          <textarea
            id="guest-names"
            value={namesText}
            onChange={(e) => setNamesText(e.target.value)}
            rows={4}
            placeholder={'Bạn Sáng\nAnh Quý\nChị Lan\nGia đình chú Hùng'}
            className="field-wedding resize-y"
          />
          <button
            type="button"
            onClick={add}
            disabled={saving || pending.length === 0}
            className="mt-2 inline-flex items-center gap-1.5 bg-w-btn hover:bg-w-btn-hover text-white font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60"
          >
            <UserPlus className="w-4 h-4" aria-hidden />
            {saving ? 'Đang lưu...' : pending.length ? `Thêm ${pending.length} khách` : 'Thêm khách'}
          </button>
          {notice && <p className="mt-2 text-sm text-green-700">{notice}</p>}
        </div>
        <div>
          <label htmlFor="guest-template" className="block text-sm font-medium text-w-text mb-1.5">
            Lời nhắn kèm link (<code>{'{ten}'}</code> = tên khách, <code>{'{link}'}</code> = link thiệp)
          </label>
          <textarea
            id="guest-template"
            value={template}
            onChange={(e) => changeTemplate(e.target.value)}
            rows={4}
            className="field-wedding resize-y"
          />
          {template !== DEFAULT_TEMPLATE && (
            <button type="button" onClick={() => changeTemplate(DEFAULT_TEMPLATE)} className="mt-2 text-sm text-w-muted underline">
              Dùng lại lời nhắn mặc định
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <FilterChips<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { id: 'all', label: 'Tất cả' },
            { id: 'unopened', label: 'Chưa mở' },
            { id: 'opened', label: 'Đã mở' },
            { id: 'unreplied', label: 'Chưa xác nhận' },
            { id: 'replied', label: 'Đã xác nhận' },
          ]}
        />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={load} disabled={loading} className={BTN}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden />
            Tải lại
          </button>
          <button
            type="button"
            onClick={() => copy('all', shown.map((r) => r.message).join('\n\n'))}
            disabled={shown.length === 0}
            className={BTN}
          >
            {copyIcon('all')}
            {copied === 'all' ? 'Đã chép' : `Chép ${shown.length} lời mời`}
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
        <p className="card-wedding rounded-2xl p-8 text-center text-w-muted">
          {rows.length === 0 ? 'Chưa có khách mời nào. Nhập tên ở ô phía trên để bắt đầu.' : 'Không có khách nào ở mục này.'}
        </p>
      )}

      <ul className="space-y-3">
        {shown.map((r) => (
          <li key={r.key} className="card-wedding rounded-2xl p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <p className="font-semibold text-w-strong break-words">{r.name}</p>
              {r.opens ? (
                <Badge tone="green">
                  Đã mở{r.opens.count > 1 ? ` · ${r.opens.count} lần` : ''}
                </Badge>
              ) : (
                <Badge tone="gray">Chưa mở</Badge>
              )}
              {r.rsvp &&
                (r.rsvp.attending ? (
                  <Badge tone="gold">Sẽ đến · {r.rsvp.guests} người</Badge>
                ) : (
                  <Badge tone="red">Không đến</Badge>
                ))}
            </div>
            {r.opens && (
              <p className="text-xs text-w-muted mb-1">
                Mở lần đầu {dateFormatter.format(new Date(r.opens.first))}
                {r.opens.count > 1 && ` · lần cuối ${dateFormatter.format(new Date(r.opens.last))}`}
              </p>
            )}
            <p className="text-xs text-w-muted break-all mb-3">{r.link}</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => copy(`msg-${r.key}`, r.message)} className={BTN}>
                {copyIcon(`msg-${r.key}`)}
                {copied === `msg-${r.key}` ? 'Đã chép' : 'Chép lời mời'}
              </button>
              <button type="button" onClick={() => copy(`link-${r.key}`, r.link)} className={BTN}>
                {copyIcon(`link-${r.key}`)}
                {copied === `link-${r.key}` ? 'Đã chép' : 'Chỉ chép link'}
              </button>
              <a href={r.preview} target="_blank" rel="noopener noreferrer" className={BTN}>
                <ExternalLink className="w-4 h-4" aria-hidden />
                Mở thử
              </a>
              <button
                type="button"
                onClick={() => remove(r)}
                disabled={deletingKey === r.key}
                aria-label={`Xoá ${r.name}`}
                className={`ml-auto ${BTN_DANGER}`}
              >
                <Trash2 className="w-4 h-4" aria-hidden />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
