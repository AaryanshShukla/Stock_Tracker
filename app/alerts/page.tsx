"use client"

import type React from "react"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bell, BellRing, Plus, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAlerts } from "@/hooks/use-alerts"
import { AlertListItem } from "@/components/alerts/alert-list-item"
import { mockStocks } from "@/lib/mock-data"

export default function AlertsPage() {
  const { alerts, activeAlerts, triggeredAlerts, isLoading, addAlert, removeAlert, toggleAlert } = useAlerts()

  // Form state for creating new alerts
  const [symbol, setSymbol] = useState("")
  const [alertType, setAlertType] = useState<"above" | "below">("above")
  const [targetPrice, setTargetPrice] = useState("")
  const [formError, setFormError] = useState("")

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    const upperSymbol = symbol.toUpperCase().trim()
    if (!upperSymbol) {
      setFormError("Please enter a stock symbol")
      return
    }

    const price = Number.parseFloat(targetPrice)
    if (isNaN(price) || price <= 0) {
      setFormError("Please enter a valid price")
      return
    }

    // Find stock in mock data to get name and current price
    const stock = mockStocks.find((s) => s.symbol === upperSymbol)
    const stockName = stock?.name || upperSymbol
    const currentPrice = stock?.price || price

    // Validate alert logic
    if (stock) {
      if (alertType === "above" && price <= stock.price) {
        setFormError(`Target must be above current price ($${stock.price.toFixed(2)})`)
        return
      }
      if (alertType === "below" && price >= stock.price) {
        setFormError(`Target must be below current price ($${stock.price.toFixed(2)})`)
        return
      }
    }

    addAlert({
      symbol: upperSymbol,
      name: stockName,
      type: alertType,
      targetPrice: price,
      currentPrice,
      isActive: true,
    })

    // Reset form
    setSymbol("")
    setTargetPrice("")
    setAlertType("above")
  }

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-400">Price Alerts</h1>
          <p className="text-gray-500 mt-1">Get notified when stocks hit your target prices.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Active Alerts */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader>
              <CardTitle className="text-gray-400 flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-400" />
                Active Alerts
              </CardTitle>
              <CardDescription className="text-gray-500">
                {activeAlerts.length} active alert{activeAlerts.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-700/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : activeAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">No active alerts yet.</p>
                  <p className="text-sm text-gray-600">Create your first alert using the form.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeAlerts.map((alert) => (
                    <AlertListItem key={alert.id} alert={alert} onRemove={removeAlert} onToggle={toggleAlert} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Triggered/Inactive Alerts */}
          {(triggeredAlerts.length > 0 || alerts.filter((a) => !a.isActive).length > 0) && (
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader>
                <CardTitle className="text-gray-400 flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-teal-400" />
                  Inactive Alerts
                </CardTitle>
                <CardDescription className="text-gray-500">Paused or triggered alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts
                    .filter((a) => !a.isActive)
                    .map((alert) => (
                      <AlertListItem key={alert.id} alert={alert} onRemove={removeAlert} onToggle={toggleAlert} />
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Create Alert Form */}
        <div className="xl:col-span-1">
          <Card className="bg-gray-800 border-gray-600 sticky top-6">
            <CardHeader>
              <CardTitle className="text-gray-400 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Alert
              </CardTitle>
              <CardDescription className="text-gray-500">Set a new price alert for any stock</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAlert} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symbol" className="text-gray-400">
                    Stock Symbol
                  </Label>
                  <Input
                    id="symbol"
                    placeholder="e.g., AAPL"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    className="bg-gray-700 border-gray-600 text-gray-400 placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-400">Alert Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAlertType("above")}
                      className={cn(
                        "border-gray-600 bg-transparent",
                        alertType === "above"
                          ? "border-teal-400 bg-teal-400/10 text-teal-400"
                          : "text-gray-400 hover:bg-gray-700",
                      )}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Above
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAlertType("below")}
                      className={cn(
                        "border-gray-600 bg-transparent",
                        alertType === "below"
                          ? "border-red-500 bg-red-500/10 text-red-500"
                          : "text-gray-400 hover:bg-gray-700",
                      )}
                    >
                      <TrendingDown className="h-4 w-4 mr-2" />
                      Below
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetPrice" className="text-gray-400">
                    Target Price
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="targetPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-gray-400 placeholder:text-gray-500 pl-7"
                    />
                  </div>
                </div>

                {formError && <p className="text-sm text-red-500">{formError}</p>}

                <Button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium">
                  Create Alert
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
