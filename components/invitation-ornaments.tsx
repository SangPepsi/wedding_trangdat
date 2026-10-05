/** Hoạ tiết viền vàng cho khung thiệp: góc hoa văn và đường phân cách */

const CORNER_ROTATION = {
  'top-left': 'rotate-0',
  'top-right': 'rotate-90',
  'bottom-right': 'rotate-180',
  'bottom-left': '-rotate-90',
} as const

const CORNER_POSITION = {
  'top-left': 'top-2 left-2',
  'top-right': 'top-2 right-2',
  'bottom-right': 'bottom-2 right-2',
  'bottom-left': 'bottom-2 left-2',
} as const

export function CornerOrnament({ position }: { position: keyof typeof CORNER_ROTATION }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      className={`invite-corner absolute ${CORNER_POSITION[position]} ${CORNER_ROTATION[position]}`}
      aria-hidden
    >
      <path d="M4 44V12a8 8 0 0 1 8-8h32" />
      <path d="M11 54V19a8 8 0 0 1 8-8h35" opacity="0.55" />
      <path d="M19 19c10 0 16 6 16 16-10 0-16-6-16-16Z" fill="currentColor" fillOpacity="0.18" />
      <path d="M19 19c6 2 10 6 12 12" opacity="0.7" />
      <path d="M26 12c4-4 10-5 14-2-4 4-10 5-14 2Z" fill="currentColor" fillOpacity="0.25" />
      <path d="M12 26c-4 4-5 10-2 14 4-4 5-10 2-14Z" fill="currentColor" fillOpacity="0.25" />
      <circle cx="4" cy="50" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="50" cy="4" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="19" cy="19" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function OrnamentDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`} aria-hidden>
      <span className="invite-rule w-12 sm:w-16" />
      <svg viewBox="0 0 24 12" className="w-7 h-3.5 text-[#b08440]" fill="currentColor">
        <path d="M1 6l3-3 3 3-3 3z" />
        <path d="M17 6l3-3 3 3-3 3z" />
        <circle cx="12" cy="6" r="1.8" />
      </svg>
      <span className="invite-rule w-12 sm:w-16" />
    </div>
  )
}
