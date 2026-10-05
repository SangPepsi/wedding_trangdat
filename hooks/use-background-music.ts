'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BACKGROUND_MUSIC } from '@/lib/music'

export const WEDDING_OPEN_EVENT = 'wedding-open'

/**
 * Chỉ tạo và tải file nhạc khi khách mở thiệp hoặc bấm nút nhạc,
 * để lần tải trang đầu tiên không phải tải vài MB âm thanh.
 */
export function useBackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const trackRef = useRef(0)
  const failedRef = useRef(new Set<number>())
  const pausedByVisibilityRef = useRef(false)

  const getAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current
    const { playlist, volume } = BACKGROUND_MUSIC
    if (playlist.length === 0) return null

    const audio = new Audio(playlist[0])
    audio.volume = volume
    audio.loop = playlist.length === 1
    audio.preload = 'auto'

    const playTrack = (index: number) => {
      trackRef.current = index
      audio.src = playlist[index]
      audio.play().catch(() => {})
    }
    const nextPlayable = () => {
      for (let step = 1; step <= playlist.length; step++) {
        const index = (trackRef.current + step) % playlist.length
        if (!failedRef.current.has(index)) return index
      }
      return null
    }

    audio.addEventListener('play', () => setIsPlaying(true))
    audio.addEventListener('pause', () => setIsPlaying(false))
    audio.addEventListener('ended', () => {
      const next = nextPlayable()
      if (next !== null) playTrack(next)
    })
    audio.addEventListener('error', () => {
      failedRef.current.add(trackRef.current)
      setIsPlaying(false)
      const next = nextPlayable()
      if (next !== null) playTrack(next)
    })

    audioRef.current = audio
    return audio
  }, [])

  const play = useCallback(() => {
    getAudio()?.play().catch(() => {})
  }, [getAudio])

  const toggle = useCallback(() => {
    const audio = getAudio()
    if (!audio) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }, [getAudio])

  useEffect(() => {
    window.addEventListener(WEDDING_OPEN_EVENT, play)

    const onVisibilityChange = () => {
      const audio = audioRef.current
      if (!audio) return
      if (document.hidden && !audio.paused) {
        pausedByVisibilityRef.current = true
        audio.pause()
      } else if (!document.hidden && pausedByVisibilityRef.current) {
        pausedByVisibilityRef.current = false
        audio.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.removeEventListener(WEDDING_OPEN_EVENT, play)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [play])

  return { isPlaying, toggle }
}
