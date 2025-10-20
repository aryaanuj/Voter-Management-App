"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, CheckCircle, Camera } from "lucide-react"

export function AnalyticsTab() {
  const verificationTrend = [
    { day: "Mon", verified: 120, total: 200 },
    { day: "Tue", verified: 180, total: 250 },
    { day: "Wed", verified: 250, total: 350 },
    { day: "Thu", verified: 320, total: 420 },
    { day: "Fri", verified: 420, total: 550 },
    { day: "Sat", verified: 520, total: 680 },
    { day: "Sun", verified: 650, total: 850 },
  ]

  const sentimentData = [
    { name: "Favour", value: 1700, color: "#22c55e" },
    { name: "Neutral", value: 900, color: "#f59e0b" },
    { name: "Against", value: 440, color: "#ef4444" },
  ]

  const photoUploadData = [
    { week: "Week 1", photos: 45 },
    { week: "Week 2", photos: 78 },
    { week: "Week 3", photos: 120 },
    { week: "Week 4", photos: 95 },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Verification Rate</p>
                <p className="text-3xl font-bold text-violet-600">76.5%</p>
              </div>
              <div className="bg-gradient-to-br from-violet-100 to-violet-50 p-3 rounded-lg">
                <CheckCircle className="h-8 w-8 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Photos Uploaded</p>
                <p className="text-3xl font-bold text-blue-600">338</p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-3 rounded-lg">
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-600" />
            Verification Trend
          </CardTitle>
          <CardDescription>Weekly verification progress</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={verificationTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="verified" stroke="#7c3aed" strokeWidth={2} name="Verified" />
              <Line type="monotone" dataKey="total" stroke="#cbd5e1" strokeWidth={2} name="Total" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sentiment Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
            <CardDescription>Voter sentiment breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Photo Upload Activity</CardTitle>
            <CardDescription>Weekly photo uploads</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={photoUploadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="photos" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
