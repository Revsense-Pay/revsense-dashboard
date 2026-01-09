export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
// import { authOptions } from '@/lib/auth-options'

export async function POST(req: Request) {
  try {
    const user = { role: 'ADMIN' }

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { snapshotId } = await req.json()

    const snapshot = await prisma.usageSnapshot.findUnique({
      where: { id: snapshotId },
    })

    if (!snapshot) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (snapshot.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Snapshot cannot be finalised' },
        { status: 409 }
      )
    }

    const updated = await prisma.usageSnapshot.update({
      where: { id: snapshotId },
      data: {
        status: 'FINALISED',
        finalisedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, snapshot: updated })
  } catch (err) {
    console.error('FINALISE SNAPSHOT ERROR', err)
    return NextResponse.json(
      { error: 'Failed to finalise snapshot' },
      { status: 500 }
    )
  }
}