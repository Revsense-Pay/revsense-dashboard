'use client';

import { useRouter } from 'next/navigation';
import { Card, Col, Row, Button, Form } from 'react-bootstrap';
import { useOnboarding } from '@/context/OnboardingContext';
import { useState } from 'react';

const PricingOnboardingPage = () => {
  const router = useRouter();
  const { onboarding, updatePricing, updateOnboarding } = useOnboarding();

  const [accepted, setAccepted] = useState(false);

  const platformFee = onboarding.pricing.platformFee;
  const transactionFee = onboarding.pricing.transactionFee;

  const handleContinue = () => {
    updatePricing({
      platformFee,
      transactionFee,
    });

    updateOnboarding({ step: 3 });
    router.push('/onboarding/paystack');
  };

  return (
    <Row className="justify-content-center mt-5">
      <Col xl={7} lg={9}>
        <Card className="p-4">
          <h3 className="mb-2">Pricing & Fees</h3>
          <p className="text-muted mb-4">
            RevSense charges a simple platform fee plus a small percentage on
            every transaction you process.
          </p>

          {/* PRICING CARDS */}
          <Row className="mb-4">
            <Col md={6}>
              <Card className="h-100 border">
                <Card.Body>
                  <h6 className="text-muted mb-1">Monthly Platform Fee</h6>
                  <h2 className="fw-bold mb-0">
                    R {platformFee.toLocaleString()}
                  </h2>
                  <small className="text-muted">
                    Covers infrastructure, reporting & support
                  </small>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100 border">
                <Card.Body>
                  <h6 className="text-muted mb-1">Transaction Fee</h6>
                  <h2 className="fw-bold mb-0">
                    {(transactionFee * 100).toFixed(2)}%
                  </h2>
                  <small className="text-muted">
                    Applied per successful customer charge
                  </small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* EXPLANATION */}
          <div className="mb-4">
            <p className="mb-2 fw-semibold">How this works:</p>
            <ul className="text-muted">
              <li>You keep full control of your customers</li>
              <li>RevSense sits on top of your payment provider</li>
              <li>Fees are deducted automatically</li>
              <li>No long-term contracts</li>
            </ul>
          </div>

          {/* ACCEPTANCE */}
          <Form.Check
            type="checkbox"
            id="acceptPricing"
            className="mb-4"
            checked={accepted}
            onChange={e => setAccepted(e.target.checked)}
            label="I understand and accept RevSense’s pricing"
          />

          <Button
            size="lg"
            className="w-100"
            disabled={!accepted}
            onClick={handleContinue}
          >
            Continue to Payment Setup
          </Button>
        </Card>
      </Col>
    </Row>
  );
};

export default PricingOnboardingPage;