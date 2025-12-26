import OnboardingHeader from '@/components/onboarding/OnboardingHeader';

export default function OnboardingLayout({ children }) {
  return (
    <>
      <OnboardingHeader />
      <main className="container py-4">
        {children}
      </main>
    </>
  );
}