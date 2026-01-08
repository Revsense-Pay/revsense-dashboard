export const runtime = 'nodejs';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const account = await prisma.account.create({
      data: {
        companyName: 'Test Company',
        email: 'test@revsense.co.za',
      },
    });

    return NextResponse.json({
      success: true,
      account,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'DB write failed' },
      { status: 500 }
    );
  }
}