'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Badge, Table, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrapper/IconifyIcon';

const statusConfig = {
  SUCCESS: {
    label: 'Success',
    bg: 'success-subtle',
    text: 'success',
    icon: 'solar:check-circle-bold',
  },
  PENDING: {
    label: 'Pending',
    bg: 'warning-subtle',
    text: 'warning',
    icon: 'solar:clock-circle-bold',
  },
  FAILED: {
    label: 'Failed',
    bg: 'danger-subtle',
    text: 'danger',
    icon: 'solar:close-circle-bold',
  },
};

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return new Date(date).toLocaleDateString();
}

const RecentCharges = () => {
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(data => {
        setCharges(data.charges || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="h-100">
      <CardHeader className="d-flex align-items-center justify-content-between">
        <h5 className="mb-0">Recent Charges</h5>
        <span className="text-muted small">Live</span>
      </CardHeader>

      <CardBody className="p-0">
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner />
          </div>
        ) : charges.length === 0 ? (
          <div className="text-center text-muted py-5">
            No charges yet
          </div>
        ) : (
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
                const status = statusConfig[charge.status] || statusConfig.PENDING;

                return (
                  <tr key={charge.id}>
                    <td>
                      <div className="fw-semibold">
                        {charge.clientName || charge.clientEmail}
                      </div>
                      <div className="text-muted small">Card</div>
                    </td>

                    <td className="fw-semibold">
                      R {(charge.amount / 100).toLocaleString()}
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
                      {timeAgo(charge.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default RecentCharges;