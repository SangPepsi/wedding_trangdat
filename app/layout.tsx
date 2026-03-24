import type { Metadata, Viewport } from 'next'
import { Geist, Great_Vibes } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ['latin', 'vietnamese'], variable: '--font-geist' })
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin', 'vietnamese'], variable: '--font-script' })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tien-dat-thi-trang.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Tiến Đạt & Huyền Trang - Thiệp Cưới',
  description: 'Thiệp cưới Đào Tiến Đạt & Nguyễn Thị Huyền Trang - 20 tháng 12, 2026. Trân trọng kính mời quý khách đến dự ngày trọng đại của chúng tôi.',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    title: 'Tiến Đạt & Huyền Trang - Thiệp Cưới',
    description: 'Thiệp cưới Đào Tiến Đạt & Nguyễn Thị Huyền Trang - 20 tháng 12, 2026. Trân trọng kính mời quý khách đến dự ngày trọng đại của chúng tôi.',
    images: ['/gallery/1.jpg', '/icon.svg'],
    siteName: 'Thiệp Cưới Đào Tiến Đạt & Nguyễn Thị Huyền Trang',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiến Đạt & Huyền Trang - Thiệp Cưới',
    description: 'Thiệp cưới Đào Tiến Đạt & Nguyễn Thị Huyền Trang - 20 tháng 12, 2026. Trân trọng kính mời quý khách đến dự ngày trọng đại của chúng tôi.',
    images: ['/gallery/1.jpg'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${geist.variable} ${greatVibes.variable}`} data-theme="bordeaux">
      <body className="font-sans antialiased text-red-900 theme-bg overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
