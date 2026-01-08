'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { toast } from 'sonner';

export default function ActivateBillingPage() {
  const [loading, setLoading] = useState(false);

  async function handleActivate() {
    setLoading(true);

    const res = await fetch('/api/billing/activate', {
      method: 'POST',
    });

    const data = await res.json();

    if (!res.ok || !data.url) {
      toast.error('Failed to start billing');
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <div className="max-w-md mx-auto mt-24 text-center">
      <h2 className="text-2xl font-semibold mb-2">
        Activate Billing
      </h2>

      <p className="text-muted mb-6">
        To start charging clients, activate your RevSense subscription.
      </p>

      <button
        onClick={handleActivate}
        disabled={loading}
        className="btn btn-gradient w-full"
      >
        {loading ? 'Redirecting…' : 'Activate Billing (R995 / month)'}
      </button>
    </div>
  );
}