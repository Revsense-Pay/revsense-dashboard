'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Col, Row } from 'react-bootstrap';

import Footer from '@/components/layout/Footer';
import IconifyIcon from '@/components/wrapper/IconifyIcon';
import { dashboardData } from './data/dashboardData';

// 🔐 ROUTE PROTECTION
import { useRequireAuth } from '@/hooks/useRequireAuth';

// ✅ Dynamically load browser-only components
const RevenueCards = dynamic(() => import('./components/RevenueCards'), {
  ssr: false,
});

const ChargesChart = dynamic(() => import('./components/ChargesChart'), {
  ssr: false,
});

const RecentCharges = dynamic(() => import('./components/RecentCharges'), {
  ssr: false,
});

const Page = () => {
  // 👇 client-side auth guard
  useRequireAuth();

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

      <RevenueCards data={dashboardData.summary} />
      <ChargesChart data={dashboardData.chart} />
      <RecentCharges data={dashboardData.charges} />

      <Footer />
    </>
  );
};

export default Page;