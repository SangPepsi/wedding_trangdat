'use client'

import { MapPin, Clock, CalendarPlus } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'
import { WEDDING, FAMILY_ADDRESSES } from '@/lib/constants'

function EventCard({
  title,
  time,
  venue,
  isInView,
  delay,
}: {
  title: string
  time: string
  venue: string
  isInView: boolean
  delay: string
}) {
  return (
    <div
      className={`card-wedding theme-card rounded-2xl p-6 sm:p-8 transition-all duration-700 ease-out ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: delay }}
    >
      <h3 className="text-xl font-serif font-semibold text-red-900 mb-6">{title}</h3>
      <div className="space-y-5">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-red-700" />
          </div>
          <div>
            <p className="text-sm text-red-500 uppercase tracking-wider">Thời gian</p>
            <p className="font-medium text-red-800">{time}</p>
            <p className="text-sm text-red-600">{WEDDING.date}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-red-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-red-500 uppercase tracking-wider mb-2">Địa điểm</p>
              <p className="font-medium text-red-800">{venue}</p>
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-xs font-medium text-red-600">{FAMILY_ADDRESSES.groomFamily.label}</p>
                  <p className="text-sm text-red-700">{FAMILY_ADDRESSES.groomFamily.address}</p>
                  <a
                    href={FAMILY_ADDRESSES.groomFamily.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-xs mt-1"
                  >
                    <MapPin className="w-3 h-3" />
                    Xem bản đồ
                  </a>
                </div>
                <div>
                  <p className="text-xs font-medium text-red-600">{FAMILY_ADDRESSES.brideFamily.label}</p>
                  <p className="text-sm text-red-700">{FAMILY_ADDRESSES.brideFamily.address}</p>
                  <a
                    href={FAMILY_ADDRESSES.brideFamily.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-xs mt-1"
                  >
                    <MapPin className="w-3 h-3" />
                    Xem bản đồ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ScheduleSection() {
  const { ref, isInView } = useInView()

  return (
    <section id="lich-trinh" className="py-16 sm:py-20 md:py-28" data-theme-section="alt">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`text-center mb-10 sm:mb-14 transition-all duration-700 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-red-900 mb-6 sm:mb-8">
            Lịch trình
          </h2>
        </div>

        <a
          href={WEDDING.addToCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`add-to-calendar inline-flex items-center justify-center gap-2.5 bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 mb-6 sm:mb-8 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '50ms' }}
        >
          <CalendarPlus className="w-5 h-5" />
          Thêm vào lịch
        </a>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <EventCard
            title={WEDDING.ceremony.name}
            time={WEDDING.ceremony.time}
            venue={WEDDING.ceremony.venue}
            isInView={isInView}
            delay="100ms"
          />
          <EventCard
            title={WEDDING.intimateMeal.name}
            time={WEDDING.intimateMeal.time}
            venue={WEDDING.intimateMeal.venue}
            isInView={isInView}
            delay="200ms"
          />
        </div>
      </div>
    </section>
  )
}
