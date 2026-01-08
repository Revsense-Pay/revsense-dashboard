import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { email } = await req.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existing = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: session.user.id },
      },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email already in use" },
        { status: 400 }
      )
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { email },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("ACCOUNT EMAIL UPDATE ERROR:", err)
    return NextResponse.json(
      { success: false, error: "Failed to update email" },
      { status: 500 }
    )
  }
}