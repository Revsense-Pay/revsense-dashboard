import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  // 🔒 No session → locked
  if (!session?.user?.email) {
    return NextResponse.json({ billingStatus: 'INACTIVE' });
  }

  const account = await prisma.account.findUnique({
    where: { email: session.user.email },
    select: { billingStatus: true },
  });

  return NextResponse.json({
    billingStatus: account?.billingStatus ?? 'INACTIVE',
  });
}