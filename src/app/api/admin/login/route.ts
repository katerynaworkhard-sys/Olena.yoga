import { NextRequest, NextResponse } from 'next/server'
import { setAdminSessionCookie, verifyAdminPassword } from '@/lib/auth'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Throttle login attempts per IP to slow brute-force guessing.
  if (!rateLimit(`login:${clientIp(request)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait a few minutes and try again.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json().catch(() => ({}))
    const { password } = body as { password?: unknown }

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    return setAdminSessionCookie(NextResponse.json({ success: true }))
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
