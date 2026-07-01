'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Check } from 'lucide-react'

const INQUIRY_TYPES = ['Resort', 'Retreat', 'Private Class', 'Corporate / Event', 'Other']

export default function InquiriesPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    location: '',
    inquiryType: '',
    preferredDates: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }
      setIsSuccess(true)
      setFormData({
        name: '',
        email: '',
        company: '',
        location: '',
        inquiryType: '',
        preferredDates: '',
        message: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 border border-[#E8E4DE] rounded-sm focus:outline-none focus:border-[#7BA7BC] bg-[#FAFAF8]'

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Header + dual CTA */}
        <section className="py-16 lg:py-24 bg-[#FAFAF8]">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <span className="text-xs uppercase tracking-wider text-[#7BA7BC] font-medium">
              Partnerships
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1A1A18] mt-2 mb-6">
              Make an Inquiry
            </h1>
            <p className="text-lg text-[#1A1A18]/60 max-w-2xl mx-auto mb-8">
              Bring intentional yoga to your resort, retreat, studio, or private event. Whether
              it&apos;s a one-time session or an ongoing partnership, let&apos;s create something
              memorable together.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block bg-white border border-[#1A1A18] text-[#1A1A18] px-8 py-4 text-sm font-medium rounded-sm hover:bg-[#1A1A18] hover:text-white transition-colors"
              >
                Get in Touch
              </Link>
              <a
                href="#inquiry-form"
                className="inline-block bg-[#1A1A18] text-[#FAFAF8] px-8 py-4 text-sm font-medium rounded-sm hover:bg-[#7BA7BC] transition-colors"
              >
                Make an Inquiry
              </a>
            </div>
          </div>
        </section>

        {/* Inquiry form */}
        <section id="inquiry-form" className="py-16 bg-white scroll-mt-24">
          <div className="max-w-2xl mx-auto px-6 lg:px-8">
            {isSuccess ? (
              <div className="bg-[#7BA7BC]/10 rounded-sm p-10 text-center">
                <div className="w-14 h-14 bg-[#7BA7BC]/20 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Check className="text-[#7BA7BC]" size={26} />
                </div>
                <h3 className="font-serif text-2xl text-[#1A1A18] mb-2">Inquiry Sent!</h3>
                <p className="text-sm text-[#1A1A18]/60 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Olena reviews every inquiry personally and will get
                  back to you within one to two days.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 text-[#7BA7BC] text-sm hover:underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <p className="text-[#1A1A18]/70">
                    For resort, retreat, or private class inquiries, please contact me below.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A18] mb-2">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A18] mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A18] mb-2">
                        Property / Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A18] mb-2">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., Newport Beach, CA"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A18] mb-2">
                        Type of Inquiry
                      </label>
                      <select
                        required
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className={inputClass}
                      >
                        <option value="" disabled>
                          Select…
                        </option>
                        {INQUIRY_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A18] mb-2">
                        Preferred Dates
                      </label>
                      <input
                        type="text"
                        value={formData.preferredDates}
                        onChange={(e) => setFormData({ ...formData, preferredDates: e.target.value })}
                        placeholder="e.g., Weekend of Aug 15, or flexible"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1A18] mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your space, your guests, and what you have in mind…"
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-sm">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1A1A18] text-[#FAFAF8] py-4 text-sm font-medium rounded-sm hover:bg-[#7BA7BC] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending…' : 'Send Inquiry'}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
