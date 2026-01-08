import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.accountId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { paystackPublicKey, paystackSecretKey } = body

    if (!paystackPublicKey || !paystackSecretKey) {
      return NextResponse.json(
        { success: false, error: "Missing API keys" },
        { status: 400 }
      )
    }

    await prisma.account.update({
      where: { id: session.user.accountId },
      data: {
        paystackPublicKey,
        paystackSecretKey,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("SETTINGS SAVE ERROR:", err)

    return NextResponse.json(
      { success: false, error: "Failed to save settings" },
      { status: 500 }
    )
  }
}