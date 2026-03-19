"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Key, Plus, Trash2, Copy } from "lucide-react"

interface ApiKey {
  id: string
  name: string
  keyPreview: string
  createdAt: string
  lastUsedAt: string | null
}

const mockApiKeys: ApiKey[] = [
  { id: "1", name: "Production", keyPreview: "mg_live_xxxxx...xxxxx", createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), lastUsedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
  { id: "2", name: "Development", keyPreview: "mg_test_xxxxx...xxxxx", createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), lastUsedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
]

export default function SettingsPage() {
  const [apiKeys] = useState<ApiKey[]>(mockApiKeys)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your API keys and account settings.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage API keys for authenticating with the Memgar API.</CardDescription>
          </div>
          <Button><Plus className="mr-2 h-4 w-4" />Create Key</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-gray-100 p-2"><Key className="h-5 w-5 text-gray-600" /></div>
                  <div>
                    <p className="font-medium">{key.name}</p>
                    <p className="font-mono text-sm text-gray-500">{key.keyPreview}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm text-gray-500">
                    <p>Created {new Date(key.createdAt).toLocaleDateString()}</p>
                    {key.lastUsedAt && <p>Last used {new Date(key.lastUsedAt).toLocaleDateString()}</p>}
                  </div>
                  <Button variant="ghost" size="icon"><Copy className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Manage your subscription and billing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">Free</h3>
                <Badge>Current</Badge>
              </div>
              <p className="mt-1 text-gray-500">1 agent • 1,000 scans/month</p>
            </div>
            <Button>Upgrade to Pro</Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold">Usage This Month</h4>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-sm"><span>Agents</span><span>1 / 1</span></div>
                  <div className="mt-1 h-2 rounded-full bg-gray-200"><div className="h-2 w-full rounded-full bg-blue-600" /></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm"><span>Scans</span><span>523 / 1,000</span></div>
                  <div className="mt-1 h-2 rounded-full bg-gray-200"><div className="h-2 w-1/2 rounded-full bg-blue-600" /></div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="font-semibold">Billing</h4>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>No payment method on file</p>
                <Button variant="outline" size="sm">Add Payment Method</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
