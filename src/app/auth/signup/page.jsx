'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import AuthHeader from '@/components/auth/AuthHeader';

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function calculateStrength(value) {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return score;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 🔹 SIGN UP FLOW
      if (mode === 'signup') {
        if (!companyName) {
          setError('Company name is required');
          setLoading(false);
          return;
        }
        if (strength < 3) {
          setError('Password is too weak');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, companyName }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Signup failed');
          setLoading(false);
          return;
        }
      }

      // 🔹 LOGIN (used by BOTH signup + login)
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      if (mode === 'signup') {
        router.push('/onboarding/pricing');
      } else {
        router.push('/dashboards');
      }

    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-center">
      <div className="auth-card">

        {/* BRAND HEADER */}
        <AuthHeader
          title={mode === 'signup' ? 'Create Account' : 'Log In'}
          subtitle={
            mode === 'signup'
              ? 'Start accepting payments with Revsense'
              : 'Welcome back'
          }
        />

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <input
              className="auth-input"
              type="text"
              placeholder="Company name"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              required
            />
          )}

          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              if (mode === 'signup') {
                setStrength(calculateStrength(e.target.value));
              }
            }}
            required
          />

          {/* 🔐 PASSWORD STRENGTH (SIGNUP ONLY) */}
          {mode === 'signup' && password && (
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  height: 6,
                  background: '#374151',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(strength / 5) * 100}%`,
                    background:
                      strength <= 2
                        ? '#ef4444'
                        : strength === 3
                        ? '#f97316'
                        : '#22c55e',
                    transition: 'width 0.25s ease',
                  }}
                />
              </div>

              <small style={{ color: '#9ca3af' }}>
                {strength <= 2 && 'Weak password'}
                {strength === 3 && 'Medium strength'}
                {strength >= 4 && 'Strong password'}
              </small>
            </div>
          )}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            className="auth-button"
            disabled={loading || (mode === 'signup' && strength < 3)}
          >
            {loading
              ? 'Please wait…'
              : mode === 'signup'
                ? 'Create Account'
                : 'Log In'}
          </button>
        </form>

        <div className="auth-footer">
          {mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="auth-link"
                onClick={() => setMode('login')}
              >
                Log in
              </button>
            </p>
          ) : (
            <p>
              Don’t have an account?{' '}
              <button
                type="button"
                className="auth-link"
                onClick={() => setMode('signup')}
              >
                Sign up
              </button>
            </p>
          )}
        </div>

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

        .auth-input {
          background: #111827;
          border: 1px solid #2a3441;
          border-radius: 10px;
          padding: 12px 14px;
          color: #ffffff;
          font-size: 14px;
          outline: none;
          margin-bottom: 14px;
        }

        .auth-input::placeholder {
          color: #6b7280;
        }

        .auth-input:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.4);
        }

        .auth-button {
          margin-top: 12px;
          width: 100%;
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

        .auth-button:hover {
          box-shadow: 0 10px 24px rgba(239, 68, 68, 0.25);
        }

        .auth-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-error {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13px;
          text-align: center;
          margin-bottom: 12px;
        }

        .auth-footer {
          margin-top: 18px;
          text-align: center;
          color: #9aa4b2;
          font-size: 14px;
        }

        .auth-link {
          background: none;
          border: none;
          color: #f97316;
          cursor: pointer;
          font-weight: 600;
        }

        .auth-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}