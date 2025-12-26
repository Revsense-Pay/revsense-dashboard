'use client';

export const dynamic = 'force-dynamic';
export const revalidate = false;

import React from 'react';
import dynamicImport from 'next/dynamic';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import IconifyIcon from '@/components/wrapper/IconifyIcon';
import { Col, Row } from 'react-bootstrap';
import { dashboardData } from './data/dashboardData';

// 🔐 ROUTE PROTECTION
import { useRequireAuth } from '@/hooks/useRequireAuth';

const RevenueCards = dynamicImport(
  () => import('./components/RevenueCards'),
  { ssr: false }
);

const ChargesChart = dynamicImport(
  () => import('./components/ChargesChart'),
  { ssr: false }
);

const RecentCharges = dynamicImport(
  () => import('./components/RecentCharges'),
  { ssr: false }
);

const Page = () => {
  // 👇 route guard MUST run before render
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
              <div
                className="mx-1"
                style={{ height: 24, paddingRight: '8px' }}
              >
                <IconifyIcon
                  icon="bx:chevron-right"
                  height={16}
                  width={16}
                />
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