"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { VoterCard } from "@/components/shared/voter-card"

export function VoterListTab() {
  const [searchTerm, setSearchTerm] = useState("")

  const voters = [
    {
      id: 1,
      name: "Rajesh Kumar Singh",
      epicId: "ABC1234567",
      age: 45,
      fatherName: "Ram Kumar Singh",
      phone: "+91 9876543210",
      religion: "Hindu / General",
      status: "Verified",
      sentiment: "favor",
      image: "/voter-profile-1.jpg",
    },
    {
      id: 2,
      name: "Priya Sharma",
      epicId: "DEF2345678",
      age: 32,
      fatherName: "Suresh Sharma",
      phone: "+91 9876543211",
      religion: "Hindu / OBC",
      status: "Verified",
      sentiment: "neutral",
      image: "/voter-profile-2.jpg",
    },
    {
      id: 3,
      name: "Mohammed Ali Khan",
      epicId: "GHI3456789",
      age: 38,
      fatherName: "Abdul Khan",
      phone: "+91 9876543212",
      religion: "Muslim / General",
      status: "Verified",
      sentiment: "against",
      image: "/voter-profile-3.jpg",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Voter List</CardTitle>
            <CardDescription>Manage and verify voters</CardDescription>
          </div>
          <Button className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white">
            Add Voter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, EPIC ID, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {voters.map((voter) => (
            <VoterCard key={voter.id} voter={voter} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
