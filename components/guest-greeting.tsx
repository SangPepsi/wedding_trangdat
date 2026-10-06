'use client'

import { useGuestName } from '@/hooks/use-guest-name'

/** Tên khách (từ link ?to=...) ngay dưới dòng "Trân trọng kính mời" của thiệp */
export function GuestGreeting() {
  const guestName = useGuestName()
  if (!guestName) return null
  return (
    <>
      <p className="mt-2 font-serif text-2xl sm:text-3xl invite-names break-words">{guestName}</p>
      <p className="mt-1 text-xs sm:text-sm italic invite-muted">tới dự lễ thành hôn của chúng tôi</p>
    </>
  )
}
