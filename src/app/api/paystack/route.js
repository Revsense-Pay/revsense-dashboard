export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/crypto';

export async function POST(req) {
  try {
    // 1️⃣ Ensure authenticated session
    const session = await getServerSession(authOptions);

    if (!session?.user?.accountId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const accountId = session.user.accountId;

    // 2️⃣ Parse body
    const { paystackPublicKey, paystackSecretKey } = await req.json();

    if (!paystackPublicKey || !paystackSecretKey) {
      return NextResponse.json(
        { error: 'Missing Paystack keys' },
        { status: 400 }
      );
    }

    // 3️⃣ Validate key format (IMPORTANT)
    if (
      !paystackPublicKey.startsWith('pk_') ||
      !paystackSecretKey.startsWith('sk_')
    ) {
      return NextResponse.json(
        { error: 'Invalid Paystack keys' },
        { status: 400 }
      );
    }

    // 4️⃣ If keys already exist, do nothing (idempotent)
    const existing = await prisma.paystackKey.findUnique({
      where: { accountId },
    });

    if (existing) {
      return NextResponse.json({ success: true });
    }

    // 5️⃣ Create encrypted keys
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