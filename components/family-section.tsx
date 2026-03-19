'use client'

import { useInView } from '@/hooks/use-in-view'
import { FAMILY_INFO } from '@/lib/family'

export function FamilySection() {
  const { ref, isInView } = useInView()

  return (
    <section id="gia-dinh" className="py-16 sm:py-20 md:py-28" data-theme-section="main">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="section-frame-light">
          <div
            ref={ref}
            className={`text-center mb-10 sm:mb-14 transition-all duration-700 ease-out ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-red-900">
              Gia đình hai bên
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div
            className={`card-wedding theme-card rounded-2xl p-6 sm:p-8 transition-all duration-700 ease-out ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <h3 className="text-xl font-serif font-semibold text-red-900 mb-6 text-center">
              Nhà trai
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-red-500 uppercase tracking-wider mb-1">Ông</p>
                <p className="text-lg font-medium text-red-800">
                  {FAMILY_INFO.nhaTrai.ong || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-red-500 uppercase tracking-wider mb-1">Bà</p>
                <p className="text-lg font-medium text-red-800">
                  {FAMILY_INFO.nhaTrai.ba || '—'}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`card-wedding theme-card rounded-2xl p-6 sm:p-8 transition-all duration-700 ease-out ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <h3 className="text-xl font-serif font-semibold text-red-900 mb-6 text-center">
              Nhà gái
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-red-500 uppercase tracking-wider mb-1">Ông</p>
                <p className="text-lg font-medium text-red-800">
                  {FAMILY_INFO.nhaGai.ong || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-red-500 uppercase tracking-wider mb-1">Bà</p>
                <p className="text-lg font-medium text-red-800">
                  {FAMILY_INFO.nhaGai.ba || '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
