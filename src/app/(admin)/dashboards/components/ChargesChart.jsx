'use client';

export const dynamic = 'force-dynamic';

import {
  Card,
  CardBody,
  Col,
  Row,
  ButtonGroup,
  Button,
} from 'react-bootstrap';
import Chart from 'react-apexcharts';
import { useState, useMemo } from 'react';

const ChargesChart = ({ data = [] }) => {
  // API returns array like:
  // [{ day: '2026-01-12', grossCents: 30000 }]
  const safeData = Array.isArray(data) ? data : [];

  const [range, setRange] = useState('30d');

  const series = useMemo(
    () => [
      {
        name: 'Charges (ZAR)',
        data: safeData.map(item =>
          typeof item.grossCents === 'number'
            ? item.grossCents / 100
            : 0
        ),
      },
    ],
    [safeData]
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
        categories: safeData.map(item => item.day),
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
    [safeData]
  );

  return (
    <Row className="mb-4">
      <Col xl={12}>
        {safeData.length === 0 ? (
          <Card>
            <CardBody>
              <h5 className="mb-1">Charges Over Time</h5>
              <small className="text-muted">
                No charge data for the selected period
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

                <ButtonGroup size="sm">
                  <Button
                    variant={range === '7d' ? 'primary' : 'outline-secondary'}
                    onClick={() => setRange('7d')}
                  >
                    7D
                  </Button>
                  <Button
                    variant={range === '30d' ? 'primary' : 'outline-secondary'}
                    onClick={() => setRange('30d')}
                  >
                    30D
                  </Button>
                  <Button
                    variant={range === '90d' ? 'primary' : 'outline-secondary'}
                    onClick={() => setRange('90d')}
                  >
                    90D
                  </Button>
                </ButtonGroup>
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