import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfMonth, addMonths } from 'date-fns'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') // e.g. "2026-01"

    if (!period) {
      return NextResponse.json(
        { error: 'Period is required' },
        { status: 400 }
      )
    }

    const startDate = startOfMonth(new Date(`${period}-01`))
    const endDate = addMonths(startDate, 1)

    const feePercent = 0.0075 // ✅ 0.75%

    const accounts = await prisma.account.findMany({
      where: {
        billingStatus: 'ACTIVE',
      },
      select: {
        id: true,
        companyName: true,
      },
    })

    const rows = await Promise.all(
      accounts.map(async (account) => {
        const snapshot = await prisma.usageSnapshot.findUnique({
          where: {
            accountId_period: {
              accountId: account.id,
              period,
            },
          },
        })

        if (snapshot) {
          return {
            accountId: account.id,
            name: account.companyName,
            grossCents: snapshot.grossCents,
            feeCents: snapshot.feeCents,
            snapshot: {
              id: snapshot.id,
              status: snapshot.status,
            },
          }
        }

        // 🔥 LIVE GROSS PREVIEW (THIS IS WHAT YOU WANT)
        const aggregate = await prisma.charge.aggregate({
          _sum: { amount: true },
          where: {
            accountId: account.id,
            status: 'SUCCESS',
            source: 'CLIENT',
            createdAt: {
              gte: startDate,
              lt: endDate,
            },
          },
        })

        const grossCents = aggregate._sum.amount ?? 0
        const feeCents = Math.round(grossCents * feePercent)

        return {
          accountId: account.id,
          name: account.companyName,
          grossCents,
          feeCents,
          snapshot: null,
        }
      })
    )

    const filteredRows = rows.filter(row => row.grossCents > 0)

    const totals = filteredRows.reduce(
      (acc, row) => {
        acc.grossCents += row.grossCents
        acc.feeCents += row.feeCents
        return acc
      },
      { grossCents: 0, feeCents: 0 }
    )

    return NextResponse.json({
      clients: filteredRows,
      totals,
    })
  } catch (err) {
    console.error('USAGE PREVIEW ERROR', err)
    return NextResponse.json(
      { error: 'Failed to load usage preview' },
      { status: 500 }
    )
  }
}