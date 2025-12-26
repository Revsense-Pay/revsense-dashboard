'use client';

import Footer from '@/components/layout/Footer';
import React from 'react';
import ChargesChart from './components/ChargesChart';
import RecentCharges from './components/RecentCharges';
import Link from 'next/link';
import IconifyIcon from '@/components/wrapper/IconifyIcon';
import { Col, Row } from 'react-bootstrap';
import RevenueCards from './components/RevenueCards';
import { dashboardData } from './data/dashboardData';

// 🔐 ROUTE PROTECTION
import { useRequireAuth } from '@/hooks/useRequireAuth';

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