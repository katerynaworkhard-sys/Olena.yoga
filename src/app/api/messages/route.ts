import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { FIELD_LIMITS, isValidEmail, str, isBlank, exceeds } from '@/lib/validation'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(messages)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!rateLimit(`messages:${clientIp(request)}`, 10, 60 * 1000)) {
    return NextResponse.json({ error: 'Too many submissions. Please slow down.' }, { status: 429 })
  }
  try {
    const body = await request.json().catch(() => ({}))
    const name = str(body.name)
    const email = str(body.email)
    const phone = str(body.phone)
    const message = str(body.message)

    if (isBlank(name) || isBlank(email) || isBlank(phone) || isBlank(message)) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }
    if (
      exceeds(name, FIELD_LIMITS.name) ||
      exceeds(phone, FIELD_LIMITS.phone) ||
      exceeds(message, FIELD_LIMITS.message)
    ) {
      return NextResponse.json({ error: 'One or more fields are too long' }, { status: 400 })
    }

    const created = await prisma.contactMessage.create({
      data: { name, email, phone, message },
    })

    return NextResponse.json(created)
  } catch (error) {
    console.error('ContactMessage error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Message ID required' }, { status: 400 })
    }
    await prisma.contactMessage.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}
