import { AppShell } from "@/components/layout/app-shell"
import { TrendingUp, TrendingDown, Bell, Trash2, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MOCK_STOCKS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { StarIcon } from "@/components/icons/star-icon"
import Link from "next/link"

export default function WatchlistPage() {
  // Filter stocks that are in watchlist (using first 6 for demo)
  const watchlistStocks = MOCK_STOCKS.slice(0, 6)

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-400 flex items-center gap-3">
            <StarIcon className="h-8 w-8" filled />
            Watchlist
          </h1>
          <p className="text-gray-500 mt-1">Track your favorite stocks and set price alerts.</p>
        </div>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-6">
          <Plus className="h-4 w-4 mr-2" />
          Add Stock
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Watchlist Table */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-400">Your Stocks ({watchlistStocks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-600 hover:bg-transparent">
                    <TableHead className="text-gray-500 font-medium">Stock</TableHead>
                    <TableHead className="text-gray-500 font-medium text-right">Price</TableHead>
                    <TableHead className="text-gray-500 font-medium text-right">Change</TableHead>
                    <TableHead className="text-gray-500 font-medium text-right hidden md:table-cell">
                      Market Cap
                    </TableHead>
                    <TableHead className="text-gray-500 font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {watchlistStocks.map((stock) => (
                    <TableRow key={stock.symbol} className="border-gray-600 hover:bg-gray-700/50">
                      <TableCell>
                        <Link href={`/stock/${stock.symbol}`} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                            <span className="text-sm font-bold text-gray-400">{stock.symbol.slice(0, 2)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-400">{stock.symbol}</p>
                            <p className="text-sm text-gray-500 hidden sm:block">{stock.name}</p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium text-gray-400">${stock.price.toFixed(2)}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={cn(
                            "flex items-center justify-end gap-1 font-medium",
                            stock.change >= 0 ? "text-teal-400" : "text-red-500",
                          )}
                        >
                          {stock.change >= 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          {stock.change >= 0 ? "+" : ""}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">
                        <span className="text-gray-500">{stock.marketCap}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10"
                          >
                            <Bell className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Price Alerts Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-400 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-yellow-400" />
                  Price Alerts
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-400 bg-transparent"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Sample Alerts */}
              <div className="p-3 rounded-lg bg-gray-700 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-yellow-400">AAPL</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-red-500">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">Apple Inc.</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-600">
                  <span className="text-sm text-gray-500">Target Price</span>
                  <span className="font-medium text-gray-400">$185.00</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-700 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-yellow-400">NVDA</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-red-500">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">NVIDIA Corporation</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-600">
                  <span className="text-sm text-gray-500">Target Price</span>
                  <span className="font-medium text-gray-400">$520.00</span>
                </div>
              </div>

              {/* Empty State */}
              <div className="py-4 text-center text-gray-500 text-sm">
                Set alerts to get notified when stocks reach your target price.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
