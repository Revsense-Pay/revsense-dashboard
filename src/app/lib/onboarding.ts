import { prisma } from '@/lib/prisma';

export async function isOnboardingComplete(accountId: string) {
  const key = await prisma.paystackKey.findUnique({
    where: { accountId },
  });

  return Boolean(key);
}