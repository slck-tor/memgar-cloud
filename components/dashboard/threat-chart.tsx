"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ThreatChartProps {
  data: Array<{ date: string; blocked: number; quarantined: number; allowed: number }>
}

export function ThreatChart({ data }: ThreatChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Threat Activity (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
              <Area type="monotone" dataKey="blocked" stackId="1" stroke="#ef4444" fill="#fecaca" name="Blocked" />
              <Area type="monotone" dataKey="quarantined" stackId="1" stroke="#f59e0b" fill="#fde68a" name="Quarantined" />
              <Area type="monotone" dataKey="allowed" stackId="1" stroke="#22c55e" fill="#bbf7d0" name="Allowed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <span className="text-sm text-gray-600">Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="text-sm text-gray-600">Quarantined</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-400" />
            <span className="text-sm text-gray-600">Allowed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
