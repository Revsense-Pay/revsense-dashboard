'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import Link from 'next/link';
import { Col, Row } from 'react-bootstrap';

import Footer from '@/components/layout/Footer';
import IconifyIcon from '@/components/wrapper/IconifyIcon';

// ✅ Dynamically load browser-only components
const RevenueCards = dynamicImport(() => import('./components/RevenueCards'), {
  ssr: false,
});

const ChargesChart = dynamicImport(() => import('./components/ChargesChart'), {
  ssr: false,
});

const RecentCharges = dynamicImport(() => import('./components/RecentCharges'), {
  ssr: false,
});

const Page = () => {
  // 👇 client-side auth guard
  useRequireAuth();

  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      setDashboardData(data);
    };

    loadDashboard();
  }, []);

  if (!dashboardData) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 12,
          color: '#9ca3af',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: '3px solid rgba(255,255,255,0.15)',
            borderTop: '3px solid #ff7700ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <div style={{ fontSize: 14, letterSpacing: 0.3 }}>
          Loading your dashboard…
        </div>

        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Dashboard</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Revsense</Link>
              </li>
              <div className="mx-1" style={{ height: 24, paddingRight: 8 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Dashboard</li>
            </ol>
          </div>
        </Col>
      </Row>

      <RevenueCards data={dashboardData.summary ?? {}} />
      <ChargesChart data={dashboardData.chart ?? []} />
      <RecentCharges data={dashboardData.charges ?? []} />

      <Footer />
    </>
  );
};

export default Page;