import { NextResponse } from 'next/server'
import { clearAdminSessionCookie } from '@/lib/auth'

export async function POST() {
  return clearAdminSessionCookie(NextResponse.json({ success: true }))
}
