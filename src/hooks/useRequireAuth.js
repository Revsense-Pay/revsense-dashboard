'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    // 🔐 TEMP AUTH CHECK (replace later)
    const isAuthenticated = true; // ← change to false to test redirect

    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [router]);
}