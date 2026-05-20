import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  try {
    // Get classes from today onwards
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const classes = await prisma.yogaClass.findMany({
      where: {
        date: {
          gte: today,
        },
      },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' },
      ],
    })
    return NextResponse.json(classes)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied
  try {
    const body = await request.json()
    const { dayOfWeek, date, time, type, duration, location, maxSpots } = body

    const yogaClass = await prisma.yogaClass.create({
      data: {
        dayOfWeek,
        date: new Date(date),
        time,
        type,
        duration,
        location,
        maxSpots: maxSpots || 10,
      },
    })

    return NextResponse.json(yogaClass)
  } catch (error) {
    console.error('Create class error:', error)
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Class ID required' }, { status: 400 })
    }

    await prisma.yogaClass.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete class' }, { status: 500 })
  }
}
