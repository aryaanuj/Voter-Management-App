"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Edit2, Trash2, Eye, Plus } from "lucide-react"

interface Booth {
  id: number
  name: string
  location: string
  manager: string
  status: "Active" | "Inactive"
  lastUpdate: string
  address?: string
  voters?: number
}

export function BoothOverviewTab() {
  const [booths, setBooths] = useState<Booth[]>([
    {
      id: 1,
      name: "Booth A-01",
      location: "School Building",
      manager: "Rajesh Kumar",
      status: "Active",
      lastUpdate: "2 hours ago",
      address: "Government Primary School, Sector 15",
      voters: 450,
    },
    {
      id: 2,
      name: "Booth A-02",
      location: "Community Center",
      manager: "Priya Sharma",
      status: "Active",
      lastUpdate: "1 hour ago",
      address: "Community Center, Main Road",
      voters: 380,
    },
    {
      id: 3,
      name: "Booth A-03",
      location: "Town Hall",
      manager: "Unassigned",
      status: "Inactive",
      lastUpdate: "45 days ago",
      address: "Town Hall, Central Plaza",
      voters: 0,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBooth, setEditingBooth] = useState<Booth | null>(null)
  const [viewingBooth, setViewingBooth] = useState<Booth | null>(null)

  const filteredBooths = booths.filter(
    (booth) =>
      booth.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booth.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddBooth = (newBooth: Booth) => {
    setBooths([...booths, { ...newBooth, id: Math.max(...booths.map((b) => b.id), 0) + 1 }])
    setShowAddModal(false)
  }

  const handleEditBooth = (updatedBooth: Booth) => {
    setBooths(booths.map((b) => (b.id === updatedBooth.id ? updatedBooth : b)))
    setEditingBooth(null)
  }

  const handleDeleteBooth = (id: number) => {
    if (confirm("Are you sure you want to delete this booth?")) {
      setBooths(booths.filter((b) => b.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Booth Management</CardTitle>
              <CardDescription>Manage all polling booths</CardDescription>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Booth
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search booths by name or location..."
                className="pl-10 border-0 bg-gray-50 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooths.map((booth) => (
              <div
                key={booth.id}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground">{booth.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {booth.location}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                      booth.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {booth.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4 py-3 border-y border-gray-100">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Manager:</span> {booth.manager}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Voters:</span> {booth.voters || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Last update: {booth.lastUpdate}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-0 bg-blue-50 text-blue-600 hover:bg-blue-100"
                    onClick={() => setViewingBooth(booth)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-0 bg-violet-50 text-violet-600 hover:bg-violet-100"
                    onClick={() => setEditingBooth(booth)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-0 bg-red-50 text-red-600 hover:bg-red-100"
                    onClick={() => handleDeleteBooth(booth.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredBooths.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No booths found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Booth Modal */}
      {(showAddModal || editingBooth) && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{editingBooth ? "Edit Booth" : "Add New Booth"}</h2>
            <BoothForm
              booth={editingBooth}
              onSubmit={(booth) => {
                if (editingBooth) {
                  handleEditBooth(booth)
                } else {
                  handleAddBooth(booth)
                }
              }}
              onCancel={() => {
                setShowAddModal(false)
                setEditingBooth(null)
              }}
            />
          </div>
        </div>
      )}

      {/* View Booth Modal */}
      {viewingBooth && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{viewingBooth.name}</h2>
              <button
                onClick={() => setViewingBooth(null)}
                className="text-2xl text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Booth Name</p>
                <p className="text-lg font-semibold">{viewingBooth.name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="text-lg font-semibold">{viewingBooth.location}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-lg font-semibold">{viewingBooth.address}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Manager</p>
                <p className="text-lg font-semibold">{viewingBooth.manager}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold">{viewingBooth.status}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Voters</p>
                <p className="text-lg font-semibold">{viewingBooth.voters}</p>
              </div>
              <Button
                onClick={() => setViewingBooth(null)}
                className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white mt-6"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BoothForm({
  booth,
  onSubmit,
  onCancel,
}: {
  booth?: Booth | null
  onSubmit: (booth: Booth) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Booth>(
    booth || {
      id: 0,
      name: "",
      location: "",
      manager: "",
      status: "Active",
      lastUpdate: new Date().toLocaleString(),
      address: "",
      voters: 0,
    },
  )

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Booth Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Booth A-01"
          className="border-0 bg-gray-50 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Location</label>
        <Input
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="e.g., School Building"
          className="border-0 bg-gray-50 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Address</label>
        <Input
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Full address"
          className="border-0 bg-gray-50 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Manager</label>
        <Input
          value={formData.manager}
          onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
          placeholder="Manager name"
          className="border-0 bg-gray-50 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
          className="w-full border-0 bg-gray-50 rounded-lg p-2"
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
      <div className="flex gap-3 mt-6">
        <Button onClick={onCancel} variant="outline" className="flex-1 border-0 bg-gray-100 hover:bg-gray-200">
          Cancel
        </Button>
        <Button
          onClick={() => onSubmit(formData)}
          className="flex-1 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white"
        >
          Save
        </Button>
      </div>
    </div>
  )
}
