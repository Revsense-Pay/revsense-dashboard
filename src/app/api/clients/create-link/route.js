export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma';
import axios from 'axios';
import { decrypt } from '@/lib/crypto';

export async function POST() {
  try {
    // 1️⃣ Auth
    const session = await getServerSession(authOptions);

    if (!session?.user?.accountId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accountId = session.user.accountId;

    // 2️⃣ Load Paystack key
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

    const headers = {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    };

    // 3️⃣ Ensure plan exists
    let planCode = paystack.planCode;

    if (!planCode) {
      const planRes = await axios.post(
        'https://api.paystack.co/plan',
        {
          name: 'Revsense Client Authorization',
          amount: 100, // R1.00
          interval: 'annually',
          currency: 'ZAR',
        },
        { headers }
      );

      planCode = planRes.data.data.plan_code;

      await prisma.paystackKey.update({
        where: { accountId },
        data: { planCode },
      });
    }

    // 4️⃣ Create hosted payment page
    const pageRes = await axios.post(
      'https://api.paystack.co/page',
      {
        name: 'Revsense Client Authorization',
        description: 'Secure authorization for future charges',
        plan: planCode,
        metadata: {
          accountId,
          source: 'revsense_add_client',
        },
      },
      { headers }
    );

    return NextResponse.json({
      checkoutUrl: pageRes.data.data.url,
    });

  } catch (err) {
    console.error('CREATE CLIENT LINK ERROR:', err?.response?.data || err);
    return NextResponse.json(
      { error: 'Failed to generate client link' },
      { status: 500 }
    );
  }
}