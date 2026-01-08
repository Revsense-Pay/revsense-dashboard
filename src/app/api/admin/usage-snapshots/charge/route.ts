import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/crypto'
import axios from 'axios'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any

    // 🔒 Admin only
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { snapshotId } = await req.json()

    if (!snapshotId) {
      return NextResponse.json(
        { error: 'snapshotId is required' },
        { status: 400 }
      )
    }

    const snapshot = await prisma.usageSnapshot.findUnique({
      where: { id: snapshotId },
    })

    if (!snapshot) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // 🔒 HARD RULES (no backwards / no repeats)
    if (snapshot.status === 'BILLED') {
      return NextResponse.json(
        { error: 'Snapshot already charged' },
        { status: 409 }
      )
    }

    if (snapshot.status !== 'FINALISED') {
      return NextResponse.json(
        { error: 'Only FINALISED snapshots can be charged' },
        { status: 409 }
      )
    }

    // 🔍 Load account billing + Paystack key
    const account = await prisma.account.findUnique({
      where: { id: snapshot.accountId },
      select: {
        billingCustomerCode: true,
        billingAuthCode: true,
        paystackKey: {
          select: {
            secretKeyEncrypted: true,
          },
        },
      },
    })

    if (
      !account ||
      !account.billingAuthCode ||
      !account.billingCustomerCode ||
      !account.paystackKey?.secretKeyEncrypted
    ) {
      return NextResponse.json(
        { error: 'Billing details missing for account' },
        { status: 400 }
      )
    }

    // 🔐 Decrypt Paystack secret key
    const paystackSecretKey = decrypt(
      account.paystackKey.secretKeyEncrypted
    )

    const chargeRes = await axios.post(
      'https://api.paystack.co/transaction/charge_authorization',
      {
        authorization_code: account.billingAuthCode,
        email: account.billingCustomerCode,
        amount: Math.round(snapshot.usageFeeZAR * 100), // kobo
        currency: 'ZAR',
        metadata: {
          type: 'REVSENSE_USAGE',
          snapshotId: snapshot.id,
          period: snapshot.period,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!chargeRes.data?.status) {
      return NextResponse.json(
        { error: chargeRes.data.message || 'Charge failed' },
        { status: 400 }
      )
    }

    const charge = await prisma.charge.create({
      data: {
        accountId: snapshot.accountId,
        amount: Math.round(snapshot.usageFeeZAR * 100),
        currency: 'ZAR',
        status: 'SUCCESS',
        source: 'USAGE',
        paystackReference: chargeRes.data.reference,
      },
    })

    const updated = await prisma.usageSnapshot.update({
      where: { id: snapshotId },
      data: {
        status: 'BILLED',
        billedAt: new Date(),
        paystackReference: chargeRes.data.reference,
        chargeId: charge.id,
      },
    })

    return NextResponse.json({ success: true, snapshot: updated })
  } catch (err) {
    console.error('CHARGE SNAPSHOT ERROR', err)
    return NextResponse.json(
      { error: 'Failed to charge snapshot' },
      { status: 500 }
    )
  }
}