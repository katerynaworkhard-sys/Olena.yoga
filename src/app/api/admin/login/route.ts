import { NextRequest, NextResponse } from 'next/server'
import { setAdminSessionCookie, verifyAdminPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
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
