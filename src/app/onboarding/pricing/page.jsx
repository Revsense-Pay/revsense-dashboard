'use client';

export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { Col, Row, Button, Form } from 'react-bootstrap';
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
    <div className="auth-center">
      <Row className="justify-content-center mt-5 w-100">
        <Col xl={7} lg={9}>
          <div className="auth-card">
            <h3 className="mb-2 text-white" style={{ color: '#ffffff' }}>Pricing & Fees</h3>
            <p className="mb-4 text-white" style={{ color: '#ffffff' }}>
              Revsense charges a simple platform fee plus a small percentage on
              every transaction you process.
            </p>

            {/* PRICING CARDS */}
            <Row className="mb-4">
              <Col md={6}>
                <div
                  className="h-100"
                  style={{
                    background: '#1b2430',
                    border: '1px solid #2a3441',
                    borderRadius: '12px',
                    padding: '1rem',
                  }}
                >
                  <h6 className="text-white mb-1" style={{ color: '#ffffff' }}>Monthly Platform Fee</h6>
                  <h2 className="fw-bold mb-0 text-white" style={{ color: '#ffffff' }}>
                    R 995
                  </h2>
                  <small className="text-white" style={{ color: '#ffffff' }}>
                    Covers infrastructure, reporting & support
                  </small>
                </div>
              </Col>

              <Col md={6}>
                <div
                  className="h-100"
                  style={{
                    background: '#1b2430',
                    border: '1px solid #2a3441',
                    borderRadius: '12px',
                    padding: '1rem',
                  }}
                >
                  <h6 className="text-white mb-1" style={{ color: '#ffffff' }}>Transaction Fee</h6>
                  <h2 className="fw-bold mb-0 text-white" style={{ color: '#ffffff' }}>
                    0.75%
                  </h2>
                  <small className="text-white" style={{ color: '#ffffff' }}>
                    Applied per successful customer charge
                  </small>
                </div>
              </Col>
            </Row>

            {/* EXPLANATION */}
            <div className="mb-4">
              <p className="mb-2 fw-semibold text-white" style={{ color: '#ffffff' }}>How this works:</p>
              <ul className="text-white" style={{ color: '#ffffff' }}>
                <li>You keep full control of your customers</li>
                <li>Revsense sits on top of your payment provider</li>
                <li>Fees are deducted automatically</li>
                <li>No long-term contracts</li>
              </ul>
            </div>

            {/* ACCEPTANCE */}
            <p className="text-white mb-3" style={{ color: '#ffffff' }}>
              Payment details can be added later.
            </p>
            <Form.Check
              type="checkbox"
              id="acceptPricing"
              className="mb-4"
              checked={accepted}
              onChange={e => setAccepted(e.target.checked)}
              label={<span style={{ color: '#ffffff' }}>I understand and accept Revsense’s pricing</span>}
            />

            <Button
              size="lg"
              className="w-100"
              disabled={!accepted}
              onClick={handleContinue}
            >
              Continue to Paystack setup
            </Button>
          </div>
        </Col>
      </Row>

      <style jsx>{`
        .auth-center {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(1200px 600px at 50% -10%, #1f2a36 0%, #121821 60%);
          padding: 24px;
        }

        .auth-card {
          width: 100%;
          max-width: 860px;
          background: #1b2430;
          border-radius: 14px;
          padding: 32px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
        }
      `}</style>
    </div>
  );
};

export default PricingOnboardingPage;