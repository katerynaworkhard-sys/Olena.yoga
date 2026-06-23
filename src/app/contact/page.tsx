'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Mail, MapPin } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }
      setIsSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="py-16 bg-[#FAFAF8]">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1A1A18] mb-4">
              Let's connect.
            </h1>
            <p className="text-lg text-[#1A1A18]/60">
              Have a question about classes, locations, or pricing? 
              Reach out — I'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                {isSuccess ? (
                  <div className="bg-[#7BA7BC]/10 rounded-sm p-8 text-center">
                    <div className="w-12 h-12 bg-[#7BA7BC]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-[#7BA7BC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-xl text-[#1A1A18] mb-2">Message Sent!</h3>
                    <p className="text-sm text-[#1A1A18]/60">
                      Thank you for reaching out. I'll get back to you soon.
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="mt-4 text-[#7BA7BC] text-sm hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A18] mb-2">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-[#E8E4DE] rounded-sm focus:outline-none focus:border-[#7BA7BC] bg-[#FAFAF8]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A18] mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-[#E8E4DE] rounded-sm focus:outline-none focus:border-[#7BA7BC] bg-[#FAFAF8]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A18] mb-2">Phone</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-[#E8E4DE] rounded-sm focus:outline-none focus:border-[#7BA7BC] bg-[#FAFAF8]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A18] mb-2">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-[#E8E4DE] rounded-sm focus:outline-none focus:border-[#7BA7BC] bg-[#FAFAF8] resize-none"
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
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-xl text-[#1A1A18] mb-4">Direct Contact</h3>
                  <div className="space-y-4">
                    <a 
                      href="mailto:olena.pruska@yahoo.com" 
                      className="flex items-center gap-3 text-[#1A1A18]/70 hover:text-[#7BA7BC] transition-colors"
                    >
                      <Mail size={20} />
                      <span>olena.pruska@yahoo.com</span>
                    </a>
                    <div className="flex items-start gap-3 text-[#1A1A18]/70">
                      <MapPin size={20} className="shrink-0 mt-0.5" />
                      <span>Huntington Beach, CA 92648</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl text-[#1A1A18] mb-4">Social</h3>
                  <div className="flex gap-4">
                    <a
                      href="https://www.instagram.com/olena_pruska/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1A1A18]/70 hover:text-[#7BA7BC] transition-colors"
                    >
                      Instagram
                    </a>
                  </div>
                </div>

                <div className="bg-[#C4B9A8]/10 rounded-sm p-6">
                  <h3 className="font-serif text-lg text-[#1A1A18] mb-3">Location Note</h3>
                  <p className="text-sm text-[#1A1A18]/60 leading-relaxed">
                    Classes are held across Huntington Beach & Orange County.
                    Exact locations are shared upon booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
