import { AppShell } from "@/components/layout/app-shell"
import { RealtimeDashboard } from "@/components/dashboard/realtime-dashboard"
import { fetchStockQuotes, fetchMarketIndices, fetchStockCandles } from "@/lib/actions/stocks"

export default async function DashboardPage() {
  // Fetch initial data server-side
  const [stocksResult, indicesResult, chartResult] = await Promise.all([
    fetchStockQuotes(),
    fetchMarketIndices(),
    fetchStockCandles("AAPL", "1M"),
  ])

  const stocks = stocksResult.data || []
  const indices = indicesResult.data || []
  const chartData = chartResult.data || []
  const isUsingMockData = stocksResult.isUsingMockData || indicesResult.isUsingMockData
  const error = stocksResult.error || indicesResult.error

  return (
    <AppShell>
      <RealtimeDashboard
        initialStocks={stocks}
        initialIndices={indices}
        initialChartData={chartData}
        initialIsUsingMockData={isUsingMockData}
        initialError={error}
      />
    </AppShell>
  )
}
