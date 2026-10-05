'use client'

import { useSyncExternalStore } from 'react'
import { readGuestName } from '@/lib/guest'

const noopSubscribe = () => () => {}

/** Tên khách từ ?to=... (null khi render ở server hoặc link không có tên) */
export function useGuestName() {
  return useSyncExternalStore(
    noopSubscribe,
    () => readGuestName(window.location.search),
    () => null,
  )
}
