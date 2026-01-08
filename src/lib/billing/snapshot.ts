import { prisma } from '@/lib/prisma'
import { calculateMonthlyUsage } from './usage'
import { REVSENSE_USAGE_FEE_PERCENT } from './config'

export async function getOrCreateUsageSnapshot(
  accountId: string,
  period: string // "YYYY-MM"
) {
  // Prevent duplicates (snapshots are immutable per period)
  const existing = await prisma.usageSnapshot.findUnique({
    where: {
      accountId_period: {
        accountId,
        period,
      },
    },
  })

  if (existing) return existing

  const usage = await calculateMonthlyUsage({
    accountId,
    period,
  })

  return prisma.usageSnapshot.create({
    data: {
      accountId,
      period,
      grossCents: usage.grossRevenueCents,
      feeCents: usage.usageFeeCents,
      feePercent: REVSENSE_USAGE_FEE_PERCENT,
      status: 'PENDING',
    },
  })
}