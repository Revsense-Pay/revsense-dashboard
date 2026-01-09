export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
}