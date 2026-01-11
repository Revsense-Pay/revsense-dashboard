import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth } from 'date-fns'
import { AccountRole, BillingStatus, ChargeSource, ChargeStatus } from '@prisma/client'

export async function getUsagePreview(period: string) {
  const start = startOfMonth(new Date(`${period}-01`))
  const end = endOfMonth(start)

  const accounts = await prisma.account.findMany({
    where: {
      role: AccountRole.USER,
      billingStatus: BillingStatus.ACTIVE,
    },
    include: {
      usageSnapshots: {
        where: { period },
        take: 1,
      },
      charges: {
        where: {
          source: ChargeSource.USAGE,
          status: ChargeStatus.SUCCESS,
          createdAt: {
            gte: start,
            lte: end,
          },
        },
        select: {
          amount: true,
        },
      },
    },
  })

  return accounts.map((account) => {
    const grossCents = account.charges.reduce(
      (sum, charge) => sum + charge.amount,
      0
    )

    const feeCents = Math.round(grossCents * 0.05) // or your config %

    return {
      accountId: account.id,
      name: account.companyName,
      grossCents,
      feeCents,
      snapshot: account.usageSnapshots[0] ?? null,
    }
  })
}