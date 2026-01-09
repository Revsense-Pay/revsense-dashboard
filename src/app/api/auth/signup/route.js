// src/app/api/auth/signup/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ ok: true })
}