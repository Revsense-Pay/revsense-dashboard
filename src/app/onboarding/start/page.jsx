import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function OnboardingStartPage() {
  const session = await getServerSession(authOptions);

  // Safety: must be logged in
  if (!session?.user?.accountId) {
    redirect('/auth/signup');
  }

  const accountId = session.user.accountId;

  // Check Paystack completion
  const hasPaystack = await prisma.paystackKey.findUnique({
    where: { accountId },
  });

  // 🔁 Decide next step
  if (!hasPaystack) {
    redirect('/dashboards');
  }

  // ✅ Onboarding complete
  redirect('/dashboards');
}