'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, FieldLabel } from '@/components/ui/field'
import { FieldSet, FieldLegend } from '@/components/ui/field'
import { useInView } from '@/hooks/use-in-view'

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID

export function RSVPForm() {
  const { ref, isInView } = useInView()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    attendance: 'yes',
    note: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (FORMSPREE_ID) {
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            attendance: formData.attendance === 'yes' ? 'Có, tôi sẽ tham dự' : 'Không, xin lỗi',
            note: formData.note || '(Không có)',
          }),
        })
        if (!res.ok) throw new Error('Gửi thất bại')
        setSubmitted(true)
        setFormData({ name: '', phone: '', attendance: 'yes', note: '' })
        setTimeout(() => setSubmitted(false), 5000)
      } catch {
        setError('Không thể gửi. Vui lòng thử lại hoặc liên hệ trực tiếp.')
      } finally {
        setIsSubmitting(false)
      }
    } else {
      console.log('RSVP Data:', formData)
      setSubmitted(true)
      setFormData({ name: '', phone: '', attendance: 'yes', note: '' })
      setTimeout(() => setSubmitted(false), 3000)
      setIsSubmitting(false)
    }
  }

  return (
    <section id="xac-nhan" className="py-16 sm:py-20 md:py-28" data-theme-section="alt">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="section-frame-light">
          <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-red-900">
                Xác nhận tham dự
              </h2>
            </div>

            <div className="card-wedding theme-card rounded-2xl p-6 sm:p-8 md:p-10">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-red-900 mb-2">Cảm ơn bạn!</h3>
                <p className="text-red-600">Chúng tôi sẽ liên hệ lại với bạn sớm nhất.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <FieldGroup>
                  <FieldLabel htmlFor="name" className="text-red-800">
                    Họ và tên *
                  </FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên của bạn"
                    required
                    className="border-red-200 bg-red-50/50 focus:ring-red-500"
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="phone" className="text-red-800">
                    Số điện thoại *
                  </FieldLabel>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    required
                    className="border-red-200 bg-red-50/50 focus:ring-red-500"
                  />
                </FieldGroup>

                <FieldSet>
                  <FieldLegend className="text-red-800">
                    Bạn có thể tham dự không? *
                  </FieldLegend>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="attendance"
                        value="yes"
                        checked={formData.attendance === 'yes'}
                        onChange={handleChange}
                        className="w-4 h-4 cursor-pointer accent-red-600"
                      />
                      <span className="text-red-800">Có, tôi sẽ tham dự</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="attendance"
                        value="no"
                        checked={formData.attendance === 'no'}
                        onChange={handleChange}
                        className="w-4 h-4 cursor-pointer accent-red-600"
                      />
                      <span className="text-red-800">Không, xin lỗi</span>
                    </label>
                  </div>
                </FieldSet>

                <FieldGroup>
                  <FieldLabel htmlFor="note" className="text-red-800">
                    Ghi chú đặc biệt
                  </FieldLabel>
                  <textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Ví dụ: Thực đơn đặc biệt, số lượng khách..."
                    rows={3}
                    className="w-full px-4 py-3 border border-red-200 rounded-xl bg-red-50/50 text-red-900 placeholder:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </FieldGroup>

                {error && (
                  <p className="text-red-600 text-sm text-center">{error}</p>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-700 hover:bg-red-800 text-white font-medium py-6 rounded-xl transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi xác nhận'}
                </Button>
              </form>
            )}
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
