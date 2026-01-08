import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accountId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accountId = session.user.accountId;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Charges this month
    const chargesThisMonth = await prisma.charge.findMany({
      where: {
        accountId,
        status: 'SUCCESS',
        createdAt: {
          gte: startOfMonth,
        },
      },
      select: {
        amount: true,
        createdAt: true,
      },
    });

    const revenue = chargesThisMonth.reduce((sum, c) => sum + c.amount, 0);
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
      const day = charge.createdAt.toISOString().slice(0, 10);
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

    const fees = Math.round(revenue * 0.01);

    return Response.json({
      grossRevenue: revenue,
      feesCollected: fees,
      activeClients,
      totalCharges: chargeCount,
      summary: {
        revenue,
        fees,
        activeClients,
        chargeCount,
      },
      chargesOverTime,
      recentCharges: recentCharges.map(c => ({
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