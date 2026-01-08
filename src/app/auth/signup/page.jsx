'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import AuthHeader from '@/components/auth/AuthHeader';

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
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
        if (strength < 3) {
          setError('Password is too weak');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
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

      router.push('/dashboards');

    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
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
    </div>
  );
}