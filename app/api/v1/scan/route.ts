import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { analyzeBatch } from "@/lib/analyze"
import { hashApiKey } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key")
    if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 401 })

    const keyHash = hashApiKey(apiKey)
    const apiKeyRecord = await db.apiKey.findUnique({ where: { keyHash }, include: { organization: true } })
    if (!apiKeyRecord) return NextResponse.json({ error: "Invalid API key" }, { status: 401 })

    const body = await request.json()
    const { memories, agentId } = body

    if (!memories || !Array.isArray(memories)) return NextResponse.json({ error: "memories must be an array" }, { status: 400 })
    if (memories.length > 100) return NextResponse.json({ error: "Maximum 100 memories per batch" }, { status: 400 })

    const org = apiKeyRecord.organization

    if (org.scanLimit > 0 && org.scansUsed + memories.length > org.scanLimit) {
      return NextResponse.json({ error: "Scan limit would be exceeded. Please upgrade your plan." }, { status: 429 })
    }

    const contents = memories.map((m: any) => typeof m === "string" ? m : m.content || JSON.stringify(m))
    const enableSemantic = org.plan !== "FREE"
    const result = await analyzeBatch(contents, { enableSemantic })

    await db.organization.update({ where: { id: org.id }, data: { scansUsed: { increment: memories.length } } })

    return NextResponse.json({
      total: result.total,
      allowed: result.allowed,
      blocked: result.blocked,
      quarantined: result.quarantined,
      results: result.results.map((r, i) => ({ index: i, decision: r.decision, riskScore: r.riskScore, threatType: r.threatType, explanation: r.explanation })),
    })
  } catch (error) {
    console.error("Batch scan error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
