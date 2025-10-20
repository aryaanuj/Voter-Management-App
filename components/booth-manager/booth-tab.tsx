"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Users, CheckCircle, AlertCircle } from "lucide-react"

export function BoothTab() {
  const [booths] = useState([
    {
      id: 1,
      name: "Booth 101",
      location: "Government Primary School, Sector 15",
      totalVoters: 2215,
      verifiedVoters: 1850,
      status: "active",
      manager: "Rajesh Kumar",
    },
    {
      id: 2,
      name: "Booth 102",
      location: "Community Center, Sector 16",
      totalVoters: 2215,
      verifiedVoters: 890,
      status: "active",
      manager: "Priya Sharma",
    },
  ])

  return (
    <div className="space-y-4">
      {booths.map((booth) => (
        <Card key={booth.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-violet-100 to-violet-50 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-violet-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground">{booth.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{booth.location}</p>
                  <p className="text-xs text-muted-foreground mt-2">Manager: {booth.manager}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {booth.status === "active" ? (
                  <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-green-600">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-xs font-medium text-red-600">Inactive</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-muted-foreground">Total Voters</span>
                </div>
                <p className="text-xl font-bold text-blue-600">{booth.totalVoters.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-medium text-muted-foreground">Verified</span>
                </div>
                <p className="text-xl font-bold text-green-600">{booth.verifiedVoters.toLocaleString()}</p>
              </div>
            </div>

            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full"
                style={{ width: `${(booth.verifiedVoters / booth.totalVoters) * 100}%` }}
              ></div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 text-sm bg-transparent">
                View Details
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white text-sm">
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
