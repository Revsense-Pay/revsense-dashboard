import { prisma } from '@/lib/prisma'

export async function calculateMonthlyUsage({
  accountId,
  period,
}: {
  accountId: string
  period: string
}) {
  const [year, month] = period.split('-').map(Number)

  const start = new Date(year, month - 1, 1, 0, 0, 0, 0)
  const end = new Date(year, month, 0, 23, 59, 59, 999)

  const result = await prisma.charge.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      accountId,
      status: 'SUCCESS',
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  })

  const grossRevenueCents = result._sum.amount ?? 0
  const usageFeeCents = calculateUsageFee(grossRevenueCents)

  return {
    grossRevenueCents,
    usageFeeCents,
    currency: 'ZAR',
    feePercent: '0.75%',
  }
}

export function calculateUsageFee(
  grossCents: number,
  feePercent = 0.0075 // 0.75%
) {
  return Math.round(grossCents * feePercent)
}