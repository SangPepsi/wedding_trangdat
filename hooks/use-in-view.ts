'use client'

import { useEffect, useRef, useState } from 'react'

export function useInView(options: IntersectionObserverInit = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const opts = { threshold: 0.1, ...options }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsInView(true)
        observer.unobserve(entry.target)
      }
    }, opts)

    const el = ref.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, []) // options bỏ khỏi deps để tránh re-run mỗi render khi caller truyền {}

  return { ref, isInView }
}
