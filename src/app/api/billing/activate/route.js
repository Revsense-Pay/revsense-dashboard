// src/app/api/billing/activate/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuid } from 'uuid';

const PAYSTACK_BASE = 'https://api.paystack.co';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accountId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accountId = session.user.accountId;

    // 1️⃣ Look for existing billing plan on OUR Paystack
    const PLAN_NAME = 'RevSense Platform Fee';
    let planCode = process.env.REVSENSE_PLAN_CODE;

    // (Optional) If you want to auto-create instead of env var:
    if (!planCode) {
      const planRes = await fetch(`${PAYSTACK_BASE}/plan`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: PLAN_NAME,
          interval: 'monthly',
          amount: 99500, // R995
        }),
      });

      const planData = await planRes.json();
      if (!planData.status) throw new Error('Failed to create billing plan');

      planCode = planData.data.plan_code;
    }

    // 2️⃣ Create subscription payment link
    const initRes = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: session.user.email,
        plan: planCode,
        reference: `rev-billing-${uuid()}`,
        metadata: {
          accountId,
          type: 'REVSENSE_BILLING',
        },
      }),
    });

    const initData = await initRes.json();
    if (!initData.status) {
      throw new Error('Failed to initialize billing checkout');
    }

    return NextResponse.json({
      url: initData.data.authorization_url,
    });
  } catch (err) {
    console.error('BILLING ACTIVATE ERROR:', err);
    return NextResponse.json(
      { error: 'Failed to activate billing' },
      { status: 500 }
    );
  }
}