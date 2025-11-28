"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Newspaper, ExternalLink, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockNews } from "@/lib/mock-data"

const categories = ["All", "Technology", "Markets", "Economy", "Crypto"]

// Extended mock news
const extendedNews = [
  ...mockNews,
  {
    id: "4",
    title: "Microsoft Cloud Revenue Exceeds Expectations",
    summary:
      "Microsoft's Azure cloud platform reported stronger than expected quarterly revenue, driven by enterprise AI adoption.",
    source: "Financial Times",
    publishedAt: "8 hours ago",
    category: "Technology",
    url: "#",
  },
  {
    id: "5",
    title: "Oil Prices Rise Amid Middle East Tensions",
    summary: "Crude oil futures climbed 3% as geopolitical concerns in the Middle East raised supply disruption fears.",
    source: "Reuters",
    publishedAt: "10 hours ago",
    category: "Markets",
    url: "#",
  },
  {
    id: "6",
    title: "Bitcoin ETF Sees Record Inflows",
    summary:
      "Spot Bitcoin ETFs attracted over $500 million in a single day as institutional interest continues to grow.",
    source: "CoinDesk",
    publishedAt: "12 hours ago",
    category: "Crypto",
    url: "#",
  },
]

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredNews =
    selectedCategory === "All" ? extendedNews : extendedNews.filter((n) => n.category === selectedCategory)

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-400 flex items-center gap-3">
            <Newspaper className="h-8 w-8" />
            Market News
          </h1>
          <p className="text-gray-500 mt-1">Stay updated with the latest market news and analysis.</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Filter className="h-4 w-4 text-gray-500 mr-2" />
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "bg-yellow-400 text-gray-900 border-yellow-400 hover:bg-yellow-500 hover:text-gray-900"
                : "border-gray-600 text-gray-500 hover:bg-gray-700 hover:text-gray-400"
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredNews.map((news) => (
          <Card
            key={news.id}
            className="bg-gray-800 border-gray-600 hover:border-gray-500 transition-colors cursor-pointer group"
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="border-teal-400/30 text-teal-400 bg-teal-400/10">
                  {news.category}
                </Badge>
                <span className="text-xs text-gray-500">{news.publishedAt}</span>
              </div>

              <h3 className="text-lg font-semibold text-gray-400 mb-3 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                {news.title}
              </h3>

              <p className="text-sm text-gray-500 line-clamp-3 mb-4">{news.summary}</p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                <span className="text-sm text-gray-500">{news.source}</span>
                <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-yellow-400 transition-colors" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center pt-8">
        <Button
          variant="outline"
          className="border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-400 bg-transparent"
        >
          Load More News
        </Button>
      </div>
    </AppShell>
  )
}
