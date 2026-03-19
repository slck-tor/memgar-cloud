"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Bot, ShieldAlert, Bell, Settings, Key, CreditCard, FileText, Shield } from "lucide-react"

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Agents", href: "/agents", icon: Bot },
  { name: "Threats", href: "/threats", icon: ShieldAlert },
  { name: "Alerts", href: "/alerts", icon: Bell },
]

const settings = [
  { name: "API Keys", href: "/settings/api-keys", icon: Key },
  { name: "Webhooks", href: "/settings/webhooks", icon: FileText },
  { name: "Billing", href: "/settings/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center gap-2 px-6">
        <Shield className="h-8 w-8 text-blue-500" />
        <span className="text-xl font-bold text-white">Memgar</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", isActive ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white")}>
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="pt-6">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Settings</p>
          <div className="mt-2 space-y-1">
            {settings.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", isActive ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white")}>
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <div className="border-t border-gray-800 p-4">
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-3">
          <p className="text-xs font-medium text-blue-100">Current Plan</p>
          <p className="text-lg font-bold text-white">Free</p>
          <Link href="/settings/billing" className="mt-2 inline-block text-xs text-blue-200 hover:text-white">Upgrade to Pro →</Link>
        </div>
      </div>
    </div>
  )
}
