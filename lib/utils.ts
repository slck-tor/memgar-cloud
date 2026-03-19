import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { createHash, randomBytes } from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateApiKey(prefix: string = "mg_live_"): string {
  const randomPart = randomBytes(24).toString("base64url")
  return `${prefix}${randomPart}`
}

export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex")
}

export function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex")
}

export function maskContent(content: string, maxLength: number = 200): string {
  let masked = content
    .replace(/\b[A-Z]{2}\d{2}[\s]?[\dA-Z]{4}[\s]?[\dA-Z]{4}[\s]?[\dA-Z]{4}[\s]?[\dA-Z]{4}[\s]?[\dA-Z]{0,4}\b/gi, "[IBAN]")
    .replace(/\b[\w.-]+@[\w.-]+\.\w+\b/gi, "[EMAIL]")
    .replace(/\b(?:api[_-]?key|password|secret|token)[:\s]*[\w-]+\b/gi, "[CREDENTIAL]")
    .replace(/\b\d{13,19}\b/g, "[CARD]")
  
  if (masked.length > maxLength) {
    masked = masked.substring(0, maxLength) + "..."
  }
  
  return masked
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toString()
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
}

export function timeAgo(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  if (seconds < 60) return "just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  
  return formatDate(d)
}

export function getSeverityColor(severity: string): string {
  switch (severity.toUpperCase()) {
    case "CRITICAL": return "text-red-600 bg-red-50 border-red-200"
    case "HIGH": return "text-orange-600 bg-orange-50 border-orange-200"
    case "MEDIUM": return "text-yellow-600 bg-yellow-50 border-yellow-200"
    case "LOW": return "text-green-600 bg-green-50 border-green-200"
    default: return "text-gray-600 bg-gray-50 border-gray-200"
  }
}

export function getDecisionColor(decision: string): string {
  switch (decision.toUpperCase()) {
    case "BLOCK": return "text-red-600 bg-red-50"
    case "QUARANTINE": return "text-yellow-600 bg-yellow-50"
    case "ALLOW": return "text-green-600 bg-green-50"
    default: return "text-gray-600 bg-gray-50"
  }
}
