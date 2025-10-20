"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react"

export function SentimentBreakdown() {
  const sentiments = [
    { label: "Party Favor", count: 1700, percentage: 55.9, color: "bg-green-500", icon: ThumbsUp },
    { label: "Neutral", count: 900, percentage: 29.6, color: "bg-orange-500", icon: Minus },
    { label: "Against", count: 440, percentage: 14.5, color: "bg-red-500", icon: ThumbsDown },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Breakdown</CardTitle>
        <CardDescription>Voter sentiment analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {sentiments.map((sentiment) => {
          const Icon = sentiment.icon
          return (
            <div key={sentiment.label}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{sentiment.label}</span>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {sentiment.count.toLocaleString()} ({sentiment.percentage}%)
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className={`h-full ${sentiment.color}`} style={{ width: `${sentiment.percentage}%` }}></div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
