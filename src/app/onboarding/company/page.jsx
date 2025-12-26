'use client';

import { Card, Button, Form } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function CompanyOnboarding() {
  const { createWorkspace } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');

  const submit = (e) => {
    e.preventDefault();
    createWorkspace({
      name,
      currency: 'ZAR',
      industry: 'Agency',
    });
    router.push('/onboarding/payments');
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: 520 }}>
      <Card.Body>
        <h4 className="mb-3">Set up your company</h4>

        <Form onSubmit={submit}>
          <Form.Group className="mb-3">
            <Form.Label>Company name</Form.Label>
            <Form.Control
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" className="w-100">
            Continue
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}