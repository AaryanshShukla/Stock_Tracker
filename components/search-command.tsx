"use client"

import * as React from "react"
import { Search, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { mockStocks } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function SearchCommand() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 md:w-64 md:justify-start md:px-3 border-gray-600 bg-gray-700 text-gray-500 hover:bg-gray-600 hover:text-gray-400"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 md:mr-2" />
        <span className="hidden md:inline-flex">Search stocks...</span>
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-600 bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-500">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="bg-gray-800 border-gray-600">
          <CommandInput
            placeholder="Search stocks by name or symbol..."
            className="bg-gray-800 text-gray-400 placeholder:text-gray-500 border-0 border-b border-gray-600"
          />
          <CommandList className="bg-gray-800 max-h-[400px]">
            <CommandEmpty className="py-6 text-center text-gray-500">No stocks found.</CommandEmpty>
            <CommandGroup heading="Stocks" className="text-gray-500">
              {mockStocks.map((stock) => (
                <CommandItem
                  key={stock.symbol}
                  value={`${stock.symbol} ${stock.name}`}
                  onSelect={() => {
                    setOpen(false)
                  }}
                  className="flex items-center justify-between px-4 py-3 cursor-pointer data-[selected=true]:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-gray-400 font-bold text-sm">
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-400">{stock.symbol}</p>
                      <p className="text-sm text-gray-500">{stock.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-400">${stock.price.toFixed(2)}</p>
                    <p
                      className={cn(
                        "text-sm flex items-center gap-1 justify-end",
                        stock.change >= 0 ? "text-teal-400" : "text-red-500",
                      )}
                    >
                      {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {stock.changePercent >= 0 ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </div>
      </CommandDialog>
    </>
  )
}
