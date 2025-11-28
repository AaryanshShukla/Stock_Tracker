"use client"

import { TrendingUp, TrendingDown, Star, Bell, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { Stock, WatchlistItem } from "@/types"

interface StockDetailHeaderProps {
  stock: Stock | WatchlistItem
  backHref?: string
  backLabel?: string
  onAddToWatchlist?: () => void
  onSetAlert?: () => void
  alertCount?: number // Added alertCount prop
}

export function StockDetailHeader({
  stock,
  backHref = "/dashboard",
  backLabel = "Back to Dashboard",
  onAddToWatchlist,
  onSetAlert,
  alertCount = 0,
}: StockDetailHeaderProps) {
  const isPositive = stock.change >= 0
  const isInWatchlist = "isInWatchlist" in stock ? stock.isInWatchlist : false

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      {/* Stock Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-gray-800 border border-gray-600 flex items-center justify-center">
            {stock.logo ? (
              <img src={stock.logo || "/placeholder.svg"} alt={stock.name} className="w-10 h-10 rounded" />
            ) : (
              <span className="text-2xl font-bold text-gray-400">{stock.symbol.slice(0, 2)}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-400">{stock.symbol}</h1>
              {stock.exchange && (
                <Badge variant="outline" className="border-gray-600 text-gray-500">
                  {stock.exchange}
                </Badge>
              )}
            </div>
            <p className="text-gray-500 text-lg">{stock.name}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-3xl font-bold text-gray-400">${stock.price.toFixed(2)}</span>
              <span
                className={cn(
                  "flex items-center gap-1 text-lg font-medium px-3 py-1 rounded-lg",
                  isPositive ? "bg-teal-400/10 text-teal-400" : "bg-red-500/10 text-red-500",
                )}
              >
                {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                {isPositive ? "+" : ""}${Math.abs(stock.change).toFixed(2)} ({isPositive ? "+" : ""}
                {stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onSetAlert && (
            <Button
              variant="outline"
              className="border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-400 bg-transparent relative"
              onClick={onSetAlert}
            >
              <Bell className="h-4 w-4 mr-2" />
              Set Alert
              {alertCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-yellow-400 text-gray-900 text-xs flex items-center justify-center font-medium">
                  {alertCount}
                </span>
              )}
            </Button>
          )}
          {onAddToWatchlist && (
            <Button
              className={cn(
                "px-6",
                isInWatchlist
                  ? "bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30"
                  : "bg-yellow-400 hover:bg-yellow-500 text-gray-900",
              )}
              onClick={onAddToWatchlist}
            >
              <Star className={cn("h-4 w-4 mr-2", isInWatchlist && "fill-current")} />
              {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
