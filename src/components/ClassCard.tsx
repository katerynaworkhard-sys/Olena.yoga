'use client'

import { useState } from 'react'
import BookingModal from './BookingModal'

interface YogaClass {
  id: string
  dayOfWeek: string
  date: string
  time: string
  type: string
  duration: number
  location: string
  maxSpots: number
  _count?: {
    bookings: number
  }
}

interface ClassCardProps {
  yogaClass: YogaClass
}

const typeColors: Record<string, string> = {
  'Vinyasa': 'bg-[#7BA7BC]',
  'Hot Vinyasa': 'bg-[#7BA7BC]',
  'Hatha': 'bg-[#8B9A7C]',
  'Yin': 'bg-[#A69CC0]',
  'Yin Yoga': 'bg-[#A69CC0]',
  'Sculpt': 'bg-[#C98B76]',
  'Yoga Sculpt': 'bg-[#C98B76]',
}

export default function ClassCard({ yogaClass }: ClassCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const spotsTaken = yogaClass._count?.bookings || 0
  const spotsRemaining = yogaClass.maxSpots - spotsTaken
  const isFull = spotsRemaining <= 0

  const date = new Date(yogaClass.date)
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <>
      <div className="bg-white rounded-sm border border-[#E8E4DE] p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#7BA7BC] font-medium">
              {yogaClass.dayOfWeek}
            </span>
            <p className="text-sm text-[#1A1A18]/60 mt-1">{formattedDate}</p>
          </div>
          <span className={`${typeColors[yogaClass.type] || 'bg-[#7BA7BC]'} text-white text-xs px-3 py-1 rounded-full`}>
            {yogaClass.type}
          </span>
        </div>

        <h3 className="font-serif text-2xl text-[#1A1A18] mb-2">{yogaClass.time}</h3>
        <p className="text-sm text-[#1A1A18]/60 mb-1">{yogaClass.duration} min</p>
        <p className="text-sm text-[#1A1A18]/80 mb-4">{yogaClass.location}</p>

        <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DE]">
          <span className={`text-sm ${isFull ? 'text-red-500' : 'text-[#1A1A18]/60'}`}>
            {isFull ? 'Class Full' : `${spotsRemaining} / ${yogaClass.maxSpots} spots left`}
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isFull}
            className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
              isFull
                ? 'bg-[#E8E4DE] text-[#1A1A18]/40 cursor-not-allowed'
                : 'bg-[#1A1A18] text-[#FAFAF8] hover:bg-[#7BA7BC]'
            }`}
          >
            {isFull ? 'Full' : 'Book This Class'}
          </button>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        yogaClass={yogaClass}
      />
    </>
  )
}
