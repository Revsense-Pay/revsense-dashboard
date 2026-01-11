export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'

const PLAN_LINKS = {
  monthly: process.env.PAYSTACK_MONTHLY_LINK,
  annual: process.env.PAYSTACK_ANNUAL_LINK,
}

export async function GET(req) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url))
  }

  const { searchParams } = new URL(req.url)
  const plan = searchParams.get('plan') ?? 'monthly'

  const link = PLAN_LINKS[plan]
  if (!link) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  return NextResponse.redirect(link)
}