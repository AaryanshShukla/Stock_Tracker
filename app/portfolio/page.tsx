"use client"

import { useEffect, useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { usePortfolio } from "@/hooks/use-portfolio"
import { useRealtimeStocks } from "@/hooks/use-realtime-stocks"
import { TrendingUp, TrendingDown, Plus, Trash2, Wallet, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Portfolio } from "@/types"

const AVAILABLE_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc" },
  { symbol: "MSFT", name: "Microsoft Corp" },
  { symbol: "GOOGL", name: "Alphabet Inc" },
  { symbol: "AMZN", name: "Amazon.com Inc" },
  { symbol: "TSLA", name: "Tesla Inc" },
  { symbol: "META", name: "Meta Platforms Inc" },
  { symbol: "NVDA", name: "NVIDIA Corp" },
  { symbol: "NFLX", name: "Netflix Inc" },
  { symbol: "ORCL", name: "Oracle Corp" },
  { symbol: "CRM", name: "Salesforce Inc" },
]

export default function PortfolioPage() {
  const { holdings, addHolding, removeHolding, calculatePortfolio, isLoaded } = usePortfolio()
  const { stocks, isLoading, refresh, lastUpdated } = useRealtimeStocks({ refreshInterval: 30000 })
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Form state
  const [selectedSymbol, setSelectedSymbol] = useState("")
  const [shares, setShares] = useState("")
  const [avgCost, setAvgCost] = useState("")

  // Calculate portfolio when stocks or holdings change
  useEffect(() => {
    if (stocks.length > 0 && holdings.length > 0) {
      const stockPrices: Record<string, { price: number; change: number; changePercent: number }> = {}
      stocks.forEach((stock) => {
        stockPrices[stock.symbol] = {
          price: stock.price,
          change: stock.change,
          changePercent: stock.changePercent,
        }
      })
      setPortfolio(calculatePortfolio(stockPrices))
    } else if (holdings.length === 0) {
      setPortfolio({
        totalValue: 0,
        dayChange: 0,
        dayChangePercent: 0,
        totalGain: 0,
        totalGainPercent: 0,
        holdings: [],
      })
    }
  }, [stocks, holdings, calculatePortfolio])

  const handleAddHolding = () => {
    if (!selectedSymbol || !shares || !avgCost) return

    const stockInfo = AVAILABLE_STOCKS.find((s) => s.symbol === selectedSymbol)
    if (!stockInfo) return

    addHolding({
      symbol: selectedSymbol,
      name: stockInfo.name,
      shares: Number.parseFloat(shares),
      avgCost: Number.parseFloat(avgCost),
    })

    // Reset form
    setSelectedSymbol("")
    setShares("")
    setAvgCost("")
    setIsDialogOpen(false)
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-400">Portfolio</h1>
            <p className="text-gray-500 mt-1">
              Track your holdings with real-time prices
              {lastUpdated && (
                <span className="ml-2 text-xs text-gray-600">Updated: {lastUpdated.toLocaleTimeString()}</span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={isLoading}
              className="border-gray-600 text-gray-400 hover:bg-gray-700 bg-transparent"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Holding
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-600">
                <DialogHeader>
                  <DialogTitle className="text-gray-400">Add New Holding</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400">Stock</Label>
                    <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-400">
                        <SelectValue placeholder="Select a stock" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {AVAILABLE_STOCKS.map((stock) => (
                          <SelectItem key={stock.symbol} value={stock.symbol} className="text-gray-400">
                            {stock.symbol} - {stock.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Number of Shares</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={shares}
                      onChange={(e) => setShares(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Average Cost per Share ($)</Label>
                    <Input
                      type="number"
                      placeholder="150.00"
                      value={avgCost}
                      onChange={(e) => setAvgCost(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-gray-400"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="border-gray-600 text-gray-400 bg-transparent">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleAddHolding}
                    disabled={!selectedSymbol || !shares || !avgCost}
                    className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                  >
                    Add Holding
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Portfolio Summary */}
        {portfolio && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-400">
                  $
                  {portfolio.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Today&apos;s Change</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={cn("text-2xl font-bold", portfolio.dayChange >= 0 ? "text-teal-400" : "text-red-500")}>
                  {portfolio.dayChange >= 0 ? "+" : ""}$
                  {Math.abs(portfolio.dayChange).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className={cn("text-sm", portfolio.dayChange >= 0 ? "text-teal-400" : "text-red-500")}>
                  ({portfolio.dayChange >= 0 ? "+" : ""}
                  {portfolio.dayChangePercent.toFixed(2)}%)
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Gain/Loss</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={cn("text-2xl font-bold", portfolio.totalGain >= 0 ? "text-teal-400" : "text-red-500")}>
                  {portfolio.totalGain >= 0 ? "+" : ""}$
                  {Math.abs(portfolio.totalGain).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className={cn("text-sm", portfolio.totalGain >= 0 ? "text-teal-400" : "text-red-500")}>
                  ({portfolio.totalGain >= 0 ? "+" : ""}
                  {portfolio.totalGainPercent.toFixed(2)}%)
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-400">{holdings.length}</p>
                <p className="text-sm text-gray-500">Stocks</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Holdings Table */}
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-gray-400">Your Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            {!isLoaded ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-yellow-400" />
              </div>
            ) : holdings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No holdings yet. Add your first stock to get started!</p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Holding
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-600 hover:bg-transparent">
                      <TableHead className="text-gray-500">Symbol</TableHead>
                      <TableHead className="text-gray-500">Shares</TableHead>
                      <TableHead className="text-gray-500">Avg Cost</TableHead>
                      <TableHead className="text-gray-500">Current Price</TableHead>
                      <TableHead className="text-gray-500">Value</TableHead>
                      <TableHead className="text-gray-500">Gain/Loss</TableHead>
                      <TableHead className="text-gray-500 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolio?.holdings?.map((holding) => (
                      <TableRow key={holding.symbol} className="border-gray-600 hover:bg-gray-700/50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-400">{holding.symbol}</p>
                            <p className="text-xs text-gray-500">{holding.name}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400">{holding.shares}</TableCell>
                        <TableCell className="text-gray-400">${holding.avgCost.toFixed(2)}</TableCell>
                        <TableCell className="text-gray-400">${(holding.currentPrice || 0).toFixed(2)}</TableCell>
                        <TableCell className="text-gray-400">
                          $
                          {(holding.currentValue || 0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>
                          <div
                            className={cn(
                              "flex items-center gap-1",
                              (holding.gainLoss || 0) >= 0 ? "text-teal-400" : "text-red-500",
                            )}
                          >
                            {(holding.gainLoss || 0) >= 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            <span>
                              {(holding.gainLoss || 0) >= 0 ? "+" : ""}${Math.abs(holding.gainLoss || 0).toFixed(2)}
                            </span>
                            <span className="text-xs">
                              ({(holding.gainLoss || 0) >= 0 ? "+" : ""}
                              {(holding.gainLossPercent || 0).toFixed(2)}%)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeHolding(holding.symbol)}
                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
