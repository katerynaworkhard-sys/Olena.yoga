import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { FIELD_LIMITS, isValidEmail, str, isBlank, exceeds } from '@/lib/validation'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        yogaClass: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(bookings)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!rateLimit(`bookings:${clientIp(request)}`, 10, 60 * 1000)) {
    return NextResponse.json({ error: 'Too many submissions. Please slow down.' }, { status: 429 })
  }
  try {
    const body = await request.json().catch(() => ({}))
    const firstName = str(body.firstName)
    const lastName = str(body.lastName)
    const email = str(body.email)
    const phone = str(body.phone)
    const classId = str(body.classId)

    if (isBlank(firstName) || isBlank(lastName) || isBlank(email) || isBlank(phone) || isBlank(classId)) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }
    if (
      exceeds(firstName, FIELD_LIMITS.firstName) ||
      exceeds(lastName, FIELD_LIMITS.lastName) ||
      exceeds(phone, FIELD_LIMITS.phone)
    ) {
      return NextResponse.json({ error: 'One or more fields are too long' }, { status: 400 })
    }

    // Check if class exists and has spots available
    const yogaClass = await prisma.yogaClass.findUnique({
      where: { id: classId },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    })

    if (!yogaClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    if (yogaClass._count.bookings >= yogaClass.maxSpots) {
      return NextResponse.json({ error: 'Class is full' }, { status: 400 })
    }

    // Check for duplicate booking
    const existingBooking = await prisma.booking.findFirst({
      where: {
        email,
        classId,
      },
    })

    if (existingBooking) {
      return NextResponse.json({ error: 'You have already booked this class' }, { status: 400 })
    }

    const booking = await prisma.booking.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        classId,
      },
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 })
    }

    await prisma.booking.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}
