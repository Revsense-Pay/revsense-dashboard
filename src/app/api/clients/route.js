export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accountId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const accountId = session.user.accountId;

    // Fetch ALL this account’s clients, including pending
    const clients = await prisma.client.findMany({
      where: {
        accountId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        subscriptionUrl: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ clients });
  } catch (err) {
    console.error('FETCH CLIENTS ERROR:', err);

    return NextResponse.json(
      { error: 'Failed to load clients' },
      { status: 500 }
    );
  }
}