import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.accountId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const transactions = await prisma.charge.findMany({
      where: {
        accountId: session.user.accountId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      transactions,
    })
  } catch (error) {
    console.error("TRANSACTIONS API ERROR:", error)

    return NextResponse.json(
      { error: "Failed to load transactions" },
      { status: 500 }
    )
  }
}