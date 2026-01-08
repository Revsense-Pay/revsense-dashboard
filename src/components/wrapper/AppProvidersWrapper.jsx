'use client';

import { useEffect } from 'react';
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
  useEffect(() => {
    const html = document.documentElement;

    // 🔒 FORCE DARK MODE GLOBALLY
    html.setAttribute('data-bs-theme', 'dark');
    html.setAttribute('data-topbar-color', 'dark');
    html.setAttribute('data-sidebar-color', 'dark');
    html.setAttribute('data-sidebar-size', 'lg');
  }, []);

  return (
    <SessionProvider
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
      refetchInterval={0}
    >
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