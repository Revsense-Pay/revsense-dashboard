export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/crypto';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export async function POST(req) {
  try {
    // 1️⃣ Authenticate RevSense user
    const session = await getServerSession(authOptions);

    if (!session?.user?.accountId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accountId = session.user.accountId;

    // 2️⃣ Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { clientEmail, clientName } = body;

    if (!clientEmail) {
      return NextResponse.json(
        { error: 'Client email required' },
        { status: 400 }
      );
    }

    // 🔒 Ensure client exists immediately (PENDING)
    await prisma.client.upsert({
      where: {
        email_accountId: {
          email: clientEmail,
          accountId,
        },
      },
      update: {
        status: 'PENDING',
        name: clientName ?? undefined,
      },
      create: {
        email: clientEmail,
        name: clientName ?? null,
        status: 'PENDING',
        accountId,
      },
    });

    console.log('CREATE SUBSCRIPTION LINK FOR:', clientEmail);

    // 3️⃣ Load Paystack keys
    const paystack = await prisma.paystackKey.findUnique({
      where: { accountId },
    });

    if (!paystack) {
      return NextResponse.json(
        { error: 'Paystack not connected' },
        { status: 400 }
      );
    }

    const secretKey = decrypt(paystack.secretKeyEncrypted);
    let planCode = paystack.planCode;

    // 4️⃣ Create R1 annual plan ONCE
    if (!planCode) {
      const planRes = await fetch(`${PAYSTACK_BASE_URL}/plan`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'RevSense Authorization Plan',
          amount: 100, // R1
          interval: 'annually',
          currency: 'ZAR',
        }),
      });

      const planData = await planRes.json();

      if (!planRes.ok || !planData?.data?.plan_code) {
        console.error('PAYSTACK PLAN ERROR:', planData);
        return NextResponse.json(
          { error: 'Failed to create Paystack plan' },
          { status: 500 }
        );
      }

      planCode = planData.data.plan_code;

      await prisma.paystackKey.update({
        where: { accountId },
        data: { planCode },
      });
    }

    // 5️⃣ Create OR fetch Paystack customer (REQUIRED)
    const customerRes = await fetch(`${PAYSTACK_BASE_URL}/customer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: clientEmail,
      }),
    });

    const customerData = await customerRes.json();

    if (!customerRes.ok || !customerData?.data?.customer_code) {
      console.error('PAYSTACK CUSTOMER ERROR:', customerData);
      return NextResponse.json(
        { error: 'Failed to create Paystack customer' },
        { status: 500 }
      );
    }

    const customerCode = customerData.data.customer_code;

    // 6️⃣ (removed upsert here, client already ensured after email validation)

    // Initialize Paystack transaction for first-time client
    const initRes = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: clientEmail,
        plan: planCode,
        amount: 100, // R1 authorization charge
      }),
    });

    const initData = await initRes.json();

    if (!initRes.ok || !initData?.data?.authorization_url) {
      console.error('PAYSTACK INIT ERROR:', initData);
      return NextResponse.json(
        { error: 'Failed to initialize Paystack checkout' },
        { status: 500 }
      );
    }

    const checkoutUrl = initData.data.authorization_url;

    await prisma.client.update({
      where: {
        email_accountId: {
          email: clientEmail,
          accountId,
        },
      },
      data: {
        subscriptionUrl: checkoutUrl,
      },
    });

    return NextResponse.json({ url: checkoutUrl });

  } catch (err) {
    console.error('SUBSCRIPTION LINK ERROR:', err);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}