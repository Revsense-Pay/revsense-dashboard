'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, Button } from 'react-bootstrap';

import paystackDark from '@/assets/images/paystack-dark.png';
import paystackLight from '@/assets/images/paystack-light.png';

const PaystackConnectPage = () => {
  const router = useRouter();

  const handleConnect = () => {
    router.push('/onboarding/success');
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4" style={{ maxWidth: 480, width: '100%' }}>
        {/* PAYSTACK LOGO */}
        <div className="paystack-logo mb-4">
          <Image
            src={paystackDark}
            alt="Paystack"
            height={48}
            priority
            className="logo-dark"
          />
          <Image
            src={paystackLight}
            alt="Paystack"
            height={48}
            priority
            className="logo-light"
          />
        </div>

        <h4 className="text-center mb-2">Connect Paystack</h4>
        <p className="text-muted text-center mb-4">
          Securely connect your Paystack account so Revsense can process
          variable charges on your behalf.
        </p>

        <ul className="text-muted mb-4 ps-3">
          <li>Create and manage charges</li>
          <li>View transactions and payouts</li>
          <li>No access to your Paystack balance</li>
        </ul>

        <Button size="lg" className="w-100" onClick={handleConnect}>
          Connect Paystack
        </Button>
      </Card>
    </div>
  );
};

export default PaystackConnectPage;