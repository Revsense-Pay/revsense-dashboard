import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function OnboardingLayout({ children }) {
  const session = await getServerSession(authOptions);

  // 🔒 Not logged in → signup
  if (!session) {
    redirect('/auth/signup');
  }

  // ✅ Logged in → allow onboarding pages
  return <>{children}</>;
}