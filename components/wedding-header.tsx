'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, Heart } from 'lucide-react'
import { WEDDING } from '@/lib/constants'

const NAV_LINKS = [
  { href: '#cau-chuyen', label: 'Câu chuyện' },
  { href: '#gia-dinh', label: 'Gia đình' },
  { href: '#lich-trinh', label: 'Lịch trình' },
  { href: '#khoanh-khac', label: 'Khoảnh khắc' },
  { href: '#xac-nhan', label: 'Xác nhận' },
  { href: '#hop-mung', label: 'Hộp mừng' },
]

export function WeddingHeader() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const id = setTimeout(() => document.addEventListener('click', handleClickOutside), 0)
    return () => {
      clearTimeout(id)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [open])

  return (
    <header ref={menuRef} className="theme-header fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b shadow-sm safe-area-inset-top">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <a href="#" className="theme-header-brand font-serif text-lg sm:text-xl md:text-2xl font-semibold tracking-wide truncate max-w-[60vw] sm:max-w-none flex items-center flex-nowrap gap-x-1.5">
          <span className="whitespace-nowrap">{WEDDING.groomShort}</span>
          <Heart className="w-4 h-4 opacity-80 fill-current shrink-0" aria-hidden />
          <span className="whitespace-nowrap">{WEDDING.brideShort}</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="theme-header-link text-sm font-medium transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="theme-header-menu-btn md:hidden p-3 -mr-2 -my-2 rounded-lg transition-colors touch-manipulation"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="theme-header-mobile md:hidden absolute top-full left-0 right-0 border-b py-2 px-4 shadow-lg max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="theme-header-link theme-header-mobile-link py-3 px-2 font-medium rounded-lg transition-colors touch-manipulation"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
