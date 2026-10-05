'use client'

/* eslint-disable @next/next/no-img-element -- ảnh xem trước trong trang quản trị, không cần tối ưu */
import { useState } from 'react'
import { Crosshair, ImagePlus, Plus, Star } from 'lucide-react'
import { describeDate, type WeddingContent } from '@/lib/content'
import {
  AdminSection,
  Field,
  Grid,
  ListControls,
  SmallButton,
  TextArea,
  TextInput,
  UploadButton,
  moveItem,
} from './fields'

export type Update = (fn: (draft: WeddingContent) => void) => void

interface SectionProps {
  content: WeddingContent
  update: Update
}

export function CoupleSection({ content, update }: SectionProps) {
  const c = content.couple
  const set = (key: keyof typeof c) => (e: React.ChangeEvent<HTMLInputElement>) =>
    update((d) => {
      d.couple[key] = e.target.value
    })

  return (
    <AdminSection id="co-dau-chu-re" title="Cô dâu & chú rể" description="Tên hiển thị trên thiệp bìa, lời báo tin, thanh menu và ảnh chia sẻ link.">
      <Grid>
        <Field label="Họ tên đầy đủ chú rể">
          <TextInput value={c.groom} onChange={set('groom')} />
        </Field>
        <Field label="Họ tên đầy đủ cô dâu">
          <TextInput value={c.bride} onChange={set('bride')} />
        </Field>
        <Field label="Tên chú rể trên thiệp" hint="Hiện to ở thiệp bìa, ví dụ: Đức Toàn">
          <TextInput value={c.groomShort} onChange={set('groomShort')} />
        </Field>
        <Field label="Tên cô dâu trên thiệp" hint="Ví dụ: Nhật Minh">
          <TextInput value={c.brideShort} onChange={set('brideShort')} />
        </Field>
        <Field label="Tên chú rể trên menu" hint="Ngắn gọn, ví dụ: Toàn">
          <TextInput value={c.groomBrand} onChange={set('groomBrand')} />
        </Field>
        <Field label="Tên cô dâu trên menu" hint="Ví dụ: Minh">
          <TextInput value={c.brideBrand} onChange={set('brideBrand')} />
        </Field>
      </Grid>
    </AdminSection>
  )
}

export function EventSection({ content, update }: SectionProps) {
  const e = content.event
  const start = describeDate(e.start)
  const [coords, setCoords] = useState(`${e.venueLat}, ${e.venueLng}`)
  const set = (key: Exclude<keyof typeof e, 'venueLat' | 'venueLng'>) =>
    (ev: React.ChangeEvent<HTMLInputElement>) =>
      update((d) => {
        d.event[key] = ev.target.value
      })

  const onCoords = (value: string) => {
    setCoords(value)
    const m = value.match(/(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)/)
    if (m) {
      update((d) => {
        d.event.venueLat = Number(m[1])
        d.event.venueLng = Number(m[2])
      })
    }
  }

  return (
    <AdminSection id="su-kien" title="Ngày giờ & địa điểm" description="Thứ, ngày, buổi trên thiệp và đếm ngược được tự tính từ giờ bắt đầu.">
      <Grid>
        <Field label="Bắt đầu lễ (giờ Việt Nam)">
          <TextInput type="datetime-local" value={e.start} onChange={set('start')} />
        </Field>
        <Field label="Kết thúc tiệc" hint="Dùng cho nút “Thêm vào lịch”">
          <TextInput type="datetime-local" value={e.end} onChange={set('end')} />
        </Field>
      </Grid>
      {start && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">
          Thiệp sẽ hiển thị: <b>{start.dayOfWeek}</b>, {start.date} · {start.timeDisplay}
        </p>
      )}
      <Grid>
        <Field label="Ngày âm lịch" hint="Ví dụ: Tức ngày 12 tháng 11 năm Bính Ngọ">
          <TextInput value={e.lunarDate} onChange={set('lunarDate')} />
        </Field>
        <Field label="Năm âm lịch" hint="Ví dụ: Bính Ngọ">
          <TextInput value={e.lunarYear} onChange={set('lunarYear')} />
        </Field>
      </Grid>
      <Field label="Nơi tổ chức lễ (hiện trên thiệp báo tin)">
        <TextInput value={e.location} onChange={set('location')} />
      </Field>
      <Field
        label="Toạ độ bản đồ"
        hint="Mở Google Maps, chuột phải vào địa điểm, bấm vào dòng toạ độ đầu tiên để sao chép rồi dán vào đây."
      >
        <TextInput value={coords} onChange={(ev) => onCoords(ev.target.value)} placeholder="20.6635739, 106.1004076" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Tên lễ">
          <TextInput value={e.ceremonyName} onChange={set('ceremonyName')} />
        </Field>
        <Field label="Giờ lễ" hint="Ví dụ: 14:00 - 15:30">
          <TextInput value={e.ceremonyTime} onChange={set('ceremonyTime')} />
        </Field>
        <Field label="Địa điểm lễ">
          <TextInput value={e.ceremonyVenue} onChange={set('ceremonyVenue')} />
        </Field>
        <Field label="Tên tiệc">
          <TextInput value={e.mealName} onChange={set('mealName')} />
        </Field>
        <Field label="Giờ tiệc">
          <TextInput value={e.mealTime} onChange={set('mealTime')} />
        </Field>
        <Field label="Địa điểm tiệc">
          <TextInput value={e.mealVenue} onChange={set('mealVenue')} />
        </Field>
      </div>

      {(['groomFamily', 'brideFamily'] as const).map((side) => (
        <Grid key={side}>
          <Field label={side === 'groomFamily' ? 'Địa chỉ nhà trai' : 'Địa chỉ nhà gái'}>
            <TextInput
              value={content.addresses[side].address}
              onChange={(ev) =>
                update((d) => {
                  d.addresses[side].address = ev.target.value
                })
              }
            />
          </Field>
          <Field label="Link Google Maps" hint="Google Maps → Chia sẻ → Sao chép đường liên kết">
            <TextInput
              value={content.addresses[side].mapsUrl}
              onChange={(ev) =>
                update((d) => {
                  d.addresses[side].mapsUrl = ev.target.value
                })
              }
            />
          </Field>
        </Grid>
      ))}
    </AdminSection>
  )
}

