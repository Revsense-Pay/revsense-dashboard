import axios from 'axios'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/crypto'

export async function chargeSnapshot(snapshotId: string) {
  const snapshot = await prisma.usageSnapshot.findUnique({
    where: { id: snapshotId },
    include: { account: { include: { paystackKey: true } } },
  })

  if (!snapshot) throw new Error('Not found')
  if (snapshot.status !== 'FINALISED') throw new Error('Invalid state')

  const secretKey = decrypt(snapshot.account.paystackKey.secretKeyEncrypted)

  const res = await axios.post(
    'https://api.paystack.co/transaction/charge_authorization',
    {
      email: snapshot.account.email,
      amount: snapshot.grossCents,
      authorization_code: snapshot.account.billingAuthCode,
    },
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    }
  )

  return prisma.usageSnapshot.update({
    where: { id: snapshotId },
    data: {
      status: 'CHARGED',
      chargedAt: new Date(),
      paystackReference: res.data.data.reference,
    },
  })
}

export {}