'use client'

import { useState, useRef, useEffect } from 'react'
import { Music, Music2 } from 'lucide-react'
import { BACKGROUND_MUSIC } from '@/lib/music'

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(BACKGROUND_MUSIC.src)
    audio.loop = true
    audio.volume = 0.5
    audioRef.current = audio

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.pause()
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audioRef.current = null
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 shadow-lg border border-red-200 flex items-center justify-center text-red-700 hover:text-red-600 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 touch-manipulation right-4 sm:right-6 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:bottom-6"
      aria-label={isPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
      title={isPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
    >
      {isPlaying ? (
        <Music2 className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
      ) : (
        <Music className="w-5 h-5 sm:w-6 sm:h-6" />
      )}
    </button>
  )
}
