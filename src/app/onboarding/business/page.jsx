'use client';

import { useRouter } from 'next/navigation';
import { Card, Col, Row, Form, Button } from 'react-bootstrap';
import { useOnboarding } from '@/context/OnboardingContext';
import { useState } from 'react';

const BusinessOnboardingPage = () => {
  const router = useRouter();
  const { onboarding, updateClient } = useOnboarding();

  const [form, setForm] = useState({
    name: onboarding.client.name,
    industry: onboarding.client.industry,
    country: onboarding.client.country,
    email: onboarding.client.email,
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    updateClient(form);
    router.push('/onboarding/pricing'); // next step later
  };

  const isValid =
    form.name &&
    form.industry &&
    form.country &&
    form.email;

  return (
    <Row className="justify-content-center mt-5">
      <Col xl={6} lg={8}>
        <Card className="p-4">
          <h3 className="mb-2">Business Details</h3>
          <p className="text-muted mb-4">
            Tell us a bit about your business. This helps us configure RevSense
            correctly for your billing needs.
          </p>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Business Name</Form.Label>
              <Form.Control
                name="name"
                placeholder="e.g. More Media"
                value={form.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Industry</Form.Label>
              <Form.Select
                name="industry"
                value={form.industry}
                onChange={handleChange}
              >
                <option value="">Select industry</option>
                <option>Media & Marketing</option>
                <option>Hospitality</option>
                <option>SaaS</option>
                <option>Professional Services</option>
                <option>E-commerce</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Select
                name="country"
                value={form.country}
                onChange={handleChange}
              >
                <option value="">Select country</option>
                <option>South Africa</option>
                <option>United Kingdom</option>
                <option>United States</option>
                <option>Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Billing Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="billing@company.com"
                value={form.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Button
              size="lg"
              className="w-100"
              disabled={!isValid}
              onClick={handleContinue}
            >
              Continue
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default BusinessOnboardingPage;