'use client';

import { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email);
    router.push('/onboarding/company');
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: 420 }}>
      <Card.Body>
        <h4 className="mb-3">Create your RevSense account</h4>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control required type="password" />
          </Form.Group>

          <Button type="submit" className="w-100">
            Continue
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}