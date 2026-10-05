import type { Metadata } from 'next'
import { GuestbookManager } from '@/components/guestbook-manager'

export const metadata: Metadata = {
  title: 'Quản lý lời chúc',
  robots: { index: false, follow: false },
}

export default function GuestbookManagerPage() {
  return <GuestbookManager />
}
