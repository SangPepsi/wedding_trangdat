'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'
import {
  DEFAULT_THEME,
  THEMES,
  THEME_ORDER,
  THEME_STORAGE_KEY,
  isThemeId,
  type ThemeId,
} from '@/lib/themes'

const CHANGE_EVENT = 'wedding-theme-change'
const REVEAL_DURATION = 700

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => window.removeEventListener(CHANGE_EVENT, onChange)
}

function getSnapshot(): ThemeId {
  const current = document.documentElement.dataset.theme
  return isThemeId(current) ? current : DEFAULT_THEME
}

function getServerSnapshot(): ThemeId {
  return DEFAULT_THEME
}

function syncBrowserThemeColor() {
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--w-bg').trim()
  if (bg) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg)
}

function applyTheme(next: ThemeId) {
  document.documentElement.dataset.theme = next
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next)
  } catch {
    // Safari chế độ riêng tư có thể chặn localStorage
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function useWeddingTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    syncBrowserThemeColor()
  }, [theme])

  const cycleTheme = useCallback((event?: { currentTarget: EventTarget | null }) => {
    const next = THEME_ORDER[(THEME_ORDER.indexOf(getSnapshot()) + 1) % THEME_ORDER.length]
    const doc = document as ViewTransitionDocument
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!doc.startViewTransition || reduceMotion) {
      applyTheme(next)
      return
    }

    const rect =
      event?.currentTarget instanceof Element ? event.currentTarget.getBoundingClientRect() : null
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

    const transition = doc.startViewTransition(() => applyTheme(next))
    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
          },
          {
            duration: REVEAL_DURATION,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      })
      .catch(() => {})
  }, [])

  return { theme, themeName: THEMES[theme].name, cycleTheme }
}
