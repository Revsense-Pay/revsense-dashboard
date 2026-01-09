import { prisma } from '@/lib/prisma'

export async function finaliseSnapshot(snapshotId: string) {
  const snapshot = await prisma.usageSnapshot.findUnique({
    where: { id: snapshotId },
  })

  if (!snapshot) throw new Error('Snapshot not found')
  if (snapshot.status !== 'DRAFT') throw new Error('Invalid state')

  return prisma.usageSnapshot.update({
    where: { id: snapshotId },
    data: {
      status: 'FINALISED',
      finalisedAt: new Date(),
    },
  })
}

export {}