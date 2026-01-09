export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { chargeSnapshot } from '@/server/admin/usage-snapshots'

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const { snapshotId } = await req.json()
    const snapshot = await chargeSnapshot(snapshotId)

    return NextResponse.json({ success: true, snapshot })
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 })
  }
}