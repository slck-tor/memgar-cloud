export type Decision = "ALLOW" | "BLOCK" | "QUARANTINE"
export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
export type Plan = "FREE" | "PRO" | "ENTERPRISE"
export type AgentMode = "MONITOR" | "PROTECT" | "AUDIT"
export type AgentStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED"
export type AlertStatus = "OPEN" | "ACKNOWLEDGED" | "RESOLVED" | "DISMISSED"

export interface Agent {
  id: string
  name: string
  description?: string
  type: string
  mode: AgentMode
  status: AgentStatus
  totalScans: number
  threatsFound: number
  lastSeenAt?: Date
  createdAt: Date
}

export interface MemoryEvent {
  id: string
  contentPreview?: string
  sourceType: string
  sourceId?: string
  decision: Decision
  riskScore: number
  threatType?: string
  threatName?: string
  explanation?: string
  agentId: string
  createdAt: Date
}

export interface Alert {
  id: string
  severity: Severity
  status: AlertStatus
  title: string
  description?: string
  memoryEventId: string
  createdAt: Date
  resolvedAt?: Date
}

export interface DashboardStats {
  totalAgents: number
  activeAgents: number
  totalScans: number
  scansToday: number
  threatsBlocked: number
  threatsToday: number
  openAlerts: number
  criticalAlerts: number
}

export interface AnalysisRequest {
  content: string
  sourceType?: string
  sourceId?: string
  agentId: string
}

export interface AnalysisResponse {
  decision: Decision
  riskScore: number
  threatType?: string
  threatName?: string
  severity?: Severity
  explanation: string
  analysisLayers: string[]
  analysisTimeMs: number
}
