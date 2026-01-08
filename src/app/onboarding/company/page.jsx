'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CompanyStep() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/onboarding/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName, email }),
    });

    const data = await res.json();

    if (!data.success) {
      alert('Failed to create account');
      setLoading(false);
      return;
    }

    // Phase 1 only — temporary storage
    localStorage.setItem('accountId', data.account.id);

    router.push('/onboarding/paystack');
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h2>Company details</h2>
      <p className="text-muted">Let’s set up your RevSense account</p>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          placeholder="Company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />

        <input
          className="form-control mb-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating…' : 'Continue'}
        </button>
      </form>
    </div>
  );
}