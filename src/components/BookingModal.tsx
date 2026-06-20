'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface YogaClass {
  id: string
  dayOfWeek: string
  date: string
  time: string
  type: string
  duration: number
  location: string
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  yogaClass: YogaClass
}

export default function BookingModal({ isOpen, onClose, yogaClass }: BookingModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          classId: yogaClass.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to book class')
      }

      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const date = new Date(yogaClass.date)
  const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FAFAF8] rounded-sm max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl text-[#1A1A18]">Book Your Spot</h2>
            <button
              onClick={onClose}
              className="text-[#1A1A18]/60 hover:text-[#1A1A18] transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#7BA7BC]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#7BA7BC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-[#1A1A18] mb-2">Booking Confirmed!</h3>
              <p className="text-[#1A1A18]/60 text-sm mb-4">
                See you on the mat, {formData.firstName}!
              </p>
              <button
                onClick={onClose}
                className="bg-[#1A1A18] text-[#FAFAF8] px-6 py-2.5 text-sm font-medium rounded-sm hover:bg-[#7BA7BC] transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="bg-[#7BA7BC]/10 rounded-sm p-4 mb-6">
                <p className="font-medium text-[#1A1A18]">{yogaClass.type}</p>
                <p className="text-sm text-[#1A1A18]/60">
                  {yogaClass.dayOfWeek}, {formattedDate} at {yogaClass.time}
                </p>
                <p className="text-sm text-[#1A1A18]/60">{yogaClass.location}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A18] mb-1.5">First Name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2.5 border border-[#E8E4DE] rounded-sm text-sm focus:outline-none focus:border-[#7BA7BC] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A18] mb-1.5">Last Name</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2.5 border border-[#E8E4DE] rounded-sm text-sm focus:outline-none focus:border-[#7BA7BC] bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A18] mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#E8E4DE] rounded-sm text-sm focus:outline-none focus:border-[#7BA7BC] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A18] mb-1.5">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#E8E4DE] rounded-sm text-sm focus:outline-none focus:border-[#7BA7BC] bg-white"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1A1A18] text-[#FAFAF8] py-3 text-sm font-medium rounded-sm hover:bg-[#7BA7BC] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm My Spot'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
