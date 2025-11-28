"use client"

import { useState, useEffect, useTransition } from "react"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { fetchStockCandles } from "@/lib/actions/stocks"
import type { Stock, ChartDataPoint } from "@/types"

const timeRanges = ["1D", "1W", "1M", "3M", "1Y"] as const
type TimeRange = (typeof timeRanges)[number]

interface StockDetailChartProps {
  stock: Stock
  initialChartData: ChartDataPoint[]
}

export function StockDetailChart({ stock, initialChartData }: StockDetailChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1M")
  const [chartData, setChartData] = useState<ChartDataPoint[]>(initialChartData)
  const [isPending, startTransition] = useTransition()

  // Update chart data when initialChartData changes
  useEffect(() => {
    if (initialChartData) {
      setChartData(initialChartData)
    }
  }, [initialChartData])

  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range)
    startTransition(async () => {
      const result = await fetchStockCandles(stock.symbol, range)
      if (result.data) {
        setChartData(result.data)
      }
    })
  }

  // Calculate chart color based on price change
  const isPositive = stock.change >= 0
  const chartColor = isPositive ? "#0FEDBE" : "#FF495B"

  return (
    <Card className="bg-gray-800 border-gray-600">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-400">Price Chart</h3>

          {/* Time Range Toggle */}
          <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
            {timeRanges.map((range) => (
              <Button
                key={range}
                variant="ghost"
                size="sm"
                onClick={() => handleRangeChange(range)}
                disabled={isPending}
                className={cn(
                  "h-8 px-4 text-xs font-medium transition-all",
                  selectedRange === range
                    ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                    : "text-gray-500 hover:text-gray-400 hover:bg-gray-600",
                )}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 relative">
        {isPending && (
          <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
          </div>
        )}
        <ChartContainer
          config={{
            price: {
              label: "Price",
              color: chartColor,
            },
          }}
          className="h-[350px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`priceGradient-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#30333A" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9095A1", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9095A1", fontSize: 12 }}
                dx={-10}
                tickFormatter={(value) => `$${value}`}
                domain={["dataMin - 5", "dataMax + 5"]}
              />
              <ChartTooltip
                content={<ChartTooltipContent className="bg-gray-800 border-gray-600" labelClassName="text-gray-400" />}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                fill={`url(#priceGradient-${stock.symbol})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
