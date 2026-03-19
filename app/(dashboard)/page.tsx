import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import { ThreatChart } from "@/components/dashboard/threat-chart"
import type { DashboardStats } from "@/types"

const mockStats: DashboardStats = {
  totalAgents: 5,
  activeAgents: 3,
  totalScans: 45231,
  scansToday: 1523,
  threatsBlocked: 47,
  threatsToday: 3,
  openAlerts: 3,
  criticalAlerts: 1,
}

const mockAlerts = [
  { id: "1", severity: "CRITICAL" as const, status: "OPEN" as const, title: "Financial Directive Injection Detected", agentName: "finance-assistant", threatType: "FIN-001", createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
  { id: "2", severity: "HIGH" as const, status: "OPEN" as const, title: "Data Exfiltration Attempt", agentName: "customer-support-bot", threatType: "EXFIL-001", createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
  { id: "3", severity: "MEDIUM" as const, status: "ACKNOWLEDGED" as const, title: "Suspicious Pattern Detected", agentName: "sales-agent", threatType: "MANIP-001", createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
]

const mockChartData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    blocked: Math.floor(Math.random() * 5),
    quarantined: Math.floor(Math.random() * 8),
    allowed: Math.floor(Math.random() * 100) + 50,
  }
})

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-500">Monitor your AI agents and protect against memory poisoning attacks.</p>
      </div>

      <StatsCards stats={mockStats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ThreatChart data={mockChartData} />
        <RecentAlerts alerts={mockAlerts} />
      </div>
    </div>
  )
}
