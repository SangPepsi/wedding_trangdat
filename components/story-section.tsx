import { LOVE_STORY } from '@/lib/constants'
import { Reveal } from './reveal'

export function StorySection() {
  return (
    <section id="cau-chuyen" className="py-16 sm:py-20 md:py-28 scroll-mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Reveal className="section-frame">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-w-strong mb-6 sm:mb-8 text-center">
            {LOVE_STORY.title}
          </h2>

          {LOVE_STORY.story && (
            <p className="text-base sm:text-lg text-w-text leading-relaxed text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
              {LOVE_STORY.story}
            </p>
          )}

          {/* Timeline dọc - nội dung xen kẽ trái-phải */}
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-w-gold" aria-hidden />
            <ol>
              {LOVE_STORY.timeline.map((item, i) => {
                const isLeft = i % 2 === 0
                const content = (
                  <div className={`max-w-[85%] sm:max-w-[75%] ${isLeft ? 'text-right' : 'text-left'}`}>
                    <p className="font-bold text-w-strong text-base sm:text-lg">{item.date}</p>
                    <p className="text-w-soft text-sm sm:text-base mt-0.5">{item.event}</p>
                  </div>
                )
                return (
                  <li key={item.date} className="relative flex items-center min-h-[4rem] py-6 first:pt-0 last:pb-0">
                    <div className="flex-1 flex justify-end pr-6 sm:pr-8">{isLeft && content}</div>
                    <div className="w-4 h-4 rounded-full bg-w-gold border-2 border-white shadow-md shrink-0 z-10" aria-hidden />
                    <div className="flex-1 flex justify-start pl-6 sm:pl-8">{!isLeft && content}</div>
                  </li>
                )
              })}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
