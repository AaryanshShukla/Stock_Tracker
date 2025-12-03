"use client"

import { TrendingUp, TrendingDown, Flame, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import type { Stock } from "@/types"

interface TopMoversProps {
  stocks?: Stock[]
}

export function TopMovers({ stocks = [] }: TopMoversProps) {
  const router = useRouter()

  const gainers = [...stocks]
    .filter((s) => s.change > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 3)

  const losers = [...stocks]
    .filter((s) => s.change < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 3)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Top Gainers */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-gray-400 flex items-center gap-2">
            <Flame className="h-5 w-5 text-teal-400" />
            Top Gainers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {gainers.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">No gainers today</p>
          ) : (
            gainers.map((stock, index) => (
              <div
                key={stock.symbol}
                onClick={() => router.push(`/stock/${stock.symbol}`)}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-4">{index + 1}</span>
                  <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-400">{stock.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-400">{stock.symbol}</p>
                    <p className="text-sm text-gray-500">${stock.price.toFixed(2)}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 font-medium text-teal-400 bg-teal-400/10 px-2 py-1 rounded">
                  <TrendingUp className="h-4 w-4" />+{stock.changePercent.toFixed(2)}%
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Top Losers */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-gray-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Top Losers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {losers.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">No losers today</p>
          ) : (
            losers.map((stock, index) => (
              <div
                key={stock.symbol}
                onClick={() => router.push(`/stock/${stock.symbol}`)}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-4">{index + 1}</span>
                  <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-400">{stock.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-400">{stock.symbol}</p>
                    <p className="text-sm text-gray-500">${stock.price.toFixed(2)}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded">
                  <TrendingDown className="h-4 w-4" />
                  {stock.changePercent.toFixed(2)}%
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
