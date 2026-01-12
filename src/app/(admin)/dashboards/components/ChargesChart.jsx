'use client';

export const dynamic = 'force-dynamic';

import {
  Card,
  CardBody,
  Col,
  Row,
} from 'react-bootstrap';
import Chart from 'react-apexcharts';
import { useMemo } from 'react';

const ChargesChart = ({ data = [] }) => {
  // API returns array like:
  // [{ date: '2026-01-12', total: 30000 }]
  const safeData = Array.isArray(data) ? data : [];

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  const monthData = safeData.filter(item => {
    if (!item.date) return false;
    const d = new Date(item.date);
    return (
      d.getFullYear() === currentYear &&
      d.getMonth() === currentMonth
    );
  });

  const getAmount = (item) => {
    if (typeof item.total === 'number') return item.total; // dashboard API
    if (typeof item.grossCents === 'number') return item.grossCents;
    if (typeof item.amountCents === 'number') return item.amountCents;
    if (typeof item.amount === 'number') return item.amount;
    return 0;
  };

  const series = useMemo(
    () => [
      {
        name: 'Charges (ZAR)',
        data: monthData.map(item => getAmount(item) / 100),
      },
    ],
    [monthData]
  );

  const options = useMemo(
    () => ({
      chart: {
        type: 'area',
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
        },
      },
      colors: ['#ff7a18'],
      dataLabels: { enabled: false },
      xaxis: {
        categories: monthData.map(item => item.date),
        labels: {
          style: { colors: '#9ca3af' },
        },
      },
      yaxis: {
        labels: {
          formatter: val => `R ${val.toLocaleString()}`,
          style: { colors: '#9ca3af' },
        },
      },
      grid: {
        borderColor: 'rgba(255,255,255,0.05)',
      },
      tooltip: {
        y: {
          formatter: val => `R ${val.toLocaleString()}`,
        },
      },
    }),
    [monthData]
  );

  return (
    <Row className="mb-4">
      <Col xl={12}>
        {monthData.length === 0 ? (
          <Card>
            <CardBody>
              <h5 className="mb-1">Charges Over Time</h5>
              <small className="text-muted">
                No charges recorded for this month
              </small>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h5 className="mb-1">Charges Over Time</h5>
                  <small className="text-muted">
                    Total customer charges processed
                  </small>
                </div>
              </div>

              <Chart
                options={options}
                series={series}
                type="area"
                height={320}
              />
            </CardBody>
          </Card>
        )}
      </Col>
    </Row>
  );
};

export default ChargesChart;