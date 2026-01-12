export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!account) {
      return Response.json({ error: 'Account not found' }, { status: 404 });
    }

    const accountId = account.id;

    const now = new Date();

    const startOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
    );

    const endOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)
    );

    // Charges this month
    const chargesThisMonth = await prisma.charge.findMany({
      where: {
        accountId,
        status: 'SUCCESS',
        createdAt: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
      select: {
        amount: true,
        createdAt: true,
      },
    });

    const grossCents = chargesThisMonth.reduce((sum, c) => sum + c.amount, 0);
    const chargeCount = chargesThisMonth.length;

    // Active clients
    const activeClients = await prisma.client.count({
      where: {
        accountId,
        status: 'ACTIVE',
      },
    });

    // Charges grouped by day
    const chargesByDay = {};
    for (const charge of chargesThisMonth) {
      const day = new Date(charge.createdAt)
        .toISOString()
        .split('T')[0];
      chargesByDay[day] = (chargesByDay[day] || 0) + charge.amount;
    }

    const chargesOverTime = Object.entries(chargesByDay).map(
      ([date, total]) => ({ date, total })
    );

    // Recent charges (last 5)
    const recentCharges = await prisma.charge.findMany({
      where: {
        accountId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const feeCents = Math.round(grossCents * 0.01);

    return Response.json({
      summary: {
        grossCents,
        feeCents,
        activeClients,
        chargeCount,
      },
      chart: chargesOverTime,
      charges: recentCharges.map(c => ({
        id: c.id,
        amount: c.amount,
        currency: c.currency,
        status: c.status,
        description: c.description,
        createdAt: c.createdAt,
        clientName: c.client?.name ?? null,
        clientEmail: c.client?.email,
      })),
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}