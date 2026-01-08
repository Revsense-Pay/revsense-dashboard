import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from '@/lib/auth'
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.accountId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const account = await prisma.account.findUnique({
      where: {
        id: session.user.accountId,
      },
      select: {
        email: true,
        paystackKey: {
          select: {
            publicKeyEncrypted: true,
            secretKeyEncrypted: true,
          },
        },
      },
    })

    if (!account) {
      return NextResponse.json(
        { success: false, error: "Account not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      settings: {
        email: account.email,
        paystackPublicKey: account.paystackKey?.publicKeyEncrypted ?? "",
        paystackSecretKey: account.paystackKey?.secretKeyEncrypted ?? "",
      },
    })
  } catch (err) {
    console.error("SETTINGS GET ERROR:", err)

    return NextResponse.json(
      { success: false, error: "Failed to load settings" },
      { status: 500 }
    )
  }
}