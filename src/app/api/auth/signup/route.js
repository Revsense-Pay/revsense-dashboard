// src/app/api/auth/signup/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { email, password, companyName } = await req.json()

    if (!email || !password || !companyName) {
      return NextResponse.json(
        { error: 'Company name, email and password are required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase()

    const existing = await prisma.account.findUnique({
      where: { email: normalizedEmail },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Account already exists' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.account.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        companyName: companyName,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('SIGNUP ERROR', err)
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    )
  }
}