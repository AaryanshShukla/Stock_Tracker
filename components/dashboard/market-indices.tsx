"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SkeletonMarketCard } from "@/components/ui/skeleton-card"
import type { MarketIndex } from "@/types"

interface MarketIndicesProps {
  indices?: MarketIndex[]
  isLoading?: boolean
}

export function MarketIndices({ indices, isLoading }: MarketIndicesProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[1, 2, 3].map((i) => (
          <SkeletonMarketCard key={i} />
        ))}
      </div>
    )
  }

  const displayIndices = indices || []

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {displayIndices.map((index) => {
        const isPositive = index.change >= 0
        return (
          <Card
            key={index.symbol}
            className={cn(
              "bg-gray-800 border-gray-600",
              "transition-all duration-200 ease-out",
              "hover:border-gray-500 hover:shadow-lg hover:shadow-black/20",
              "hover:-translate-y-0.5",
              "cursor-pointer",
            )}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-500 truncate pr-2">{index.name}</span>
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded flex-shrink-0",
                    "transition-colors duration-200",
                    isPositive ? "bg-teal-400/10 text-teal-400" : "bg-red-500/10 text-red-500",
                  )}
                >
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {isPositive ? "+" : ""}
                  {index.changePercent.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-bold text-gray-400">
                  {index.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className={cn("text-xs sm:text-sm mt-1", isPositive ? "text-teal-400" : "text-red-500")}>
                {isPositive ? "+" : ""}
                {index.change.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
