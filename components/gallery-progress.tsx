interface SlideProgressProps {
  /** Đổi key mỗi khi sang ảnh mới để thanh chạy lại từ đầu */
  slideKey: number
  duration: number
  running: boolean
  onDone: () => void
  className?: string
}

/** Thanh tiến trình của slideshow - hết animation thì chuyển ảnh, nên tạm dừng giữ nguyên thời gian còn lại */
export function SlideProgress({ slideKey, duration, running, onDone, className = '' }: SlideProgressProps) {
  return (
    <span
      key={slideKey}
      className={`gallery-progress-fill ${className}`}
      style={
        {
          '--slide-duration': `${duration}ms`,
          animationPlayState: running ? 'running' : 'paused',
        } as React.CSSProperties
      }
      onAnimationEnd={onDone}
    />
  )
}