export function FamilySection({ content, update }: SectionProps) {
  return (
    <AdminSection id="gia-dinh" title="Gia đình hai bên" description="Tên bố mẹ hiển thị ở phần “Gia đình hai bên”.">
      {(['nhaTrai', 'nhaGai'] as const).map((side) => (
        <Grid key={side}>
          {(['ong', 'ba'] as const).map((who) => (
            <Field key={who} label={`${who === 'ong' ? 'Ông' : 'Bà'} (${side === 'nhaTrai' ? 'nhà trai' : 'nhà gái'})`}>
              <TextInput
                value={content.family[side][who]}
                onChange={(ev) =>
                  update((d) => {
                    d.family[side][who] = ev.target.value
                  })
                }
              />
            </Field>
          ))}
        </Grid>
      ))}
    </AdminSection>
  )
}

export function StorySection({ content, update }: SectionProps) {
  const s = content.story
  return (
    <AdminSection id="cau-chuyen" title="Lời báo tin & câu chuyện tình yêu">
      <Field label="Lời báo tin (dòng chữ nhỏ trên thiệp báo tin)">
        <TextInput
          value={content.announcement}
          onChange={(ev) =>
            update((d) => {
              d.announcement = ev.target.value
            })
          }
        />
      </Field>
      <Field label="Tiêu đề">
        <TextInput
          value={s.title}
          onChange={(ev) =>
            update((d) => {
              d.story.title = ev.target.value
            })
          }
        />
      </Field>
      <Field label="Câu chuyện" hint="Để trống nếu không muốn hiện đoạn văn này">
        <TextArea
          rows={5}
          value={s.text}
          onChange={(ev) =>
            update((d) => {
              d.story.text = ev.target.value
            })
          }
        />
      </Field>

      <div>
        <p className="text-sm font-medium text-stone-700">Các mốc thời gian</p>
        <div className="mt-2 space-y-2">
          {s.timeline.map((item, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <TextInput
                className="!w-32"
                value={item.date}
                placeholder="05-2023"
                aria-label="Thời gian"
                onChange={(ev) =>
                  update((d) => {
                    d.story.timeline[i].date = ev.target.value
                  })
                }
              />
              <TextInput
                className="flex-1 !w-auto min-w-[10rem]"
                value={item.event}
                placeholder="Lần đầu gặp gỡ"
                aria-label="Sự kiện"
                onChange={(ev) =>
                  update((d) => {
                    d.story.timeline[i].event = ev.target.value
                  })
                }
              />
              <ListControls
                index={i}
                length={s.timeline.length}
                onMove={(from, to) =>
                  update((d) => {
                    d.story.timeline = moveItem(d.story.timeline, from, to)
                  })
                }
                onRemove={(idx) =>
                  update((d) => {
                    d.story.timeline.splice(idx, 1)
                  })
                }
              />
            </div>
          ))}
        </div>
        <SmallButton
          className="mt-3"
          onClick={() =>
            update((d) => {
              d.story.timeline.push({ date: '', event: '' })
            })
          }
        >
          <Plus className="w-3.5 h-3.5" /> Thêm mốc
        </SmallButton>
      </div>
    </AdminSection>
  )
}

