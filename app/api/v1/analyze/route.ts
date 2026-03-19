import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { analyze } from "@/lib/analyze"
import { hashApiKey, hashContent, maskContent } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key")
    if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 401 })

    const keyHash = hashApiKey(apiKey)
    const apiKeyRecord = await db.apiKey.findUnique({ where: { keyHash }, include: { organization: true } })
    if (!apiKeyRecord) return NextResponse.json({ error: "Invalid API key" }, { status: 401 })

    if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: "API key expired" }, { status: 401 })
    }

    await db.apiKey.update({ where: { id: apiKeyRecord.id }, data: { lastUsedAt: new Date() } })

    const org = apiKeyRecord.organization
    if (org.scanLimit > 0 && org.scansUsed >= org.scanLimit) {
      return NextResponse.json({ error: "Scan limit exceeded. Please upgrade your plan." }, { status: 429 })
    }

    const body = await request.json()
    const { content, sourceType, sourceId, agentId } = body

    if (!content) return NextResponse.json({ error: "Missing content field" }, { status: 400 })
    if (!agentId) return NextResponse.json({ error: "Missing agentId field" }, { status: 400 })

    const agent = await db.agent.findFirst({ where: { id: agentId, organizationId: org.id } })
    if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 })

    const enableSemantic = org.plan !== "FREE"
    const result = await analyze({ content, sourceType, sourceId, agentId, enableSemantic })

    const memoryEvent = await db.memoryEvent.create({
      data: {
        contentHash: hashContent(content),
        contentPreview: maskContent(content, 200),
        contentLength: content.length,
        sourceType: sourceType || "unknown",
        sourceId,
        decision: result.decision,
        riskScore: result.riskScore,
        threatType: result.threatType,
        threatName: result.threatName,
        explanation: result.explanation,
        analysisLayers: result.analysisLayers,
        analysisTimeMs: result.analysisTimeMs,
        organizationId: org.id,
        agentId,
      },
    })

    await db.organization.update({ where: { id: org.id }, data: { scansUsed: { increment: 1 } } })
    await db.agent.update({ where: { id: agentId }, data: { totalScans: { increment: 1 }, threatsFound: result.decision !== "ALLOW" ? { increment: 1 } : undefined, lastSeenAt: new Date() } })

    if (result.decision !== "ALLOW" && result.severity) {
      await db.alert.create({ data: { severity: result.severity, title: result.threatName || "Threat Detected", description: result.explanation, organizationId: org.id, memoryEventId: memoryEvent.id } })
    }

    return NextResponse.json({ id: memoryEvent.id, decision: result.decision, riskScore: result.riskScore, threatType: result.threatType, threatName: result.threatName, severity: result.severity, explanation: result.explanation, analysisLayers: result.analysisLayers, analysisTimeMs: result.analysisTimeMs })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
