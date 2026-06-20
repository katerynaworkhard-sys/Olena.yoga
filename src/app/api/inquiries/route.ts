import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { FIELD_LIMITS, isValidEmail, str, isBlank, exceeds } from '@/lib/validation'

const ALLOWED_TYPES = [
  'Resort',
  'Retreat',
  'Private Class',
  'Corporate / Event',
  'Other',
] as const

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  try {
    const inquiries = await prisma.businessInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(inquiries)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!rateLimit(`inquiries:${clientIp(request)}`, 10, 60 * 1000)) {
    return NextResponse.json({ error: 'Too many submissions. Please slow down.' }, { status: 429 })
  }
  try {
    const body = await request.json().catch(() => ({}))
    const name = str(body.name)
    const email = str(body.email)
    const company = str(body.company)
    const location = str(body.location)
    const inquiryType = str(body.inquiryType)
    const preferredDates = str(body.preferredDates)
    const message = str(body.message)

    if (isBlank(name) || isBlank(email) || isBlank(message)) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(inquiryType as (typeof ALLOWED_TYPES)[number])) {
      return NextResponse.json({ error: 'Please select a type of inquiry' }, { status: 400 })
    }
    if (
      exceeds(name, FIELD_LIMITS.name) ||
      exceeds(company, FIELD_LIMITS.company) ||
      exceeds(location, FIELD_LIMITS.location) ||
      exceeds(preferredDates, FIELD_LIMITS.preferredDates) ||
      exceeds(message, FIELD_LIMITS.message)
    ) {
      return NextResponse.json({ error: 'One or more fields are too long' }, { status: 400 })
    }

    const created = await prisma.businessInquiry.create({
      data: {
        name,
        email,
        company: company || null,
        location: location || null,
        inquiryType,
        preferredDates: preferredDates || null,
        message,
      },
    })

    return NextResponse.json(created)
  } catch (error) {
    console.error('BusinessInquiry error:', error)
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Inquiry ID required' }, { status: 400 })
    }
    await prisma.businessInquiry.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 })
  }
}