function parseFocus(focus: string) {
  const m = focus.match(/(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/)
  return m ? { x: Number(m[1]), y: Number(m[2]) } : { x: 50, y: 50 }
}

export function ImagesSection({ content, update }: SectionProps) {
  const hero = content.hero
  const focus = parseFocus(hero.focus)

  const pickFocus = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    update((d) => {
      d.hero.focus = `${x}% ${y}%`
    })
  }

  return (
    <AdminSection
      id="anh"
      title="Ảnh bìa & album"
      description="Ảnh tải lên được lưu vào public/gallery với tên mới, không ghi đè ảnh cũ."
    >
      <div>
        <p className="text-sm font-medium text-stone-700">Ảnh bìa</p>
        <p className="mt-0.5 text-xs text-stone-500">
          Bấm vào khuôn mặt trên ảnh bên trái để đặt điểm giữ lại khi ảnh phải cắt cho vừa khung.
        </p>
        <div className="mt-3 flex flex-wrap items-start gap-5">
          <div
            className="relative cursor-crosshair overflow-hidden rounded-lg border border-stone-200"
            onClick={pickFocus}
            role="button"
            tabIndex={-1}
            aria-label="Chọn điểm lấy nét"
          >
            <img src={hero.src} alt="Ảnh bìa" className="block max-h-72 w-auto max-w-full select-none" draggable={false} />
            <span
              className="pointer-events-none absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-rose-500/40 shadow-[0_0_0_2px_rgba(0,0,0,0.35)]"
              style={{ left: `${focus.x}%`, top: `${focus.y}%` }}
            />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-stone-500">Xem trước khung 4:5</p>
            <div className="w-40 aspect-[4/5] overflow-hidden rounded-md border border-amber-300 shadow">
              <img src={hero.src} alt="" className="h-full w-full object-cover" style={{ objectPosition: hero.focus }} />
            </div>
            <p className="mt-2 flex items-center gap-1 text-xs text-stone-500">
              <Crosshair className="w-3.5 h-3.5" /> {hero.focus}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <UploadButton
            folder="gallery"
            accept="image/jpeg,image/png,image/webp"
            label="Tải ảnh bìa mới"
            onUploaded={([path]) =>
              update((d) => {
                d.hero = { src: path, focus: '50% 40%' }
              })
            }
          />
        </div>
      </div>

      <div className="border-t border-stone-200 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-stone-700">Album ảnh ({content.gallery.length} ảnh)</p>
            <p className="mt-0.5 text-xs text-stone-500">Thứ tự dưới đây là thứ tự trình chiếu.</p>
          </div>
          <UploadButton
            folder="gallery"
            accept="image/jpeg,image/png,image/webp"
            multiple
            label="Thêm ảnh vào album"
            onUploaded={(paths) =>
              update((d) => {
                for (const src of paths) {
                  d.gallery.push({ src, alt: `Ảnh cưới ${d.gallery.length + 1}`, caption: '' })
                }
              })
            }
          />
        </div>

        {content.gallery.length === 0 ? (
          <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-dashed border-stone-300 py-10 text-stone-500">
            <ImagePlus className="w-8 h-8" />
            <p className="text-sm">Chưa có ảnh nào</p>
          </div>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.gallery.map((img, i) => (
              <li key={`${img.src}-${i}`} className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-200">
                  <img src={img.src} alt={img.alt} className="h-full w-full object-cover" loading="lazy" />
                  <span className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-xs font-medium text-white">
                    {i + 1}
                  </span>
                  {hero.src === img.src && (
                    <span className="absolute right-2 top-2 rounded-md bg-amber-500 px-1.5 py-0.5 text-xs font-medium text-white">
                      Ảnh bìa
                    </span>
                  )}
                </div>
                <div className="mt-2.5 space-y-2">
                  <TextInput
                    value={img.caption}
                    placeholder="Chú thích (tuỳ chọn)"
                    aria-label="Chú thích"
                    onChange={(ev) =>
                      update((d) => {
                        d.gallery[i].caption = ev.target.value
                      })
                    }
                  />
                  <TextInput
                    value={img.alt}
                    placeholder="Mô tả ảnh"
                    aria-label="Mô tả ảnh"
                    onChange={(ev) =>
                      update((d) => {
                        d.gallery[i].alt = ev.target.value
                      })
                    }
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <SmallButton
                    disabled={hero.src === img.src}
                    onClick={() =>
                      update((d) => {
                        d.hero = { src: img.src, focus: '50% 40%' }
                      })
                    }
                  >
                    <Star className="w-3.5 h-3.5" /> Làm ảnh bìa
                  </SmallButton>
                  <ListControls
                    index={i}
                    length={content.gallery.length}
                    onMove={(from, to) =>
                      update((d) => {
                        d.gallery = moveItem(d.gallery, from, to)
                      })
                    }
                    onRemove={(idx) =>
                      update((d) => {
                        d.gallery.splice(idx, 1)
                      })
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminSection>
  )
}

export function GiftSection({ content, update }: SectionProps) {
  return (
    <AdminSection id="mung-cuoi" title="Hộp mừng cưới" description="Mã QR lấy từ app ngân hàng (mục Nhận tiền / Mã QR của tôi).">
      <div className="grid gap-6 md:grid-cols-2">
        {(['groom', 'bride'] as const).map((side) => {
          const g = content.gift[side]
          const set = (key: 'name' | 'bankName' | 'accountNumber' | 'accountName') =>
            (ev: React.ChangeEvent<HTMLInputElement>) =>
              update((d) => {
                d.gift[side][key] = ev.target.value
              })
          return (
            <div key={side} className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-4">
              <p className="font-medium text-stone-800">{side === 'groom' ? 'Phía chú rể' : 'Phía cô dâu'}</p>
              <div className="flex items-center gap-4">
                <img src={g.qrPath} alt="Mã QR" className="h-28 w-28 rounded-lg border border-stone-200 bg-white object-contain p-1" />
                <UploadButton
                  folder="qrcode"
                  accept="image/jpeg,image/png,image/webp"
                  label="Tải mã QR"
                  onUploaded={([path]) =>
                    update((d) => {
                      d.gift[side].qrPath = path
                    })
                  }
                />
              </div>
              <Field label="Tiêu đề thẻ" hint="Ví dụ: Chú rể, Nhà trai">
                <TextInput value={g.name} onChange={set('name')} />
              </Field>
              <Field label="Ngân hàng">
                <TextInput value={g.bankName} onChange={set('bankName')} />
              </Field>
              <Field label="Số tài khoản">
                <TextInput value={g.accountNumber} onChange={set('accountNumber')} inputMode="numeric" />
              </Field>
              <Field label="Tên chủ tài khoản" hint="Viết hoa không dấu như trên app, ví dụ: DAO TIEN DAT">
                <TextInput value={g.accountName} onChange={set('accountName')} />
              </Field>
            </div>
          )
        })}
      </div>
    </AdminSection>
  )
}

export function MusicSection({ content, update }: SectionProps) {
  const m = content.music
  return (
    <AdminSection id="nhac" title="Nhạc nền" description="Phát lần lượt từng bài, hết bài cuối quay lại bài đầu.">
      <ul className="space-y-2">
        {m.playlist.map((src, i) => (
          <li key={`${src}-${i}`} className="flex flex-wrap items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 p-2.5">
            <span className="w-6 text-center text-sm font-medium text-stone-500">{i + 1}</span>
            <audio controls preload="none" src={src} className="h-9 flex-1 min-w-[12rem]" />
            <span className="max-w-[12rem] truncate text-xs text-stone-500" title={src}>
              {src.split('/').pop()}
            </span>
            <ListControls
              index={i}
              length={m.playlist.length}
              onMove={(from, to) =>
                update((d) => {
                  d.music.playlist = moveItem(d.music.playlist, from, to)
                })
              }
              onRemove={(idx) =>
                update((d) => {
                  d.music.playlist.splice(idx, 1)
                })
              }
            />
          </li>
        ))}
      </ul>
      <UploadButton
        folder="music"
        accept="audio/mpeg,audio/mp4,audio/ogg,.mp3,.m4a,.ogg"
        multiple
        label="Thêm bài hát (mp3)"
        onUploaded={(paths) =>
          update((d) => {
            d.music.playlist.push(...paths)
          })
        }
      />
      <Field label={`Âm lượng: ${Math.round(m.volume * 100)}%`}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={m.volume}
          onChange={(ev) =>
            update((d) => {
              d.music.volume = Number(ev.target.value)
            })
          }
          className="w-full max-w-xs accent-rose-500"
        />
      </Field>
    </AdminSection>
  )
}
