'use client'

import { useState, useEffect } from 'react'
import { Palette } from 'lucide-react'
import { THEMES, type ThemeId } from '@/lib/themes'

const THEME_OPTIONS: { id: ThemeId; color: string }[] = [
  { id: 'red', color: '#fef2f2' },
  { id: 'cream', color: '#fffbeb' },
  { id: 'rose', color: '#fff1f2' },
  { id: 'gold', color: '#fefce8' },
]

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>('red')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('wedding-theme') as ThemeId | null
    if (saved && saved in THEMES) {
      setTheme(saved)
      document.documentElement.dataset.theme = saved
    }
  }, [])

  const applyTheme = (id: ThemeId) => {
    setTheme(id)
    localStorage.setItem('wedding-theme', id)
    document.documentElement.dataset.theme = id
    setOpen(false)
  }

  return (
    <div className="fixed z-40 left-4 sm:left-6 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:bottom-6">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 shadow-lg border border-red-200 flex items-center justify-center text-red-700 hover:text-red-600 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 touch-manipulation"
          aria-label="Đổi màu nền"
          title="Đổi màu nền"
        >
          <Palette className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <div className="absolute bottom-full left-0 mb-2 p-2 rounded-xl bg-white shadow-xl border border-red-100 z-50">
              <p className="text-xs font-medium text-red-800 mb-2 px-2">Màu nền</p>
              <div className="flex gap-2">
                {THEME_OPTIONS.map(({ id, color }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => applyTheme(id)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      theme === id ? 'border-red-600 scale-110' : 'border-red-200 hover:border-red-400'
                    }`}
                    style={{ backgroundColor: color }}
                    title={THEMES[id].name}
                    aria-label={`Chọn theme ${THEMES[id].name}`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
