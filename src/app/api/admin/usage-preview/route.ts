export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getUsagePreview } from '@/server/admin/usage-preview'
import { startOfMonth, format } from 'date-fns'

export async function GET(req: Request) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(req.url)
    const period =
      searchParams.get('period') ??
      format(startOfMonth(new Date()), 'yyyy-MM')

    const clients = await getUsagePreview(period)

    return NextResponse.json({ period, clients })
  } catch (err) {
  console.error('USAGE PREVIEW ERROR >>>', err)

  return NextResponse.json(
    {
      error: 'Failed to load usage preview',
      detail: err instanceof Error ? err.message : String(err),
    },
    { status: 500 }
  )
}
}