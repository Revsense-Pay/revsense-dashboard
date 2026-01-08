'use client';

import { useState, useEffect } from 'react';
import { useCurrencyInput } from '@/hooks/useCurrencyInput';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Form,
  Button,
  Table,
  Spinner,
} from 'react-bootstrap';
import IconifyIcon from '@/components/wrapper/IconifyIcon';
import { toast } from 'sonner';

const ChargeConsolePage = () => {
  const amount = useCurrencyInput();
  const { data: session, status: sessionStatus } = useSession();

  if (sessionStatus === 'loading') {
    return null;
  }

  if (session?.user?.billingStatus !== 'ACTIVE') {
    return (
      <Row>
        <Col xl={8} className="mx-auto">
          <Card>
            <CardBody className="text-center py-5">
              <IconifyIcon
                icon="solar:lock-keyhole-bold"
                className="fs-1 mb-3 text-warning"
              />
              <h4 className="mb-2">Billing not activated</h4>
              <p className="text-muted mb-4">
                You need to activate billing before you can charge customers.
              </p>
              <Button
                variant="primary"
                size="lg"
                href="https://paystack.shop/pay/627-5pbye6"
                target="_blank"
                rel="noopener noreferrer"
              >
                Activate Billing
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }

  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const [recentCharges, setRecentCharges] = useState([]);
  const [loadingCharges, setLoadingCharges] = useState(true);

  /* ----------------------------------
     Load chargeable clients
  ---------------------------------- */
  useEffect(() => {
    async function loadClients() {
      try {
        const res = await fetch('/api/clients/chargeable');
        const data = await res.json();
        setClients(Array.isArray(data) ? data : data.clients || []);
      } catch {
        setClients([]);
      } finally {
        setLoadingClients(false);
      }
    }

    loadClients();
  }, []);

  const parsedAmount = parseFloat(
    amount.value.replace(/,/g, '')
  );

  const isChargeDisabled =
    loading ||
    !clientId ||
    isNaN(parsedAmount) ||
    parsedAmount <= 0;

  useEffect(() => {
    async function loadRecentCharges() {
      try {
        const res = await fetch('/api/charges/recent');
        const data = await res.json();
        setRecentCharges(data.charges || []);
      } catch {
        setRecentCharges([]);
      } finally {
        setLoadingCharges(false);
      }
    }

    loadRecentCharges();
  }, []);

  /* ----------------------------------
     Submit charge
  ---------------------------------- */
  async function handleCharge() {
    if (isChargeDisabled) return;

    setLoading(true);
    const toastId = toast.loading('Charging customer…');
    let chargeSucceeded = false;

    try {
      const res = await fetch('/api/charges/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          amount: Math.round(parsedAmount * 100), // kobo
          description,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || 'Charge failed', { id: toastId });
        return;
      }

      // ✅ Mark success before any UI updates
      chargeSucceeded = true;

      toast.success('Charge successful', { id: toastId });

      // Reset form
      amount.reset();
      setClientId('');
      setDescription('');

      // Optimistic UI update
      if (data.charge) {
        setRecentCharges((prev) => [data.charge, ...prev]);
      }
    } catch (err) {
      // ❌ Only show this if the charge never succeeded
      if (!chargeSucceeded) {
        toast.error('Something went wrong while charging', { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* PAGE HEADER */}
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-1">Charge Console</h4>
            <p className="text-muted mb-0">
              Instantly charge customers using saved Paystack authorizations.
            </p>
          </div>
        </Col>
      </Row>

      {/* CONTENT */}
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
                        color: '#adb5bd',
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

                {/* CLIENT */}
                <Form.Group className="mb-3">
                  <Form.Label>Customer</Form.Label>

                  {loadingClients ? (
                    <div className="text-muted small">
                      <Spinner size="sm" className="me-2" />
                      Loading customers…
                    </div>
                  ) : (
                    <Form.Select
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                    >
                      <option value="">Select customer</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name || client.email}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                </Form.Group>

                {/* DESCRIPTION */}
                <Form.Group className="mb-4">
                  <Form.Label>Description (optional)</Form.Label>
                  <Form.Control
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Extra usage, March retainer"
                  />
                </Form.Group>

                {/* CTA */}
                <Button
                  variant="primary"
                  size="lg"
                  disabled={isChargeDisabled}
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={handleCharge}
                >
                  <IconifyIcon icon="solar:card-send-bold" />
                  {loading ? 'Charging…' : 'Charge Now'}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>

        {/* RECENT CHARGES (placeholder – webhook-backed later) */}
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
                  {loadingCharges ? (
                    <tr>
                      <td colSpan={3} className="text-center py-4">
                        <Spinner size="sm" className="me-2" />
                        Loading charges…
                      </td>
                    </tr>
                  ) : recentCharges.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center text-muted py-4">
                        No charges yet
                      </td>
                    </tr>
                  ) : (
                    recentCharges.map((charge) => (
                      <tr key={charge.id}>
                        <td>{charge.client?.name || charge.client?.email}</td>
                        <td>R {(charge.amount / 100).toFixed(2)}</td>
                        <td>
                          <span className="badge bg-success">
                            {charge.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
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