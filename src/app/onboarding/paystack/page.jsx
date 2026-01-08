'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function PaystackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (status === 'loading') {
    return (
      <div className="auth-center">
        <div className="auth-card">
          <p className="text-muted">Loading…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="auth-center">
        <div className="auth-card">
          <p className="text-danger">Session expired. Please sign in again.</p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/onboarding/paystack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paystackPublicKey: publicKey,
        paystackSecretKey: secretKey,
      }),
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      setError('Server error');
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setError(data.error || 'Failed to save Paystack keys');
      setLoading(false);
      return;
    }

    router.push('/dashboards');
  }

  return (
    <div className="auth-center">
      <div className="auth-card">
        <h2 className="auth-title">Connect Paystack</h2>
        <p className="auth-subtitle">
          Add your Paystack API keys to start accepting payments.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Public Key</label>
            <input
              className="form-input"
              placeholder="pk_live_xxx"
              value={publicKey}
              onChange={e => setPublicKey(e.target.value)}
              required
            />
            <small className="form-help">
              Found in your Paystack dashboard → API Keys
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Secret Key</label>
            <input
              className="form-input"
              placeholder="sk_live_xxx"
              value={secretKey}
              onChange={e => setSecretKey(e.target.value)}
              required
            />
            <small className="form-help">
              Keep this key secure. It will be encrypted.
            </small>
          </div>

          {error && <div className="form-error">{error}</div>}

          <button className="primary-button" disabled={loading}>
            {loading ? 'Saving…' : 'Finish Setup'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .auth-center {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(1200px 600px at 50% -10%, #1f2a36 0%, #121821 60%);
          padding: 24px;
        }

        .auth-card {
          width: 100%;
          max-width: 460px;
          background: #1b2430;
          border-radius: 14px;
          padding: 32px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
        }

        .auth-title {
          color: #ffffff;
          font-size: 24px;
          margin-bottom: 6px;
          text-align: center;
        }

        .auth-subtitle {
          color: #9aa4b2;
          font-size: 14px;
          margin-bottom: 28px;
          text-align: center;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          color: #c7d0db;
          font-size: 13px;
        }

        .form-input {
          background: #111827;
          border: 1px solid #2a3441;
          border-radius: 10px;
          padding: 12px 14px;
          color: #ffffff;
          font-size: 14px;
          outline: none;
        }

        .form-input::placeholder {
          color: #6b7280;
        }

        .form-input:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.4);
        }

        .form-help {
          color: #8b95a5;
          font-size: 12px;
        }

        .form-error {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13px;
          text-align: center;
        }

        .primary-button {
          margin-top: 8px;
          background: linear-gradient(90deg, #f97316, #ef4444);
          border: none;
          border-radius: 12px;
          padding: 14px;
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.05s ease, box-shadow 0.05s ease, opacity 0.2s;
        }

        .primary-button:hover {
          box-shadow: 0 10px 24px rgba(239, 68, 68, 0.25);
        }

        .primary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}