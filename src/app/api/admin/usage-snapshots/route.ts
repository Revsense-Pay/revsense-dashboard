import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { startOfMonth, format } from 'date-fns'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const period =
      searchParams.get('period') ??
      format(startOfMonth(new Date()), 'yyyy-MM')

    const snapshots = await prisma.usageSnapshot.findMany({
      where: { period },
      include: {
        account: {
          select: {
            id: true,
            email: true,
            companyName: true,
          },
        },
      },
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