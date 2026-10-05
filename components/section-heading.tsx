import { Reveal } from './reveal'

interface SectionHeadingProps {
  children: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
}

export function SectionHeading({ children, description, icon }: SectionHeadingProps) {
  return (
    <Reveal className="text-center mb-10 sm:mb-14">
      {icon && (
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-full bg-w-tint text-w-soft flex items-center justify-center">
            {icon}
          </div>
        </div>
      )}
      <h2 className="heading-title text-4xl md:text-5xl font-serif font-bold text-w-strong">{children}</h2>
      <div className="heading-ornament mt-4" aria-hidden>
        <span className="heading-line heading-line-left" />
        <svg viewBox="0 0 24 24" className="heading-heart">
          <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 5 6.4 5c2 0 3.6 1.1 4.6 2.6l1 1.4 1-1.4C14 6.1 15.6 5 17.6 5 21 5 23.1 8.4 21.6 11.8 19.5 16.4 12 21 12 21z" />
        </svg>
        <span className="heading-line heading-line-right" />
      </div>
      {description && (
        <p className="text-w-muted max-w-md mx-auto text-sm sm:text-base px-2 mt-4">{description}</p>
      )}
    </Reveal>
  )
}
