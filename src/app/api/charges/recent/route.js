export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accountId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const charges = await prisma.charge.findMany({
    where: {
      accountId: session.user.accountId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
    include: {
      client: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json({ charges });
}