"use client"

import { useState, useEffect, useTransition } from "react"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { SkeletonChart } from "@/components/ui/skeleton-card"
import { fetchStockCandles } from "@/lib/actions/stocks"
import type { Stock, ChartDataPoint } from "@/types"

const timeRanges = ["1D", "1W", "1M", "3M", "1Y"] as const
type TimeRange = (typeof timeRanges)[number]

interface StockChartProps {
  stock?: Stock
  initialChartData?: ChartDataPoint[]
  isLoading?: boolean
}

export function StockChart({ stock, initialChartData, isLoading }: StockChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1M")
  const [chartData, setChartData] = useState<ChartDataPoint[]>(initialChartData || [])
  const [isPending, startTransition] = useTransition()

  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range)
    if (stock) {
      startTransition(async () => {
        const result = await fetchStockCandles(stock.symbol, range)
        if (result.data) {
          setChartData(result.data)
        }
      })
    }
  }

  useEffect(() => {
    if (initialChartData) {
      setChartData(initialChartData)
    }
  }, [initialChartData])

  if (isLoading || !stock) {
    return <SkeletonChart />
  }

  return (
    <Card className="bg-gray-800 border-gray-600">
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-700 flex items-center justify-center flex-shrink-0">
              <span className="text-base sm:text-lg font-bold text-gray-400">{stock.symbol.slice(0, 2)}</span>
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg sm:text-xl text-gray-400 flex items-center gap-2 flex-wrap">
                <span>{stock.symbol}</span>
                <span className="text-xs sm:text-sm font-normal text-gray-500 truncate">{stock.name}</span>
              </CardTitle>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xl sm:text-2xl font-bold text-gray-400">${stock.price.toFixed(2)}</span>
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs sm:text-sm font-medium",
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
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {timeRanges.map((range) => (
              <Button
                key={range}
                variant="ghost"
                size="sm"
                onClick={() => handleRangeChange(range)}
                disabled={isPending}
                className={cn(
                  "h-8 px-3 text-xs font-medium flex-shrink-0",
                  "transition-all duration-200",
                  selectedRange === range
                    ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500 shadow-sm"
                    : "text-gray-500 hover:text-gray-300 hover:bg-gray-600",
                )}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 relative px-2 sm:px-6">
        {isPending && (
          <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center z-10 rounded-lg backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
          </div>
        )}
        <ChartContainer
          config={{
            price: {
              label: "Price",
              color: "#0FEDBE",
            },
          }}
          className="h-[200px] sm:h-[250px] md:h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0FEDBE" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0FEDBE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#30333A" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9095A1", fontSize: 10 }}
                dy={10}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9095A1", fontSize: 10 }}
                dx={-5}
                tickFormatter={(value) => `$${value}`}
                domain={["dataMin - 5", "dataMax + 5"]}
                width={50}
              />
              <ChartTooltip
                content={<ChartTooltipContent className="bg-gray-800 border-gray-600" labelClassName="text-gray-400" />}
              />
              <Area type="monotone" dataKey="price" stroke="#0FEDBE" strokeWidth={2} fill="url(#priceGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
