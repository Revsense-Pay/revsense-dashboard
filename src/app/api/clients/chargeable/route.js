import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accountId) {
    return NextResponse.json([], { status: 401 });
  }

  const clients = await prisma.client.findMany({
    where: {
      accountId: session.user.accountId,
      status: 'ACTIVE',
      authorizationCode: { not: null },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(clients);
}