import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { REVSENSE_USAGE_FEE_PERCENT } from '@/lib/billing/config'

export async function calculateMonthlyUsage(accountId: string) {
  const result = await prisma.charge.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      accountId,
      status: 'SUCCESS',
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
      },
    },
  })

  const grossRevenueCents = result._sum.amount ?? 0

  const feePercent = REVSENSE_USAGE_FEE_PERCENT
  const usageFeeCents = Math.floor(grossRevenueCents * feePercent)

  const currency = 'ZAR'

  return {
    grossRevenueCents,
    usageFeeCents,
    currency,
    feePercent,
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)

  const accountId =
    (session as any)?.accountId ||
    (session as any)?.user?.accountId

  if (!accountId) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const usage = await calculateMonthlyUsage(accountId)

  return Response.json({
    period: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    grossRevenueZAR: usage.grossRevenueCents / 100,
    usageFeeZAR: usage.usageFeeCents / 100,
    currency: usage.currency,
    feePercent: usage.feePercent,
  })
}