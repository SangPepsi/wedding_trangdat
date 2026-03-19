'use client'

import { useState, useRef, useEffect } from 'react'
import { Music, Music2, Palette } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { BACKGROUND_MUSIC } from '@/lib/music'
import { THEMES, type ThemeId } from '@/lib/themes'

const THEME_ORDER: ThemeId[] = ['red', 'green', 'pink', 'white', 'tho', 'moc', 'bordeaux']

export function FloatingActions() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [theme, setTheme] = useState<ThemeId>('bordeaux')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const playlist = BACKGROUND_MUSIC.playlist
    if (playlist.length === 0) return

    const currentIndexRef = { current: 0 }
    const audio = new Audio(playlist[0])
    audio.volume = 0.5
    audioRef.current = audio

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => {
      const nextIndex = (currentIndexRef.current + 1) % playlist.length
      currentIndexRef.current = nextIndex
      audio.src = playlist[nextIndex]
      audio.play().catch(() => {})
    }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.play().then(() => setIsPlaying(true)).catch(() => {})

    const onWeddingOpen = () => {
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    }
    window.addEventListener('wedding-open', onWeddingOpen)
    return () => {
      window.removeEventListener('wedding-open', onWeddingOpen)
      audio.pause()
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('wedding-theme') as ThemeId | null
    const initial = saved && saved in THEMES ? saved : 'bordeaux'
    setTheme(initial)
    document.documentElement.dataset.theme = initial
  }, [])

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  const cycleTheme = () => {
    const idx = THEME_ORDER.indexOf(theme)
    const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length]
    setTheme(next)
    localStorage.setItem('wedding-theme', next)
    document.documentElement.dataset.theme = next
  }

  const btnClass =
    'theme-floating-btn w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 shadow-lg border flex items-center justify-center active:scale-95 transition-all touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2'

  return (
    <div className="fixed z-40 right-4 sm:right-6 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:bottom-6 flex flex-col gap-2">
      {/* Đổi màu nền */}
      <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={cycleTheme}
              className={btnClass}
              aria-label="Đổi màu nền"
            >
              <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={8} className="font-medium">
            Đổi màu nền (hiện: {THEMES[theme].name})
          </TooltipContent>
        </Tooltip>

      {/* Nhạc nền */}
      <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={toggleMusic}
              className={btnClass}
              aria-label={isPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
            >
              {isPlaying ? (
                <Music2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Music className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={8} className="font-medium">
            {isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
          </TooltipContent>
        </Tooltip>
    </div>
  )
}
