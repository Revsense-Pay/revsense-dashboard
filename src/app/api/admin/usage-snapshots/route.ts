export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { listSnapshots } from '@/server/admin/usage-snapshots'
import { startOfMonth, format } from 'date-fns'

export async function GET(req: Request) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(req.url)
    const period =
      searchParams.get('period') ??
      format(startOfMonth(new Date()), 'yyyy-MM')

    const snapshots = await listSnapshots(period)

    return NextResponse.json({ period, snapshots })
  } catch (err) {
    console.error('ADMIN USAGE SNAPSHOTS ERROR', err)
    return NextResponse.json(
      { error: 'Failed to load usage snapshots' },
      { status: 500 }
    )
  }
}