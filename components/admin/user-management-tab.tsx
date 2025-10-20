"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit2, Trash2, X } from "lucide-react"

interface User {
  id: number
  name: string
  role: "Admin" | "Booth Manager" | "Member"
  phone: string
  status: "Active" | "Inactive"
}

export function UserManagementTab() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Rajesh Kumar", role: "Booth Manager", phone: "+91 9876543210", status: "Active" },
    { id: 2, name: "Priya Sharma", role: "Member", phone: "+91 9876543211", status: "Active" },
    { id: 3, name: "Mohammed Ali", role: "Member", phone: "+91 9876543212", status: "Inactive" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({ name: "", role: "Member" as const, phone: "", status: "Active" as const })

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = () => {
    if (formData.name && formData.phone) {
      const newUser: User = {
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        ...formData,
      }
      setUsers([...users, newUser])
      setFormData({ name: "", role: "Member", phone: "", status: "Active" })
      setShowAddModal(false)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData(user)
    setShowAddModal(true)
  }

  const handleUpdateUser = () => {
    if (editingUser && formData.name && formData.phone) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)))
      setEditingUser(null)
      setFormData({ name: "", role: "Member", phone: "", status: "Active" })
      setShowAddModal(false)
    }
  }

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setEditingUser(null)
    setFormData({ name: "", role: "Member", phone: "", status: "Active" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-sm text-muted-foreground mt-1">{users.length} Total Users</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone, or role..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="text-sm font-medium">{user.role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    onClick={() => handleEditUser(user)}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-violet-600 border-violet-200 hover:bg-violet-50"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteUser(user.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{editingUser ? "Edit User" : "Add New User"}</h2>
              <Button variant="ghost" size="icon" onClick={handleCloseModal}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <Input
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="Booth Manager">Booth Manager</option>
                  <option value="Member">Member</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-6">
                <Button onClick={handleCloseModal} variant="outline" className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={editingUser ? handleUpdateUser : handleAddUser}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white"
                >
                  {editingUser ? "Update User" : "Add User"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
