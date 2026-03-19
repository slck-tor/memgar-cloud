NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const member = await db.member.findFirst({ where: { userId }, include: { organization: true } })
    if (!member) return NextResponse.json({ error: "Organization not found" }, { status: 404 })

    const agents = await db.agent.findMany({ where: { organizationId: member.organizationId }, orderBy: { createdAt: "desc" } })
    return NextResponse.json({ agents })
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const member = await db.member.findFirst({ where: { userId }, include: { organization: true } })
    if (!member) return NextResponse.json({ error: "Organization not found" }, { status: 404 })

    const org = member.organization
    const agentCount = await db.agent.count({ where: { organizationId: org.id } })

    if (org.agentLimit > 0 && agentCount >= org.agentLimit) {
      return NextResponse.json({ error: "Agent limit reached. Please upgrade your plan." }, { status: 429 })
    }

    const body = await request.json()
    const { name, description, type, mode } = body

    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 })

    const agent = await db.agent.create({ data: { name, description, type: type || "CUSTOM", mode: mode || "MONITOR", organizationId: org.id } })
    return NextResponse.json({ agent }, { status: 201 })
  } catch (error) {
    console.error("Error creating agent:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
