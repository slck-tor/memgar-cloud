"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Bot, MoreVertical, Shield, ShieldAlert, Eye } from "lucide-react"

interface Agent {
  id: string
  name: string
  description: string
  type: string
  mode: "MONITOR" | "PROTECT" | "AUDIT"
  status: "ACTIVE" | "INACTIVE"
  totalScans: number
  threatsFound: number
  lastSeenAt: string
}

const mockAgents: Agent[] = [
  { id: "1", name: "finance-assistant", description: "Handles financial queries and invoice processing", type: "CLAUDE", mode: "PROTECT", status: "ACTIVE", totalScans: 12453, threatsFound: 23, lastSeenAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
  { id: "2", name: "customer-support-bot", description: "Customer service and ticket handling", type: "LANGCHAIN", mode: "MONITOR", status: "ACTIVE", totalScans: 8921, threatsFound: 12, lastSeenAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
  { id: "3", name: "sales-agent", description: "Lead qualification and outreach", type: "GPT", mode: "AUDIT", status: "INACTIVE", totalScans: 3421, threatsFound: 5, lastSeenAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
]

const modeConfig = {
  PROTECT: { icon: Shield, color: "text-green-600", bg: "bg-green-50" },
  MONITOR: { icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
  AUDIT: { icon: ShieldAlert, color: "text-yellow-600", bg: "bg-yellow-50" },
}

export default function AgentsPage() {
  const [agents] = useState<Agent[]>(mockAgents)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
          <p className="text-gray-500">Manage your AI agents and their security settings.</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Add Agent</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => {
          const mode = modeConfig[agent.mode]
          const ModeIcon = mode.icon

          return (
            <Card key={agent.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-2"><Bot className="h-6 w-6 text-gray-600" /></div>
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <p className="text-sm text-gray-500">{agent.type}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-gray-600">{agent.description}</p>

                <div className="flex items-center gap-2 mb-4">
                  <div className={`flex items-center gap-1 rounded-full px-2 py-1 ${mode.bg}`}>
                    <ModeIcon className={`h-3 w-3 ${mode.color}`} />
                    <span className={`text-xs font-medium ${mode.color}`}>{agent.mode}</span>
                  </div>
                  <Badge variant={agent.status === "ACTIVE" ? "success" : "secondary"}>{agent.status}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <p className="text-2xl font-bold">{agent.totalScans.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Scans</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{agent.threatsFound}</p>
                    <p className="text-xs text-gray-500">Threats Found</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
    }
