'use client';

import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import dynamic from 'next/dynamic';
import { OnboardingProvider } from '@/context/OnboardingContext';
import { NotificationProvider } from '@/context/useNotificationContext';

const LayoutProvider = dynamic(
  () => import('@/context/useLayoutContext').then(mod => mod.LayoutProvider),
  { ssr: false }
);

const AppProvidersWrapper = ({ children }) => {
  return (
    <SessionProvider>
      <LayoutProvider>
        <NotificationProvider>
          <OnboardingProvider>
            {children}
          </OnboardingProvider>

          <ToastContainer theme="colored" />
        </NotificationProvider>
      </LayoutProvider>
    </SessionProvider>
  );
};

export default AppProvidersWrapper;