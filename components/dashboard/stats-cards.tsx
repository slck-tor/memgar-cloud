"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Shield, ShieldAlert, Bell } from "lucide-react"
import type { DashboardStats } from "@/types"

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { title: "Active Agents", value: stats.activeAgents, subtitle: `${stats.totalAgents} total`, icon: Bot, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Scans Today", value: stats.scansToday.toLocaleString(), subtitle: `${stats.totalScans.toLocaleString()} total`, icon: Shield, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Threats Blocked", value: stats.threatsBlocked, subtitle: `${stats.threatsToday} today`, icon: ShieldAlert, color: "text-red-600", bgColor: "bg-red-50" },
    { title: "Open Alerts", value: stats.openAlerts, subtitle: `${stats.criticalAlerts} critical`, icon: Bell, color: "text-orange-600", bgColor: "bg-orange-50" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{card.title}</CardTitle>
            <div className={`rounded-lg p-2 ${card.bgColor}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{card.value}</div>
            <p className="text-sm text-gray-500">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
