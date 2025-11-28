"use client"

import { TrendingUp, TrendingDown, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Alert } from "@/types"

interface AlertListItemProps {
  alert: Alert
  onRemove: (id: string) => void
  onToggle: (id: string) => void
  showToggle?: boolean
}

export function AlertListItem({ alert, onRemove, onToggle, showToggle = true }: AlertListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-lg border transition-colors",
        alert.isActive ? "bg-gray-700/50 border-gray-600" : "bg-gray-800/50 border-gray-700 opacity-60",
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn("p-2 rounded-lg", alert.type === "above" ? "bg-teal-400/10" : "bg-red-500/10")}>
          {alert.type === "above" ? (
            <TrendingUp className="h-5 w-5 text-teal-400" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-400">{alert.symbol}</span>
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                alert.type === "above" ? "border-teal-400/30 text-teal-400" : "border-red-500/30 text-red-500",
              )}
            >
              {alert.type === "above" ? "Above" : "Below"} ${alert.targetPrice.toFixed(2)}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">{alert.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm text-gray-500">Current</p>
          <p className="font-medium text-gray-400">${alert.currentPrice.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-1">
          {showToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggle(alert.id)}
              className={cn("text-gray-500", alert.isActive ? "hover:text-yellow-400" : "hover:text-teal-400")}
            >
              {alert.isActive ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(alert.id)}
            className="text-gray-500 hover:text-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
