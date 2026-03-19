'use client'

import { useInView } from '@/hooks/use-in-view'
import { LOVE_STORY } from '@/lib/constants'

export function StorySection() {
  const { ref, isInView } = useInView()

  return (
    <section id="cau-chuyen" className="py-16 sm:py-20 md:py-28" data-theme-section="alt">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`border-wedding-section rounded-2xl p-8 sm:p-10 md:p-12 transition-all duration-700 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-red-900 mb-6 sm:mb-8 text-center">
            {LOVE_STORY.title}
          </h2>

          {LOVE_STORY.story && (
            <p className="text-base sm:text-lg text-red-800 leading-relaxed text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
              {LOVE_STORY.story}
            </p>
          )}

          {/* Timeline dọc - đường vàng, chấm vàng, nội dung xen kẽ trái-phải */}
          <div className="relative">
            {/* Đường dọc vàng */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-[#d4a574]" />

            {LOVE_STORY.timeline.map((item, i) => {
              const isLeft = i % 2 === 0
              return (
                <div
                  key={i}
                  className="relative flex items-center min-h-[4rem] py-6 first:pt-0 last:pb-0"
                >
                  {/* Bên trái đường */}
                  <div className="flex-1 flex justify-end pr-6 sm:pr-8">
                    {isLeft && (
                      <div className="text-right max-w-[85%] sm:max-w-[75%]">
                        <p className="font-bold text-red-900 text-base sm:text-lg">{item.date}</p>
                        <p className="text-red-700 text-sm sm:text-base mt-0.5">{item.event}</p>
                      </div>
                    )}
                  </div>

                  {/* Chấm vàng trên đường */}
                  <div className="w-4 h-4 rounded-full bg-[#d4a574] border-2 border-white shadow-md shrink-0 z-10" />

                  {/* Bên phải đường */}
                  <div className="flex-1 flex justify-start pl-6 sm:pl-8">
                    {!isLeft && (
                      <div className="text-left max-w-[85%] sm:max-w-[75%]">
                        <p className="font-bold text-red-900 text-base sm:text-lg">{item.date}</p>
                        <p className="text-red-700 text-sm sm:text-base mt-0.5">{item.event}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
