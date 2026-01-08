'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LightLogo from '@/assets/images/paystack-light.png';
import DarkLogo from '@/assets/images/paystack-dark.png';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';

const PaystackConnectPage = () => {
  const router = useRouter();
  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setError('');
    setLoading(true);

    const res = await fetch('/api/paystack/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secretKey }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Invalid Paystack key');
      setLoading(false);
      return;
    }

    router.push('/dashboards');
  };

  return (
    <>
      <OnboardingHeader />

      <div className="container mt-5" style={{ maxWidth: 520 }}>
        <div className="text-center mb-4">
          <Image
            src={DarkLogo}
            alt="Paystack"
            height={40}
            className="d-none d-dark-block"
          />
          <Image
            src={LightLogo}
            alt="Paystack"
            height={40}
            className="d-dark-none"
          />

          <h4 className="mt-3">Connect Paystack</h4>
          <p className="text-muted">
            Enter your Paystack Secret Key to sync transactions securely.
          </p>
        </div>

        <div className="mb-3">
          <label className="form-label">Paystack Secret Key</label>
          <input
            type="password"
            className="form-control"
            placeholder="sk_live_********"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button
          className="btn btn-dark w-100"
          onClick={handleConnect}
          disabled={loading || !secretKey}
        >
          {loading ? 'Verifying...' : 'Connect Paystack'}
        </button>
      </div>
    </>
  );
};

export default PaystackConnectPage;