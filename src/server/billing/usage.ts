import { prisma } from '@/lib/prisma'

export async function recordUsage({
  accountId,
  grossCents,
  feeCents,
  period,
}: {
  accountId: string
  grossCents: number
  feeCents: number
  period: string
}) {
  return prisma.usageSnapshot.upsert({
    where: {
      accountId_period: { accountId, period },
    },
    update: {
      grossCents: { increment: grossCents },
      feeCents: { increment: feeCents },
    },
    create: {
      accountId,
      period,
      grossCents,
      feeCents,
      status: 'DRAFT',
    },
  })
}

export {}