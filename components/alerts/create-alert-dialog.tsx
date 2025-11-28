"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Alert } from "@/types"

interface CreateAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  symbol: string
  stockName: string
  currentPrice: number
  onCreateAlert: (alert: Omit<Alert, "id" | "createdAt">) => void
}

export function CreateAlertDialog({
  open,
  onOpenChange,
  symbol,
  stockName,
  currentPrice,
  onCreateAlert,
}: CreateAlertDialogProps) {
  const [alertType, setAlertType] = useState<"above" | "below">("above")
  const [targetPrice, setTargetPrice] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const price = Number.parseFloat(targetPrice)
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price")
      return
    }

    // Validate alert makes sense
    if (alertType === "above" && price <= currentPrice) {
      setError(`Target price must be above current price ($${currentPrice.toFixed(2)})`)
      return
    }
    if (alertType === "below" && price >= currentPrice) {
      setError(`Target price must be below current price ($${currentPrice.toFixed(2)})`)
      return
    }

    onCreateAlert({
      symbol,
      name: stockName,
      type: alertType,
      targetPrice: price,
      currentPrice,
      isActive: true,
    })

    // Reset form and close dialog
    setTargetPrice("")
    setAlertType("above")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-600 text-gray-400 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-400">Create Price Alert</DialogTitle>
          <DialogDescription className="text-gray-500">
            Get notified when {symbol} hits your target price.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Stock Info */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
            <div>
              <p className="font-semibold text-gray-400">{symbol}</p>
              <p className="text-sm text-gray-500">{stockName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Current Price</p>
              <p className="font-semibold text-gray-400">${currentPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Alert Type */}
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
                Price Above
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
                Price Below
              </Button>
            </div>
          </div>

          {/* Target Price */}
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
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-700 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium">
              Create Alert
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
