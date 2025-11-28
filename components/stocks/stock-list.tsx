"use client"

import { StockCard } from "./stock-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { Stock, WatchlistItem } from "@/types"

interface StockListProps {
  stocks: (Stock | WatchlistItem)[]
  view?: "grid" | "table" | "list"
  showWatchlistButton?: boolean
  onToggleWatchlist?: (symbol: string) => void
  columns?: ("symbol" | "price" | "change" | "marketCap" | "volume" | "high52w" | "low52w")[]
}

export function StockList({
  stocks,
  view = "table",
  showWatchlistButton = false,
  onToggleWatchlist,
  columns = ["symbol", "price", "change", "marketCap"],
}: StockListProps) {
  if (view === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            stock={stock}
            variant="large"
            showWatchlistButton={showWatchlistButton}
            onToggleWatchlist={onToggleWatchlist}
          />
        ))}
      </div>
    )
  }

  if (view === "list") {
    return (
      <div className="space-y-3">
        {stocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            stock={stock}
            showWatchlistButton={showWatchlistButton}
            onToggleWatchlist={onToggleWatchlist}
          />
        ))}
      </div>
    )
  }

  // Table view (default)
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-600 hover:bg-transparent">
          {columns.includes("symbol") && <TableHead className="text-gray-500 font-medium">Stock</TableHead>}
          {columns.includes("price") && <TableHead className="text-gray-500 font-medium text-right">Price</TableHead>}
          {columns.includes("change") && <TableHead className="text-gray-500 font-medium text-right">Change</TableHead>}
          {columns.includes("marketCap") && (
            <TableHead className="text-gray-500 font-medium text-right hidden sm:table-cell">Market Cap</TableHead>
          )}
          {columns.includes("volume") && (
            <TableHead className="text-gray-500 font-medium text-right hidden md:table-cell">Volume</TableHead>
          )}
          {columns.includes("high52w") && (
            <TableHead className="text-gray-500 font-medium text-right hidden lg:table-cell">52W High</TableHead>
          )}
          {columns.includes("low52w") && (
            <TableHead className="text-gray-500 font-medium text-right hidden lg:table-cell">52W Low</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {stocks.map((stock) => {
          const isPositive = stock.change >= 0
          return (
            <TableRow key={stock.symbol} className="border-gray-600 hover:bg-gray-700/50 cursor-pointer" asChild>
              <Link href={`/stock/${stock.symbol}`}>
                {columns.includes("symbol") && (
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                        {stock.logo ? (
                          <img src={stock.logo || "/placeholder.svg"} alt={stock.name} className="w-6 h-6 rounded" />
                        ) : (
                          <span className="text-sm font-bold text-gray-400">{stock.symbol.slice(0, 2)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-400">{stock.symbol}</p>
                        <p className="text-sm text-gray-500 hidden sm:block">{stock.name}</p>
                      </div>
                    </div>
                  </TableCell>
                )}
                {columns.includes("price") && (
                  <TableCell className="text-right">
                    <span className="font-medium text-gray-400">${stock.price.toFixed(2)}</span>
                  </TableCell>
                )}
                {columns.includes("change") && (
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "flex items-center justify-end gap-1 font-medium",
                        isPositive ? "text-teal-400" : "text-red-500",
                      )}
                    >
                      {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {isPositive ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%
                    </span>
                  </TableCell>
                )}
                {columns.includes("marketCap") && (
                  <TableCell className="text-right hidden sm:table-cell">
                    <span className="text-gray-500">{stock.marketCap}</span>
                  </TableCell>
                )}
                {columns.includes("volume") && (
                  <TableCell className="text-right hidden md:table-cell">
                    <span className="text-gray-500">{stock.volume}</span>
                  </TableCell>
                )}
                {columns.includes("high52w") && (
                  <TableCell className="text-right hidden lg:table-cell">
                    <span className="text-gray-500">${stock.high52w.toFixed(2)}</span>
                  </TableCell>
                )}
                {columns.includes("low52w") && (
                  <TableCell className="text-right hidden lg:table-cell">
                    <span className="text-gray-500">${stock.low52w.toFixed(2)}</span>
                  </TableCell>
                )}
              </Link>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
