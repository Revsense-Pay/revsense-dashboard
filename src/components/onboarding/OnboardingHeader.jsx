'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ProgressBar } from 'react-bootstrap';
import { useOnboarding } from '@/context/OnboardingContext';

import logoDark from '@/assets/images/logo-dark.png';
import logoLight from '@/assets/images/logo-light.png';

const OnboardingHeader = () => {
  const { onboarding } = useOnboarding();
  const progress = Math.min((onboarding.step / 5) * 100, 100);

  return (
    <header className="border-bottom bg-body sticky-top">
      <div className="container py-3 d-flex align-items-center justify-content-between">

        {/* LOGO */}
        <Link href="/" className="onboarding-logo d-flex align-items-center">
          <Image
            src={logoDark}
            alt="RevSense"
            height={28}
            priority
            className="logo-dark"
          />

          <Image
            src={logoLight}
            alt="RevSense"
            height={28}
            priority
            className="logo-light"
          />
        </Link>

        {/* STEP */}
        <small className="text-muted">
          Step {onboarding.step} of 5
        </small>
      </div>

      <ProgressBar
        now={progress}
        style={{ height: 3 }}
        className="rounded-0"
      />
    </header>
  );
};

export default OnboardingHeader;