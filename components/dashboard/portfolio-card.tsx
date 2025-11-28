"use client"

import { TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockPortfolio } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function PortfolioCard() {
  const isPositive = mockPortfolio.dayChange >= 0

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
              ${mockPortfolio.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
                {Math.abs(mockPortfolio.dayChange).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-gray-500">
                ({isPositive ? "+" : ""}
                {mockPortfolio.dayChangePercent.toFixed(2)}%)
              </span>
            </div>
            <span className="text-xs text-gray-500">Today</span>
          </div>

          <div className="pt-2 border-t border-gray-600">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs sm:text-sm">
              <span className="text-gray-500">Total Gain/Loss</span>
              <span className={cn("font-medium", mockPortfolio.totalGain >= 0 ? "text-teal-400" : "text-red-500")}>
                {mockPortfolio.totalGain >= 0 ? "+" : ""}$
                {mockPortfolio.totalGain.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                <span className="text-gray-500 ml-1">
                  ({mockPortfolio.totalGainPercent >= 0 ? "+" : ""}
                  {mockPortfolio.totalGainPercent.toFixed(2)}%)
                </span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
