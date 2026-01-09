export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { finaliseSnapshot } from '@/server/admin/usage-snapshots'

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const { snapshotId } = await req.json()
    const snapshot = await finaliseSnapshot(snapshotId)

    return NextResponse.json({ success: true, snapshot })
  } catch (err: any) {
    console.error('[finaliseSnapshot] Error:', err)
    const message = err?.message || String(err)
    if (
      message.includes('Invalid state') ||
      message.includes('cannot be finalised')
    ) {
      return NextResponse.json({ error: message }, { status: 409 })
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}