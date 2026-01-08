export const runtime = 'nodejs';

import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/crypto';

const PLATFORM_PLAN_CODE = process.env.REVSENSE_PLATFORM_PLAN_CODE;

export async function POST(req) {
  try {
    // 1️⃣ Read raw body FIRST
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Paystack signature' },
        { status: 400 }
      );
    }

    // 2️⃣ Parse JSON safely
    let event;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }
    // 👉 Event-type guard: Only process relevant Paystack events
    const eventType = event?.event;
    if (!eventType || !['charge.success', 'subscription.create', 'subscription.enable'].includes(eventType)) {
      return NextResponse.json({ received: true });
    }

    // 3️⃣ Extract planCode BEFORE DB access
    const data = event?.data;

    const planCode =
      data?.plan?.plan_code ||
      data?.subscription?.plan?.plan_code ||
      data?.subscription?.plan_code ||
      data?.plan_code;

    if (!planCode) {
      // Event not relevant to subscriptions
      return NextResponse.json({ received: true });
    }

    // 4️⃣ Determine secret key BEFORE any DB writes and verify signature

    let secretKey;
    let paystackKey;

    if (planCode === PLATFORM_PLAN_CODE) {
      secretKey = process.env.PAYSTACK_SECRET_KEY;
    } else {
      // Lookup paystackKey for signature verification
      paystackKey = await prisma.paystackKey.findFirst({
        where: { planCode },
        select: {
          accountId: true,
          secretKeyEncrypted: true,
        },
      });

      if (!paystackKey?.secretKeyEncrypted) {
        return NextResponse.json(
          { error: 'Unknown Paystack plan' },
          { status: 404 }
        );
      }

      secretKey = decrypt(paystackKey.secretKeyEncrypted);
    }

    // Verify signature (NOW SAFE)
    const computedHash = crypto
      .createHmac('sha512', secretKey)
      .update(rawBody)
      .digest('hex');

    if (computedHash !== signature) {
      return NextResponse.json(
        { error: 'Invalid Paystack signature' },
        { status: 401 }
      );
    }

    // 5️⃣ Handle platform billing block without paystackKey reference
    if (planCode === PLATFORM_PLAN_CODE) {
      const accountId = data?.metadata?.accountId;
      if (!accountId) {
        return NextResponse.json(
          { error: 'Missing accountId in metadata for platform plan' },
          { status: 400 }
        );
      }

      await prisma.account.update({
        where: { id: accountId },
        data: {
          billingStatus: 'ACTIVE',
          billingPlanCode: PLATFORM_PLAN_CODE,
        },
      });

      return NextResponse.json({ received: true });
    }

    // 6️⃣ Only process successful billing events
    const authorization = data?.authorization;
    const customer = data?.customer;

    if (
      !authorization?.authorization_code ||
      !customer?.email
    ) {
      return NextResponse.json({ received: true });
    }

    // 7️⃣ Upsert client (idempotent)
    const isChargeSuccess = eventType === 'charge.success';

    const client = await prisma.client.upsert({
      where: {
        email_accountId: {
          email: customer.email,
          accountId: paystackKey.accountId,
        },
      },
      update: {
        status: 'ACTIVE',
        authorizationCode: authorization.authorization_code,
        paystackCustomerCode: customer.customer_code,
        planCode,

        ...(isChargeSuccess && {
          cardLast4: authorization.last4 ?? null,
          cardType: authorization.card_type ?? null,
          bank: authorization.bank ?? null,
        }),
      },
      create: {
        email: customer.email,
        paystackCustomerCode: customer.customer_code,
        authorizationCode: authorization.authorization_code,
        status: 'ACTIVE',
        accountId: paystackKey.accountId,
        planCode,

        ...(isChargeSuccess && {
          cardLast4: authorization.last4 ?? null,
          cardType: authorization.card_type ?? null,
          bank: authorization.bank ?? null,
        }),
      },
    });

    // 8️⃣ Record successful charge (only if amount exists), idempotently
    if (typeof data.amount === 'number' && data.currency && data.reference) {
      await prisma.charge.upsert({
        where: {
          paystackRef: data.reference,
        },
        update: {
          amount: data.amount,
          currency: data.currency,
          status: 'SUCCESS',
          description: data.metadata?.description ?? null,
          clientId: client.id,
          accountId: paystackKey.accountId,
        },
        create: {
          amount: data.amount,
          currency: data.currency,
          status: 'SUCCESS',
          description: data.metadata?.description ?? null,
          clientId: client.id,
          accountId: paystackKey.accountId,
          paystackRef: data.reference,
        },
      });
    }

    return NextResponse.json({ received: true });

  } catch (err) {
    console.error('PAYSTACK WEBHOOK ERROR:', err);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}