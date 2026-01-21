export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { startOfMonth, addMonths } from 'date-fns'

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const body = await req.json()
    console.log('[CREATE SNAPSHOT] Request body:', body)

    const { accountId, period } = body

    if (!accountId || !period) {
      console.error('[CREATE SNAPSHOT] Missing params')
      return NextResponse.json(
        { error: 'Missing accountId or period' },
        { status: 400 }
      )
    }

    console.log('[CREATE SNAPSHOT] accountId:', accountId)
    console.log('[CREATE SNAPSHOT] period:', period)

    // Prevent duplicate snapshots
    const existing = await prisma.usageSnapshot.findUnique({
      where: {
        accountId_period: { accountId, period },
      },
    })

    if (existing) {
      console.warn('[CREATE SNAPSHOT] Snapshot already exists:', existing.id)
      return NextResponse.json(
        { error: 'Snapshot already exists for this period' },
        { status: 409 }
      )
    }

    const start = startOfMonth(new Date(`${period}-01`))
    const end = addMonths(start, 1)

    console.log('[CREATE SNAPSHOT] Date range:', start, end)

    const aggregate = await prisma.charge.aggregate({
      _sum: { amount: true },
      where: {
        accountId,
        source: 'CLIENT',
        status: 'SUCCESS',
        createdAt: {
          gte: start,
          lt: end,
        },
      },
    })

    const grossCents = aggregate._sum.amount ?? 0
    const feePercent = 0.0075
    const feeCents = Math.round(grossCents * feePercent)

    console.log('[CREATE SNAPSHOT] grossCents:', grossCents)
    console.log('[CREATE SNAPSHOT] feeCents:', feeCents)

    const snapshot = await prisma.usageSnapshot.create({
      data: {
        accountId,
        period,
        grossCents,
        feeCents,
        feePercent,
        status: 'DRAFT',
      },
    })

    console.log('[CREATE SNAPSHOT] Snapshot created:', snapshot.id)

    return NextResponse.json({ success: true, snapshot })
  } catch (err: any) {
    console.error('[CREATE SNAPSHOT] ERROR:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to create snapshot' },
      { status: 500 }
    )
  }
}