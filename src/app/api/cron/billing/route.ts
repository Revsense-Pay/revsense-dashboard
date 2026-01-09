import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { finaliseSnapshot } from '@/server/billing/snapshots'
import { chargeSnapshot } from '@/server/billing/charge'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const snapshots = await prisma.usageSnapshot.findMany({
    where: { status: 'DRAFT' },
  })

  for (const snap of snapshots) {
    await finaliseSnapshot(snap.id)
    await chargeSnapshot(snap.id)
  }

  return NextResponse.json({ success: true })
}

export {}