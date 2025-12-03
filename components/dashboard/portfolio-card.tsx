"use client"

import { TrendingUp, TrendingDown, Wallet, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Portfolio } from "@/types"

interface PortfolioCardProps {
  portfolio?: Portfolio | null
  isLoading?: boolean
}

export function PortfolioCard({ portfolio, isLoading }: PortfolioCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader className="pb-2 px-3 sm:px-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Portfolio Value
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-yellow-400" />
        </CardContent>
      </Card>
    )
  }

  // Default values if no portfolio data
  const totalValue = portfolio?.totalValue ?? 0
  const dayChange = portfolio?.dayChange ?? 0
  const dayChangePercent = portfolio?.dayChangePercent ?? 0
  const totalGain = portfolio?.totalGain ?? 0
  const totalGainPercent = portfolio?.totalGainPercent ?? 0

  const isPositive = dayChange >= 0

  return (
    <Card className="bg-gray-800 border-gray-600 transition-all duration-200 hover:border-gray-500 hover:shadow-lg hover:shadow-black/20">
      <CardHeader className="pb-2 px-3 sm:px-6">
        <CardTitle className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Portfolio Value
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-gray-400">
              ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div
              className={cn(
                "flex items-center gap-1 text-xs sm:text-sm font-medium",
                isPositive ? "text-teal-400" : "text-red-500",
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
              <span>
                {isPositive ? "+" : ""}$
                {Math.abs(dayChange).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-gray-500">
                ({isPositive ? "+" : ""}
                {dayChangePercent.toFixed(2)}%)
              </span>
            </div>
            <span className="text-xs text-gray-500">Today</span>
          </div>

          <div className="pt-2 border-t border-gray-600">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs sm:text-sm">
              <span className="text-gray-500">Total Gain/Loss</span>
              <span className={cn("font-medium", totalGain >= 0 ? "text-teal-400" : "text-red-500")}>
                {totalGain >= 0 ? "+" : ""}$
                {Math.abs(totalGain).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-gray-500 ml-1">
                  ({totalGainPercent >= 0 ? "+" : ""}
                  {totalGainPercent.toFixed(2)}%)
                </span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
