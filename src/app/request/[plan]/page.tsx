'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import { Sparkles, Check, ArrowLeft } from 'lucide-react'

type PlanSlug = '3-class-pack' | 'monthly-unlimited'

const PLAN_DETAILS: Record<PlanSlug, {
  name: string
  price: string
  perClass: string
  tagline: string
  inclusions: string[]
}> = {
  '3-class-pack': {
    name: '3-Class Pack',
    price: '$65',
    perClass: '$21.67 / class',
    tagline: 'A considered immersion — three sessions to deepen your practice.',
    inclusions: [
      'Three private-feeling group sessions',
      'Priority placement on the mat',
      'Personal note from Olena upon confirmation',
    ],
  },
  'monthly-unlimited': {
    name: 'Monthly Unlimited',
    price: '$180',
    perClass: '$15 / class',
    tagline: 'For the devoted. Unlimited access, full attention.',
    inclusions: [
      'Twelve classes — show up as often as you wish',
      'First pick on every schedule release',
      'Direct line to Olena for guidance between sessions',
      'A small welcome ritual reserved for committed members',
    ],
  },
}

function isPlanSlug(value: string): value is PlanSlug {
  return value === '3-class-pack' || value === 'monthly-unlimited'
}

export default function RequestPage({
  params,
}: {
  params: Promise<{ plan: string }>
}) {
  const { plan } = use(params)
  const router = useRouter()

  if (!isPlanSlug(plan)) {
    notFound()
  }

  const details = PLAN_DETAILS[plan]

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          firstName,
          lastName,
          email,
          phone,
          comment,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] via-[#F5F1EA] to-[#FAFAF8]">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#1A1A18]/60 hover:text-[#7BA7BC] transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Brand crest */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="inline-block font-serif text-lg text-[#1A1A18] tracking-wider"
          >
            Olena <span className="text-[#7BA7BC]">·</span> Yoga
          </Link>
        </div>

        <div className="bg-white rounded-sm border border-[#E8E4DE] shadow-[0_30px_60px_-30px_rgba(123,167,188,0.25)] overflow-hidden">
          {/* Header band */}
          <div className="bg-gradient-to-r from-[#7BA7BC]/10 via-white to-[#7BA7BC]/10 px-8 lg:px-14 py-10 text-center border-b border-[#E8E4DE]">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#7BA7BC] font-medium">
              <Sparkles size={14} />
              <span>By Invitation</span>
              <Sparkles size={14} />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A18] mt-4">
              {details.name}
            </h1>
            <p className="mt-3 text-sm md:text-base text-[#1A1A18]/70 italic">
              {details.tagline}
            </p>
            <div className="mt-6 flex items-baseline justify-center gap-3">
              <span className="font-serif text-4xl text-[#7BA7BC]">{details.price}</span>
              <span className="text-xs uppercase tracking-wider text-[#1A1A18]/50">
                {details.perClass}
              </span>
            </div>
          </div>

          {submitted ? (
            <div className="px-8 lg:px-14 py-14 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#7BA7BC]/15 flex items-center justify-center">
                <Check className="text-[#7BA7BC]" size={26} />
              </div>
              <h2 className="font-serif text-2xl text-[#1A1A18] mt-6">
                Thank you, {firstName || 'friend'}.
              </h2>
              <p className="mt-3 text-sm text-[#1A1A18]/70 max-w-md mx-auto leading-relaxed">
                Your request has been received with care. Olena reviews each note personally
                and will reach out to you within one to two days to welcome you onto the mat.
              </p>
              <Link
                href="/"
                className="inline-block mt-8 text-sm uppercase tracking-wider text-[#7BA7BC] hover:text-[#1A1A18] transition-colors border-b border-[#7BA7BC]/40 hover:border-[#1A1A18] pb-1"
              >
                Return Home
              </Link>
            </div>
          ) : (
            <div className="px-8 lg:px-14 py-10 lg:py-12">
              {/* Inclusions */}
              <div className="mb-10">
                <p className="text-xs uppercase tracking-[0.2em] text-[#1A1A18]/50 mb-4">
                  What you receive
                </p>
                <ul className="space-y-2.5">
                  {details.inclusions.map((line) => (
                    <li key={line} className="flex items-start gap-3 text-sm text-[#1A1A18]/80">
                      <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#7BA7BC] shrink-0" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-[#E8E4DE] pt-10">
                <p className="text-xs uppercase tracking-[0.2em] text-[#1A1A18]/50 mb-2">
                  Reserve your place
                </p>
                <h2 className="font-serif text-2xl text-[#1A1A18] mb-2">
                  Leave a personal note
                </h2>
                <p className="text-sm text-[#1A1A18]/60 mb-8 leading-relaxed">
                  This is a private request. Tell us a little about you and what you&apos;re
                  looking for — Olena reads every message herself.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#1A1A18]/60 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FAFAF8] border border-[#E8E4DE] rounded-sm text-sm focus:outline-none focus:border-[#7BA7BC] focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#1A1A18]/60 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FAFAF8] border border-[#E8E4DE] rounded-sm text-sm focus:outline-none focus:border-[#7BA7BC] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#1A1A18]/60 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FAFAF8] border border-[#E8E4DE] rounded-sm text-sm focus:outline-none focus:border-[#7BA7BC] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#1A1A18]/60 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FAFAF8] border border-[#E8E4DE] rounded-sm text-sm focus:outline-none focus:border-[#7BA7BC] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#1A1A18]/60 mb-2">
                      What are you looking for?
                    </label>
                    <textarea
                      rows={5}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share anything that would help us prepare your space — preferred days, intentions, injuries, level of experience…"
                      className="w-full px-4 py-3 bg-[#FAFAF8] border border-[#E8E4DE] rounded-sm text-sm focus:outline-none focus:border-[#7BA7BC] focus:bg-white transition-colors resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-sm">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#1A1A18] text-[#FAFAF8] py-4 text-sm uppercase tracking-[0.2em] font-medium rounded-sm hover:bg-[#7BA7BC] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Sending…' : 'Send My Request'}
                  </button>

                  <p className="text-xs text-center text-[#1A1A18]/50 italic pt-2">
                    Each request is reviewed personally. You will hear back within 1–2 days.
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
