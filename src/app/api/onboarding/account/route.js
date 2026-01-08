import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { companyName, email } = await req.json();

    if (!companyName || !email) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      );
    }

    const account = await prisma.account.create({
      data: { companyName, email },
    });

    return NextResponse.json({ account });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Account creation failed' },
      { status: 500 }
    );
  }
}