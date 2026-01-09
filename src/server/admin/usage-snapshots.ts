import { prisma } from '@/lib/prisma'

export async function listSnapshots(period: string) {
  return prisma.usageSnapshot.findMany({
    where: { period },
    orderBy: { createdAt: 'asc' },
  })
}

export async function finaliseSnapshot(snapshotId: string) {
  const snapshot = await prisma.usageSnapshot.findUnique({
    where: { id: snapshotId },
  })

  if (!snapshot) throw new Error('Not found')
  if (snapshot.status !== 'DRAFT') throw new Error('Invalid state')

  return prisma.usageSnapshot.update({
    where: { id: snapshotId },
    data: {
      status: 'FINALISED',
      finalisedAt: new Date(),
    },
  })
}

export async function chargeSnapshot(snapshotId: string) {
  const snapshot = await prisma.usageSnapshot.findUnique({
    where: { id: snapshotId },
  })

  if (!snapshot) {
    throw new Error('Snapshot not found')
  }

  // 🔒 Idempotency guard
  if (snapshot.paystackReference) {
    throw new Error('Snapshot already charged')
  }

  // 🔒 State guard
  if (snapshot.status !== 'FINALISED') {
    throw new Error('Snapshot must be FINALISED before charging')
  }

  return prisma.usageSnapshot.update({
    where: { id: snapshotId },
    data: {
      status: 'CHARGED',
      chargedAt: new Date(),
    },
  })
}