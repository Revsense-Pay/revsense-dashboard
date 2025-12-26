'use client';

import { useState } from 'react';
import { useCurrencyInput } from '@/hooks/useCurrencyInput';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Form,
  Button,
  Table,
} from 'react-bootstrap';
import IconifyIcon from '@/components/wrapper/IconifyIcon';

const ChargeConsolePage = () => {
  const amount = useCurrencyInput();
  const [customer, setCustomer] = useState('');

  const isChargeDisabled =
    !amount.rawValue ||
    amount.rawValue <= 0 ||
    !customer;

  return (
    <>
      {/* PAGE TITLE */}
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-1">Charge Console</h4>
            <p className="text-muted mb-0">
              Charge customers instantly and track transactions in real time.
            </p>
          </div>
        </Col>
      </Row>

      {/* MAIN CONTENT */}
      <Row className="g-4">
        {/* QUICK CHARGE */}
        <Col xl={7}>
          <Card className="h-100">
            <CardHeader>
              <h5 className="mb-0">Quick Charge</h5>
            </CardHeader>

            <CardBody>
              <Form>
                {/* AMOUNT */}
                <Form.Group className="mb-4">
                  <Form.Label>Amount</Form.Label>

                  <div className="position-relative">
                    <span
                      style={{
                        position: 'absolute',
                        left: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontWeight: 600,
                        fontSize: 18,
                        color: '#6c757d',
                        pointerEvents: 'none',
                      }}
                    >
                      R
                    </span>

                    <Form.Control
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={amount.value}
                      onChange={amount.onChange}
                      onBlur={amount.onBlur}
                      onFocus={amount.onFocus}
                      className="ps-5 py-3 fs-4 fw-semibold"
                    />
                  </div>
                </Form.Group>

                {/* CUSTOMER */}
                <Form.Group className="mb-3">
                  <Form.Label>Customer</Form.Label>
                  <Form.Select
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                  >
                    <option value="">Select customer</option>
                    <option value="john">John Smith</option>
                    <option value="acme">Acme Holdings</option>
                    <option value="sarah">Sarah Williams</option>
                  </Form.Select>
                </Form.Group>

                {/* DESCRIPTION */}
                <Form.Group className="mb-4">
                  <Form.Label>Description (optional)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. March retainer, extra usage"
                  />
                </Form.Group>

                {/* CTA */}
                <Button
                  variant="primary"
                  size="lg"
                  disabled={isChargeDisabled}
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <IconifyIcon icon="solar:card-send-bold" />
                  Charge Now
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>

        {/* RECENT CHARGES */}
        <Col xl={5}>
          <Card className="h-100">
            <CardHeader className="d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Recent Charges</h5>
              <Button variant="link" size="sm">
                View all
              </Button>
            </CardHeader>

            <CardBody className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Smith</td>
                    <td>R 1,200</td>
                    <td>
                      <span className="badge bg-success-subtle text-success">
                        Success
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Acme Holdings</td>
                    <td>R 9,800</td>
                    <td>
                      <span className="badge bg-success-subtle text-success">
                        Success
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Sarah Williams</td>
                    <td>R 450</td>
                    <td>
                      <span className="badge bg-warning-subtle text-warning">
                        Pending
                      </span>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ChargeConsolePage;