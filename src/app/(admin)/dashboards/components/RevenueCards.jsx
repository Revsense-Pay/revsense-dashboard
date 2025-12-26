'use client';

import { useCountUp } from '@/hooks/useCountUp';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrapper/IconifyIcon';

const StatCard = ({ title, value, subtext, icon, gradient, isCurrency }) => {
  const animatedValue = useCountUp(value, {
    formatter: val =>
      isCurrency ? `R ${val.toLocaleString()}` : val.toLocaleString(),
  });

  return (
    <Col xl={3} md={6}>
      <Card className="h-100 stat-card">
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
      <StatCard
  title="Revenue"
  value={data.grossRevenue}
  subtext="Processed"
  icon="solar:wallet-bold"
  gradient="bg-gradient-primary"
  isCurrency
/>

<StatCard
  title="Fees"
  value={data.feesCollected}
  subtext="Your earnings"
  icon="solar:dollar-bold"
  gradient="bg-gradient-success"
  isCurrency
/>

<StatCard
  title="Active Clients"
  value={data.activeClients}
  subtext="Billing live"
  icon="solar:users-group-rounded-bold"
  gradient="bg-gradient-info"
/>

<StatCard
  title="Charges"
  value={data.totalCharges}
  subtext="This period"
  icon="solar:card-bold"
  gradient="bg-gradient-warning"
/>
    </Row>
  );
};

export default RevenueCards;