"use client"

import { ExternalLink, Newspaper } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockNews } from "@/lib/mock-data"

export function MarketNews() {
  return (
    <Card className="bg-gray-800 border-gray-600">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-400 flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Market News
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockNews.map((news) => (
            <article
              key={news.id}
              className="p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="border-teal-400/30 text-teal-400 bg-teal-400/10">
                      {news.category}
                    </Badge>
                    <span className="text-xs text-gray-500">{news.publishedAt}</span>
                  </div>
                  <h3 className="font-semibold text-gray-400 mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{news.summary}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-500">{news.source}</span>
                    <ExternalLink className="h-3 w-3 text-gray-500" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
