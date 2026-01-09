export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'
export const revalidate = 0
export const preferredRegion = 'auto'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfMonth, format } from 'date-fns'

export async function GET(req: Request) {
  const isAdmin = true
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const period =
      searchParams.get('period') ??
      format(startOfMonth(new Date()), 'yyyy-MM')

    const snapshots = await prisma.usageSnapshot.findMany({
      where: { period },
      orderBy: { createdAt: 'asc' },
    })

    const totals = snapshots.reduce(
      (acc, s) => {
        acc.grossCents += s.grossCents
        acc.feeCents += s.feeCents
        return acc
      },
      { grossCents: 0, feeCents: 0 }
    )

    return NextResponse.json({
      period,
      totals,
      snapshots,
    })
  } catch (err) {
    console.error('ADMIN SNAPSHOTS ERROR', err)
    return NextResponse.json(
      { error: 'Failed to load usage snapshots' },
      { status: 500 }
    )
  }
}