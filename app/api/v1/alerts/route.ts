import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const member = await db.member.findFirst({ where: { userId }, include: { organization: true } })
    if (!member) return NextResponse.json({ error: "Organization not found" }, { status: 404 })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const severity = searchParams.get("severity")
    const limit = parseInt(searchParams.get("limit") || "50")

    const alerts = await db.alert.findMany({
      where: { organizationId: member.organizationId, ...(status && { status: status as any }), ...(severity && { severity: severity as any }) },
      include: { memoryEvent: { include: { agent: { select: { id: true, name: true } } } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { alertId, status, resolution } = body

    if (!alertId || !status) return NextResponse.json({ error: "alertId and status are required" }, { status: 400 })

    const member = await db.member.findFirst({ where: { userId } })
    if (!member) return NextResponse.json({ error: "Organization not found" }, { status: 404 })

    const alert = await db.alert.findFirst({ where: { id: alertId, organizationId: member.organizationId } })
    if (!alert) return NextResponse.json({ error: "Alert not found" }, { status: 404 })

    const updatedAlert = await db.alert.update({ where: { id: alertId }, data: { status, resolution, ...(status === "RESOLVED" && { resolvedAt: new Date(), resolvedBy: userId }) } })
    return NextResponse.json({ alert: updatedAlert })
  } catch (error) {
    console.error("Error updating alert:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
