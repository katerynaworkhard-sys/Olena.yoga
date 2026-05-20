import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
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
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, classId } = body

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
