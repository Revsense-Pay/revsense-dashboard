export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/crypto';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accountId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clientId, amount, description } = await req.json();

    if (!clientId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    // 🔒 Enforce ownership + ACTIVE status
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        accountId: session.user.accountId,
        status: 'ACTIVE',
      },
    });

    if (!client || !client.authorizationCode) {
      return NextResponse.json(
        { error: 'Client not chargeable' },
        { status: 400 }
      );
    }

    const paystackKey = await prisma.paystackKey.findUnique({
      where: { accountId: session.user.accountId },
    });

    if (!paystackKey) {
      return NextResponse.json(
        { error: 'Paystack not connected' },
        { status: 400 }
      );
    }

    const secretKey = decrypt(paystackKey.secretKeyEncrypted);

    // 🔐 Idempotency reference
    const reference = crypto.randomUUID();

    const res = await fetch(
      'https://api.paystack.co/transaction/charge_authorization',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorization_code: client.authorizationCode,
          email: client.email,
          amount, // already in kobo
          currency: 'ZAR',
          reference,
          metadata: {
            description,
            clientId,
          },
        }),
      }
    );

    const data = await res.json();

    if (!res.ok || !data.status) {
      console.error('PAYSTACK ERROR:', data);
      return NextResponse.json(
        { error: data.message || 'Charge failed' },
        { status: 500 }
      );
    }

    // ✅ Persist charge
    const charge = await prisma.charge.create({
      data: {
        clientId: client.id,
        accountId: client.accountId,
        amount,
        currency: 'ZAR',
        source: 'CLIENT',
        paystackReference: reference,
        status: data.data.status === 'success' ? 'SUCCESS' : 'FAILED',
        description: description ?? null,
      },
    });

    console.log('CHARGE SAVED', charge.id, charge.amount)

    // ✅ ALWAYS return JSON on success
    return NextResponse.json({
      success: true,
      charge: {
        id: charge.id,
        amount: charge.amount,
        status: charge.status,
        createdAt: charge.createdAt,
        client: {
          id: client.id,
          name: client.name,
          email: client.email,
        },
      },
    });

  } catch (err) {
    console.error('CHARGE ERROR:', err);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}