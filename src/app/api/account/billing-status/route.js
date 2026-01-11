import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ billingStatus: 'INACTIVE' });

  const account = await prisma.account.findUnique({
    where: { id: session.user.id },
    select: { billingStatus: true },
  });

  return NextResponse.json({
    billingStatus: account?.billingStatus ?? 'INACTIVE',
  });
}