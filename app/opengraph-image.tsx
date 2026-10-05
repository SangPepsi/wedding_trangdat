import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { WEDDING, HERO_IMAGE } from '@/lib/constants'

export const alt = `Thiệp cưới ${WEDDING.groomShort} & ${WEDDING.brideShort} - ${WEDDING.date}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const NAMES = `${WEDDING.groomShort} & ${WEDDING.brideShort}`
const SUBTITLE = 'TRÂN TRỌNG KÍNH MỜI'

async function loadGoogleFont(family: string, text: string, weight?: number) {
  const params = `family=${family}${weight ? `:wght@${weight}` : ''}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(`https://fonts.googleapis.com/css2?${params}`)).text()
  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
  if (!url) throw new Error(`Không tải được font ${family}`)
  return (await fetch(url)).arrayBuffer()
}

async function loadFonts() {
  try {
    const [script, body] = await Promise.all([
      loadGoogleFont('Great+Vibes', NAMES),
      loadGoogleFont('Be+Vietnam+Pro', `${SUBTITLE}${WEDDING.date}${WEDDING.ceremony.lunarDate}`, 500),
    ])
    return [
      { name: 'Script', data: script, style: 'normal' as const, weight: 400 as const },
      { name: 'Body', data: body, style: 'normal' as const, weight: 500 as const },
    ]
  } catch {
    return undefined
  }
}

async function loadBackground() {
  try {
    const file = await readFile(join(process.cwd(), 'public', HERO_IMAGE.src))
    const mime = HERO_IMAGE.src.endsWith('.png') ? 'image/png' : 'image/jpeg'
    return `data:${mime};base64,${file.toString('base64')}`
  } catch {
    return null
  }
}

export default async function OpengraphImage() {
  const [fonts, background] = await Promise.all([loadFonts(), loadBackground()])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#420a10',
        }}
      >
        {background && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={background}
            alt=""
            width={1200}
            height={630}
            style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, objectFit: 'cover', objectPosition: HERO_IMAGE.focus }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: 'flex',
            backgroundImage: 'linear-gradient(180deg, rgba(60,0,0,0.6) 0%, rgba(25,0,0,0.8) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 28,
            left: 28,
            width: 1144,
            height: 574,
            display: 'flex',
            border: '3px solid rgba(212,165,116,0.85)',
            borderRadius: 24,
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#ffffff',
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: 'Body', fontSize: 30, letterSpacing: 6, color: '#e8c88a' }}>{SUBTITLE}</div>
          <div style={{ fontFamily: 'Script', fontSize: 104, lineHeight: 1.35, marginTop: 8, whiteSpace: 'nowrap' }}>
            {NAMES}
          </div>
          <div style={{ fontFamily: 'Body', fontSize: 42, marginTop: 4, color: '#fef2f2' }}>{WEDDING.date}</div>
          <div style={{ fontFamily: 'Body', fontSize: 26, marginTop: 14, color: '#e8c88a' }}>
            {WEDDING.ceremony.lunarDate}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  )
}
