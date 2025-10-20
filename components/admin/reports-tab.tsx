"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export function ReportsTab() {
  const boothPerformanceData = [
    { name: "Active", value: 142, fill: "#10b981" },
    { name: "Inactive", value: 8, fill: "#ef4444" },
  ]

  const voterEngagementData = [
    { month: "Jan", verified: 850, unverified: 150 },
    { month: "Feb", verified: 920, unverified: 130 },
    { month: "Mar", verified: 1050, unverified: 100 },
    { month: "Apr", verified: 1200, unverified: 80 },
    { month: "May", verified: 1350, unverified: 60 },
  ]

  const sentimentData = [
    { name: "Favour", value: 1700, percentage: "55.9%", fill: "#10b981" },
    { name: "Neutral", value: 900, percentage: "29.6%", fill: "#f59e0b" },
    { name: "Against", value: 440, percentage: "14.5%", fill: "#ef4444" },
  ]

  const activityData = [
    { time: "12:00 PM", voters: 45, booths: 12 },
    { time: "1:00 PM", voters: 62, booths: 15 },
    { time: "2:00 PM", voters: 78, booths: 18 },
    { time: "3:00 PM", voters: 95, booths: 22 },
    { time: "4:00 PM", voters: 110, booths: 25 },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Voters</p>
              <p className="text-3xl font-bold text-blue-600">3,050</p>
              <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Verified Contacts</p>
              <p className="text-3xl font-bold text-green-600">2,740</p>
              <p className="text-xs text-green-600 mt-2">89.8% verification rate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Active Booths</p>
              <p className="text-3xl font-bold text-violet-600">142</p>
              <p className="text-xs text-green-600 mt-2">94.7% active rate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Photos Uploaded</p>
              <p className="text-3xl font-bold text-orange-600">1,850</p>
              <p className="text-xs text-green-600 mt-2">60.7% coverage</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booth Performance */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Booth Performance</CardTitle>
            <CardDescription>Active vs Inactive booths</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={boothPerformanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {boothPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Voter Engagement Trend */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Voter Engagement Trend</CardTitle>
            <CardDescription>Verified vs Unverified voters</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={voterEngagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="verified" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="unverified" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Analysis */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Sentiment Breakdown</CardTitle>
          <CardDescription>Voter sentiment distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {sentimentData.map((item) => (
              <div key={item.name} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                  <p className="font-medium">{item.name}</p>
                </div>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.percentage}</p>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Today's Activity</CardTitle>
          <CardDescription>Real-time voter and booth activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="voters" stroke="#7c3aed" strokeWidth={2} name="Voters Updated" />
              <Line type="monotone" dataKey="booths" stroke="#06b6d4" strokeWidth={2} name="Booths Active" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
