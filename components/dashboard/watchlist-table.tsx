"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { StarIcon } from "@/components/icons/star-icon"
import { SkeletonStockTable } from "@/components/ui/skeleton-card"
import type { Stock } from "@/types"
import Link from "next/link"

interface WatchlistTableProps {
  stocks?: Stock[]
  isLoading?: boolean
}

export function WatchlistTable({ stocks, isLoading }: WatchlistTableProps) {
  const router = useRouter()

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader className="pb-2 px-3 sm:px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg text-gray-400 flex items-center gap-2">
              <StarIcon className="h-5 w-5" filled />
              Watchlist
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <SkeletonStockTable rows={5} />
        </CardContent>
      </Card>
    )
  }

  const watchlistStocks = stocks || []

  return (
    <Card className="bg-gray-800 border-gray-600">
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg text-gray-400 flex items-center gap-2">
            <StarIcon className="h-5 w-5" filled />
            Watchlist
          </CardTitle>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-yellow-400 hover:text-yellow-500 hover:bg-yellow-400/10 transition-all duration-200"
          >
            <Link href="/watchlist">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {watchlistStocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <StarIcon className="h-12 w-12 text-gray-600 mb-3" />
            <p className="text-gray-500">No stocks in your watchlist</p>
            <p className="text-sm text-gray-600">Add stocks to track them here</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-600 hover:bg-transparent">
                  <TableHead className="text-gray-500 font-medium text-xs sm:text-sm">Stock</TableHead>
                  <TableHead className="text-gray-500 font-medium text-right text-xs sm:text-sm">Price</TableHead>
                  <TableHead className="text-gray-500 font-medium text-right text-xs sm:text-sm">Change</TableHead>
                  <TableHead className="text-gray-500 font-medium text-right hidden sm:table-cell text-xs sm:text-sm">
                    Market Cap
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {watchlistStocks.map((stock) => (
                  <TableRow
                    key={stock.symbol}
                    className={cn(
                      "border-gray-600 cursor-pointer",
                      "transition-colors duration-150",
                      "hover:bg-gray-700/50 active:bg-gray-700",
                    )}
                    onClick={() => router.push(`/stock/${stock.symbol}`)}
                  >
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs sm:text-sm font-bold text-gray-400">{stock.symbol.slice(0, 2)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-400 text-sm">{stock.symbol}</p>
                          <p className="text-xs text-gray-500 hidden sm:block truncate max-w-[120px]">{stock.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-3">
                      <span className="font-medium text-gray-400 text-sm">${stock.price.toFixed(2)}</span>
                    </TableCell>
                    <TableCell className="text-right py-3">
                      <span
                        className={cn(
                          "flex items-center justify-end gap-1 font-medium text-xs sm:text-sm",
                          stock.change >= 0 ? "text-teal-400" : "text-red-500",
                        )}
                      >
                        {stock.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                        {stock.change >= 0 ? "+" : ""}
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell py-3">
                      <span className="text-gray-500 text-sm">{stock.marketCap}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
