import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { REVSENSE_USAGE_FEE_PERCENT } from '@/lib/billing/config'

export const runtime = 'nodejs'

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

  // 🔒 Route-safe helper logic (NOT exported)
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
  const usageFeeCents = Math.floor(
    grossRevenueCents * REVSENSE_USAGE_FEE_PERCENT
  )

  return Response.json({
    period: `${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, '0')}`,
    grossRevenueZAR: grossRevenueCents / 100,
    usageFeeZAR: usageFeeCents / 100,
    currency: 'ZAR',
    feePercent: REVSENSE_USAGE_FEE_PERCENT,
  })
}