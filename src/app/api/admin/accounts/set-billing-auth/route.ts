export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const { accountId, authorizationCode } = await req.json()

    if (!accountId || !authorizationCode) {
      return NextResponse.json(
        { error: 'Missing accountId or authorizationCode' },
        { status: 400 }
      )
    }

    const account = await prisma.account.findUnique({
      where: { id: accountId },
    })

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      )
    }

    await prisma.account.update({
      where: { id: accountId },
      data: {
        billingAuthCode: authorizationCode,
        billingStatus: 'ACTIVE',
      },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[set-billing-auth] Error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to set billing auth code' },
      { status: 500 }
    )
  }
}