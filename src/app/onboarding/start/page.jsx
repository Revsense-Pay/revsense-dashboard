'use client';

import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

const StartOnboardingPage = () => {
  const router = useRouter();

  return (
    <div className="container py-5">
      <h1 className="mb-3">Welcome to RevSense</h1>
      <p className="text-muted mb-4">
        Let’s get your account set up in just a few steps.
      </p>

      <Button
        size="lg"
        onClick={() => router.push('/onboarding/business')}
      >
        Get Started
      </Button>
    </div>
  );
};

export default StartOnboardingPage;