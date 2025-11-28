"use client"

import { useState, type ReactNode } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"

interface AppShellProps {
  children: ReactNode
}

/**
 * Client-side layout wrapper that manages sidebar state
 * Allows pages to be server components while maintaining interactive sidebar
 */
export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
