import { prisma } from '@/lib/prisma'

export async function hasActiveBilling(accountId: string) {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    select: { billingStatus: true },
  })

  return account?.billingStatus === 'ACTIVE'
}