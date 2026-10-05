'use client'

import { useState } from 'react'
import { Music, Palette } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useBackgroundMusic } from '@/hooks/use-background-music'
import { useWeddingTheme } from '@/hooks/use-wedding-theme'

const btnClass =
  'theme-floating-btn w-11 h-11 rounded-full shadow-lg border flex items-center justify-center active:scale-95 transition-all touch-manipulation focus:outline-none'

export function FloatingActions() {
  const { isPlaying, toggle } = useBackgroundMusic()
  const { themeName, cycleTheme } = useWeddingTheme()
  const [toastKey, setToastKey] = useState(0)

  return (
    <div className="fixed z-40 right-4 sm:right-6 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:bottom-6 flex flex-col gap-2">
      {toastKey > 0 && (
        <span key={toastKey} className="theme-toast" role="status">
          {themeName}
        </span>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={(e) => {
              cycleTheme(e)
              setToastKey((k) => k + 1)
            }}
            className={btnClass}
            aria-label={`Đổi màu nền (hiện: ${themeName})`}
          >
            <Palette className="w-5 h-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={8} className="font-medium">
          Đổi màu nền (hiện: {themeName})
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={toggle}
            className={btnClass}
            aria-label={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
            aria-pressed={isPlaying}
          >
            {isPlaying ? (
              <span className="music-bars" aria-hidden>
                <span />
                <span />
                <span />
              </span>
            ) : (
              <Music className="w-5 h-5" />
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
