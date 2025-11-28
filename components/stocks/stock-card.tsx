"use client"

import { TrendingUp, TrendingDown, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { Stock, WatchlistItem } from "@/types"

interface StockCardProps {
  stock: Stock | WatchlistItem
  showWatchlistButton?: boolean
  onToggleWatchlist?: (symbol: string) => void
  variant?: "default" | "compact" | "large"
}

export function StockCard({
  stock,
  showWatchlistButton = false,
  onToggleWatchlist,
  variant = "default",
}: StockCardProps) {
  const isPositive = stock.change >= 0
  const isInWatchlist = "isInWatchlist" in stock ? stock.isInWatchlist : false

  if (variant === "compact") {
    return (
      <Link href={`/stock/${stock.symbol}`}>
        <Card
          className={cn(
            "bg-gray-800 border-gray-600 cursor-pointer",
            "transition-all duration-200 ease-out",
            "hover:border-gray-500 hover:shadow-md hover:shadow-black/20",
            "hover:-translate-y-0.5 active:translate-y-0",
          )}
        >
          <CardContent className="p-2.5 sm:p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] sm:text-xs font-bold text-gray-400">{stock.symbol.slice(0, 2)}</span>
                </div>
                <span className="font-medium text-gray-400 text-xs sm:text-sm truncate">{stock.symbol}</span>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-medium text-gray-400 text-xs sm:text-sm">${stock.price.toFixed(2)}</p>
                <p className={cn("text-[10px] sm:text-xs", isPositive ? "text-teal-400" : "text-red-500")}>
                  {isPositive ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  if (variant === "large") {
    return (
      <Link href={`/stock/${stock.symbol}`}>
        <Card
          className={cn(
            "bg-gray-800 border-gray-600 cursor-pointer h-full",
            "transition-all duration-200 ease-out",
            "hover:border-gray-500 hover:shadow-lg hover:shadow-black/20",
            "hover:-translate-y-1 active:translate-y-0",
          )}
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-700 flex items-center justify-center">
                {stock.logo ? (
                  <img
                    src={stock.logo || "/placeholder.svg"}
                    alt={stock.name}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded"
                  />
                ) : (
                  <span className="text-base sm:text-lg font-bold text-gray-400">{stock.symbol.slice(0, 2)}</span>
                )}
              </div>
              {showWatchlistButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7 sm:h-8 sm:w-8 transition-all duration-200",
                    isInWatchlist
                      ? "text-yellow-400 hover:text-yellow-500 hover:scale-110"
                      : "text-gray-500 hover:text-gray-400 hover:scale-110",
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    onToggleWatchlist?.(stock.symbol)
                  }}
                >
                  <Star className={cn("h-4 w-4", isInWatchlist && "fill-current")} />
                </Button>
              )}
            </div>
            <h3 className="font-semibold text-gray-400 mb-1 text-sm sm:text-base truncate">{stock.name}</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">{stock.symbol}</p>
            <div className="flex items-end justify-between gap-2">
              <span className="text-xl sm:text-2xl font-bold text-gray-400">${stock.price.toFixed(2)}</span>
              <span
                className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded",
                  "transition-colors duration-200",
                  isPositive ? "bg-teal-400/10 text-teal-400" : "bg-red-500/10 text-red-500",
                )}
              >
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {isPositive ? "+" : ""}
                {stock.changePercent.toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  // Default variant
  return (
    <Link href={`/stock/${stock.symbol}`}>
      <Card
        className={cn(
          "bg-gray-800 border-gray-600 cursor-pointer",
          "transition-all duration-200 ease-out",
          "hover:border-gray-500 hover:shadow-md hover:shadow-black/20",
          "hover:-translate-y-0.5 active:translate-y-0",
        )}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                {stock.logo ? (
                  <img
                    src={stock.logo || "/placeholder.svg"}
                    alt={stock.name}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded"
                  />
                ) : (
                  <span className="text-xs sm:text-sm font-bold text-gray-400">{stock.symbol.slice(0, 2)}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-400 text-sm">{stock.symbol}</p>
                <p className="text-xs text-gray-500 truncate">{stock.name}</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-medium text-gray-400 text-sm">${stock.price.toFixed(2)}</p>
              <p
                className={cn(
                  "flex items-center justify-end gap-1 text-xs",
                  isPositive ? "text-teal-400" : "text-red-500",
                )}
              >
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {isPositive ? "+" : ""}
                {stock.changePercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
