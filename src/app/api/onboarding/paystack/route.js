export const runtime = 'nodejs';

import axios from 'axios';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/crypto';

export async function POST(req) {
  try {
    // 🔐 Auth
    const session = await getServerSession(authOptions);

    if (!session?.user?.accountId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const accountId = session.user.accountId;

    // 📦 Parse body
    const { paystackPublicKey, paystackSecretKey } = await req.json();

    if (!paystackPublicKey || !paystackSecretKey) {
      return NextResponse.json(
        { error: 'Missing Paystack public or secret key' },
        { status: 400 }
      );
    }

    // 🧪 Validate key format
    if (
      !paystackPublicKey.startsWith('pk_') ||
      !paystackSecretKey.startsWith('sk_')
    ) {
      return NextResponse.json(
        { error: 'Invalid Paystack keys' },
        { status: 400 }
      );
    }

    // 🔁 Prevent duplicate save (idempotent)
    const existing = await prisma.paystackKey.findUnique({
      where: { accountId },
    });

    if (existing) {
      return NextResponse.json({ success: true });
    }

    // 🧪 Verify Paystack secret key (RAW, not encrypted)
    try {
      await axios.get('https://api.paystack.co/bank', {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      });
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid Paystack secret key' },
        { status: 401 }
      );
    }

    // 🔐 Encrypt + save
    await prisma.paystackKey.create({
      data: {
        accountId,
        publicKeyEncrypted: encrypt(paystackPublicKey),
        secretKeyEncrypted: encrypt(paystackSecretKey),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('PAYSTACK SAVE ERROR:', err);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}