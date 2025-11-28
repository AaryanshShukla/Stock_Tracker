"use client"

import { AlertCircle, Database, Wifi } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DataStatusBannerProps {
  isUsingMockData: boolean
  error?: string | null
}

export function DataStatusBanner({ isUsingMockData, error }: DataStatusBannerProps) {
  if (!isUsingMockData && !error) return null

  if (error) {
    return (
      <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-red-400">{error} — Showing cached data instead.</AlertDescription>
      </Alert>
    )
  }

  if (isUsingMockData) {
    return (
      <Alert className="bg-yellow-500/10 border-yellow-500/20 mb-4">
        <Database className="h-4 w-4 text-yellow-400" />
        <AlertDescription className="text-yellow-400">
          Using demo data. Add <code className="bg-gray-800 px-1 rounded text-xs">FINNHUB_API_KEY</code> to enable live
          market data.
        </AlertDescription>
      </Alert>
    )
  }

  return null
}

export function LiveDataBadge() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-teal-400">
      <Wifi className="h-3 w-3" />
      <span>Live</span>
    </div>
  )
}
