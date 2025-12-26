'use client';

import { Card, CardBody, CardHeader, Badge, Table } from 'react-bootstrap';
import IconifyIcon from '@/components/wrapper/IconifyIcon';

const charges = [
  {
    id: 1,
    customer: 'John Smith',
    amount: 1200,
    status: 'success',
    method: 'Card',
    time: '2 min ago',
  },
  {
    id: 2,
    customer: 'Acme Holdings',
    amount: 9800,
    status: 'success',
    method: 'Card',
    time: '1 hour ago',
  },
  {
    id: 3,
    customer: 'Sarah Williams',
    amount: 450,
    status: 'pending',
    method: 'Debit',
    time: 'Today',
  },
  {
    id: 4,
    customer: 'Blue Ocean Ltd',
    amount: 2300,
    status: 'failed',
    method: 'Card',
    time: 'Yesterday',
  },
];

const statusConfig = {
  success: {
    label: 'Success',
    bg: 'success-subtle',
    text: 'success',
    icon: 'solar:check-circle-bold',
  },
  pending: {
    label: 'Pending',
    bg: 'warning-subtle',
    text: 'warning',
    icon: 'solar:clock-circle-bold',
  },
  failed: {
    label: 'Failed',
    bg: 'danger-subtle',
    text: 'danger',
    icon: 'solar:close-circle-bold',
  },
};

const RecentCharges = () => {
  return (
    <Card className="h-100">
      <CardHeader className="d-flex align-items-center justify-content-between">
        <h5 className="mb-0">Recent Charges</h5>
        <span className="text-muted small">Last 24 hours</span>
      </CardHeader>

      <CardBody className="p-0">
        <Table hover responsive className="mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th className="text-end">Time</th>
            </tr>
          </thead>
          <tbody>
            {charges.map((charge) => {
              const status = statusConfig[charge.status];

              return (
                <tr key={charge.id}>
                  <td>
                    <div className="fw-semibold">{charge.customer}</div>
                    <div className="text-muted small">{charge.method}</div>
                  </td>

                  <td className="fw-semibold">
                    R {charge.amount.toLocaleString()}
                  </td>

                  <td>
                    <Badge
                      bg={status.bg}
                      text={status.text}
                      className="d-inline-flex align-items-center gap-1 px-2 py-1"
                    >
                      <IconifyIcon icon={status.icon} />
                      {status.label}
                    </Badge>
                  </td>

                  <td className="text-end text-muted small">
                    {charge.time}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default RecentCharges;