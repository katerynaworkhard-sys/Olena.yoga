import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { FIELD_LIMITS, isValidEmail, str, isBlank, exceeds } from '@/lib/validation'

const ALLOWED_PLANS = ['3-class-pack', 'monthly-unlimited'] as const

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  try {
    const requests = await prisma.planRequest.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(requests)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!rateLimit(`requests:${clientIp(request)}`, 10, 60 * 1000)) {
    return NextResponse.json({ error: 'Too many submissions. Please slow down.' }, { status: 429 })
  }
  try {
    const body = await request.json().catch(() => ({}))
    const plan = str(body.plan)
    const firstName = str(body.firstName)
    const lastName = str(body.lastName)
    const email = str(body.email)
    const phone = str(body.phone)
    const comment = str(body.comment)

    if (!ALLOWED_PLANS.includes(plan as (typeof ALLOWED_PLANS)[number])) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }
    if (isBlank(firstName) || isBlank(lastName) || isBlank(email) || isBlank(phone)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }
    if (
      exceeds(firstName, FIELD_LIMITS.firstName) ||
      exceeds(lastName, FIELD_LIMITS.lastName) ||
      exceeds(phone, FIELD_LIMITS.phone) ||
      exceeds(comment, FIELD_LIMITS.comment)
    ) {
      return NextResponse.json({ error: 'One or more fields are too long' }, { status: 400 })
    }

    const created = await prisma.planRequest.create({
      data: {
        plan,
        firstName,
        lastName,
        email,
        phone,
        comment: comment || null,
      },
    })

    return NextResponse.json(created)
  } catch (error) {
    console.error('PlanRequest error:', error)
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Request ID required' }, { status: 400 })
    }
    await prisma.planRequest.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 })
  }
}
