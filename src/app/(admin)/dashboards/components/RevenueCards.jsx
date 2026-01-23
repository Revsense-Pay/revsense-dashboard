'use client';

export const dynamic = 'force-dynamic';

import { useCountUp } from '@/hooks/useCountUp';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrapper/IconifyIcon';

// Paystack fee constant (2.9%)
const PAYSTACK_FEE_PERCENT = 0.029;

const StatCard = ({ title, value, subtext, icon, gradient, isCurrency }) => {
  const animatedValue = useCountUp(value, {
    formatter: val =>
      isCurrency ? `R ${val.toLocaleString()}` : val.toLocaleString(),
  });

  return (
    <Col xl={3} md={6}>
      <Card className="h-100 stat-card dashboard-card">
        <CardBody className="d-flex align-items-center gap-3">
          <div className={`stat-icon ${gradient}`}>
            <IconifyIcon icon={icon} width={22} />
          </div>

          <div>
            <h6 className="text-muted mb-1">{title}</h6>
            <h4 className="mb-0 fw-bold">{animatedValue}</h4>
            <small className="text-muted">{subtext}</small>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

const RevenueCards = ({ data }) => {
  return (
    <Row className="g-4 mb-4">
      {/* Revenue — unchanged */}
      <StatCard
        key={`revenue-${data?.grossCents ?? 0}`}
        title="Revenue"
        value={(data?.grossCents ?? 0) / 100}
        subtext="Processed"
        icon="solar:wallet-bold"
        gradient="bg-gradient-primary"
        isCurrency
      />

      {/* Paystack Fees — derived at 2.9% */}
      <StatCard
        key={`paystack-fees-${data?.grossCents ?? 0}`}
        title="Paystack Fees"
        value={((data?.grossCents ?? 0) * PAYSTACK_FEE_PERCENT) / 100}
        subtext="Estimated (2.9%)"
        icon="solar:dollar-bold"
        gradient="bg-gradient-success"
        isCurrency
      />

      {/* Active clients — unchanged */}
      <StatCard
        key={`clients-${data?.activeClients ?? 0}`}
        title="Active Clients"
        value={data?.activeClients ?? 0}
        subtext="Billing live"
        icon="solar:users-group-rounded-bold"
        gradient="bg-gradient-info"
      />

      {/* Charges — unchanged */}
      <StatCard
        key={`charges-${data?.chargeCount ?? 0}`}
        title="Charges"
        value={data?.chargeCount ?? 0}
        subtext="This period"
        icon="solar:card-bold"
        gradient="bg-gradient-warning"
      />
    </Row>
  );
};

export default RevenueCards;