import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'
import { startOfMonth, endOfMonth } from 'date-fns'

import { prisma } from '@/lib/prisma'

export async function GET() {
  const timeZone = 'Africa/Johannesburg'

  // Current time in SA
  const nowZoned = utcToZonedTime(new Date(), timeZone)

  // Month boundaries in SA time, then converted to UTC for DB queries
  const startOfMonthZoned = startOfMonth(nowZoned)
  const endOfMonthZoned = endOfMonth(nowZoned)

  const startOfMonthUtc = zonedTimeToUtc(startOfMonthZoned, timeZone)
  const endOfMonthUtc = zonedTimeToUtc(endOfMonthZoned, timeZone)

  const chargesThisMonth = await prisma.charge.findMany({
    where: {
      createdAt: {
        gte: startOfMonthUtc,
        lte: endOfMonthUtc,
      },
    },
  })

  // Group charges by day in SA time
  const chargesByDay = {}

  for (const charge of chargesThisMonth) {
    const zonedDate = utcToZonedTime(charge.createdAt, timeZone)
    const day = zonedDate.toISOString().slice(0, 10)

    if (!chargesByDay[day]) {
      chargesByDay[day] = 0
    }
    chargesByDay[day] += charge.amountCents || 0
  }

  const chargesOverTime = Object.entries(chargesByDay).map(([date, total]) => ({
    date,
    total,
  }))

  chargesOverTime.sort((a, b) => a.date.localeCompare(b.date))

  return new Response(
    JSON.stringify({
      summary: {
        totalCharges: chargesThisMonth.length,
      },
      chart: chargesOverTime,
      charges: chargesThisMonth,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}