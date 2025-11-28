"use client"

import { useState } from "react"
import { Building2, Users, DollarSign, BarChart3, TrendingUp, TrendingDown, Activity, PieChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StockDetailHeader } from "./stock-detail-header"
import { MetricCard } from "./metric-card"
import { StockDetailChart } from "./stock-detail-chart"
import { DataStatusBanner } from "@/components/dashboard/data-status-banner"
import { CreateAlertDialog } from "@/components/alerts/create-alert-dialog"
import { useAlerts } from "@/hooks/use-alerts"
import type { Stock, ChartDataPoint, CompanyInfo, NewsItem } from "@/types"

interface StockDetailContentProps {
  stock: Stock
  companyInfo: CompanyInfo | undefined
  initialChartData: ChartDataPoint[]
  news: NewsItem[]
  isUsingMockData: boolean
}

export function StockDetailContent({
  stock,
  companyInfo,
  initialChartData,
  news,
  isUsingMockData,
}: StockDetailContentProps) {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const { addAlert, getAlertsForSymbol } = useAlerts()
  const stockAlerts = getAlertsForSymbol(stock.symbol)

  return (
    <div className="space-y-6">
      <DataStatusBanner isUsingMockData={isUsingMockData} />

      <StockDetailHeader
        stock={{ ...stock, exchange: stock.exchange || "NASDAQ" }}
        onAddToWatchlist={() => {}}
        onSetAlert={() => setAlertDialogOpen(true)}
        alertCount={stockAlerts.length}
      />

      {/* Stock Chart with Time Range Toggle */}
      <StockDetailChart stock={stock} initialChartData={initialChartData} />

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Market Cap" value={stock.marketCap} icon={DollarSign} />
        <MetricCard label="Volume" value={stock.volume?.toLocaleString() || "N/A"} icon={BarChart3} />
        <MetricCard
          label="52W High"
          value={stock.high52Week ? `$${stock.high52Week.toFixed(2)}` : "N/A"}
          icon={TrendingUp}
        />
        <MetricCard
          label="52W Low"
          value={stock.low52Week ? `$${stock.low52Week.toFixed(2)}` : "N/A"}
          icon={TrendingDown}
        />
        <MetricCard label="P/E Ratio" value={stock.peRatio ? stock.peRatio.toFixed(2) : "N/A"} icon={PieChart} />
        <MetricCard label="Open" value={stock.open ? `$${stock.open.toFixed(2)}` : "N/A"} icon={Activity} />
        <MetricCard
          label="Previous Close"
          value={stock.previousClose ? `$${stock.previousClose.toFixed(2)}` : "N/A"}
          icon={Activity}
        />
        <MetricCard
          label="Day Range"
          value={stock.dayHigh && stock.dayLow ? `$${stock.dayLow.toFixed(2)} - $${stock.dayHigh.toFixed(2)}` : "N/A"}
          icon={BarChart3}
        />
      </div>

      {/* Company Info & News */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Info */}
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-400 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Sector</p>
              <p className="text-gray-400 font-medium">{companyInfo?.sector || stock.sector || "Technology"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Industry</p>
              <p className="text-gray-400 font-medium">
                {companyInfo?.industry || stock.industry || "Consumer Electronics"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">CEO</p>
              <p className="text-gray-400 font-medium">{companyInfo?.ceo || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Employees</p>
              <p className="text-gray-400 font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                {companyInfo?.employees?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">About</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                {companyInfo?.description ||
                  `${stock.name} is a publicly traded company listed on ${stock.exchange || "NASDAQ"}.`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Related News */}
        <Card className="bg-gray-800 border-gray-600 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-400">Related News</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {news.slice(0, 3).map((item) => (
              <article
                key={item.id}
                className="p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="border-teal-400/30 text-teal-400 bg-teal-400/10">
                    {item.category}
                  </Badge>
                  <span className="text-xs text-gray-500">{item.publishedAt}</span>
                </div>
                <h3 className="font-semibold text-gray-400 mb-2 line-clamp-1 hover:text-yellow-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{item.summary}</p>
              </article>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alert Dialog */}
      <CreateAlertDialog
        open={alertDialogOpen}
        onOpenChange={setAlertDialogOpen}
        symbol={stock.symbol}
        stockName={stock.name}
        currentPrice={stock.price}
        onCreateAlert={addAlert}
      />
    </div>
  )
}
