"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { timeAgo } from "@/lib/utils"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

interface Alert {
  id: string
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  status: "OPEN" | "ACKNOWLEDGED" | "RESOLVED"
  title: string
  agentName: string
  threatType: string
  createdAt: string
}

interface RecentAlertsProps {
  alerts: Alert[]
}

const severityConfig = {
  CRITICAL: { color: "danger", icon: AlertCircle },
  HIGH: { color: "warning", icon: AlertCircle },
  MEDIUM: { color: "secondary", icon: Clock },
  LOW: { color: "outline", icon: CheckCircle },
} as const

export function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Alerts</CardTitle>
        <Link href="/alerts">
          <Button variant="outline" size="sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <p className="mt-2 text-lg font-medium">All Clear</p>
            <p className="text-sm text-gray-500">No active alerts</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const config = severityConfig[alert.severity]
              const Icon = config.icon

              return (
                <div key={alert.id} className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50">
                  <div className={`rounded-full p-2 ${alert.severity === "CRITICAL" ? "bg-red-100" : alert.severity === "HIGH" ? "bg-orange-100" : alert.severity === "MEDIUM" ? "bg-yellow-100" : "bg-gray-100"}`}>
                    <Icon className={`h-5 w-5 ${alert.severity === "CRITICAL" ? "text-red-600" : alert.severity === "HIGH" ? "text-orange-600" : alert.severity === "MEDIUM" ? "text-yellow-600" : "text-gray-600"}`} />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={config.color as any}>{alert.severity}</Badge>
                      <span className="text-sm text-gray-500">{timeAgo(alert.createdAt)}</span>
                    </div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-gray-500">Agent: {alert.agentName} • Type: {alert.threatType}</p>
                  </div>

                  <Link href={`/alerts/${alert.id}`}>
                    <Button variant="ghost" size="sm">View</Button>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
                  }
