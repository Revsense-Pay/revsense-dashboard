import { prisma } from '@/lib/prisma'
import { paystackChargeAuthorization } from '@/lib/paystack'
import { calculateMonthlyUsage } from '@/lib/billing/usage'

export async function chargeUsageSnapshot(snapshotId: string) {
  const snapshot = await prisma.usageSnapshot.findUnique({
    where: { id: snapshotId },
    include: { account: true },
  })

  if (!snapshot) throw new Error('Snapshot not found')
  if (snapshot.charged) return snapshot

  const authCode = snapshot.account.billingAuthCode
  if (!authCode) throw new Error('No billing authorization on account')

  const charge = await paystackChargeAuthorization({
    authorizationCode: authCode,
    email: snapshot.account.email,
    amount: snapshot.feeCents,
  })

  const chargeRecord = await prisma.charge.create({
    data: {
      accountId: snapshot.accountId,
      amount: snapshot.feeCents,
      currency: 'ZAR',
      status: 'SUCCESS',
      paystackReference: charge.reference,
      description: `RevSense usage fee (${snapshot.period})`,
    },
  })

  await prisma.usageSnapshot.update({
    where: { id: snapshot.id },
    data: {
      charged: true,
      chargeId: chargeRecord.id,
    },
  })

  return chargeRecord
}

export async function createUsageSnapshotForPeriod({
  accountId,
  period,
}: {
  accountId: string
  period: string
}) {
  const existing = await prisma.usageSnapshot.findFirst({
    where: {
      accountId,
      period,
    },
  })

  if (existing) return existing

  const usage = await calculateMonthlyUsage({
    accountId,
    period,
  })

  const snapshot = await prisma.usageSnapshot.create({
    data: {
      accountId,
      period,
      grossRevenueCents: usage.grossRevenueCents,
      feeCents: usage.usageFeeCents,
      charged: false,
    },
  })

  return snapshot
}