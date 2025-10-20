"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, MapPin, Edit2, Save, X, Camera } from "lucide-react"

interface ProfilePageProps {
  userName: string
  userRole: "admin" | "booth-manager" | "member"
}

export function ProfilePage({ userName, userRole }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profileData, setProfileData] = useState({
    fullName: userName,
    email: "user@example.com",
    phone: "+91 9876543210",
    role: userRole === "admin" ? "Administrator" : userRole === "booth-manager" ? "Booth Manager" : "Member",
    booth: "Booth A-01",
    address: "123 Main Street, City, State 12345",
    joinDate: "January 15, 2024",
  })

  const [editData, setEditData] = useState(profileData)

  const handleEdit = () => {
    setIsEditing(true)
    setEditData(profileData)
  }

  const handleSave = () => {
    setProfileData(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleChange = (field: string, value: string) => {
    setEditData({ ...editData, [field]: value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header Card with Circular Image */}
      <Card className="border-0 bg-gradient-to-br from-violet-50 via-white to-violet-50 overflow-hidden shadow-lg">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-violet-600 to-violet-700 rounded-full flex items-center justify-center shadow-xl border-4 border-white overflow-hidden">
                {profileImage ? (
                  <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-16 w-16 text-white" />
                )}
              </div>
              {isEditing && (
                <button
                  onClick={triggerImageUpload}
                  className="absolute bottom-0 right-0 bg-violet-600 hover:bg-violet-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <Camera className="h-5 w-5" />
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground">{profileData.fullName}</h2>
              <p className="text-sm text-violet-600 font-semibold mt-2 bg-violet-100 px-4 py-1 rounded-full inline-block">
                {profileData.role}
              </p>
              <p className="text-xs text-muted-foreground mt-3">Joined {profileData.joinDate}</p>
            </div>

            {!isEditing && (
              <Button
                onClick={handleEdit}
                className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-lg"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border-0 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-violet-600 text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-all"
              />
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-50 to-white rounded-xl border border-violet-100">
                <User className="h-5 w-5 text-violet-600" />
                <p className="text-foreground font-medium">{profileData.fullName}</p>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">Email Address</label>
            {isEditing ? (
              <input
                type="email"
                value={editData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-all"
              />
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-50 to-white rounded-xl border border-violet-100">
                <Mail className="h-5 w-5 text-violet-600" />
                <p className="text-foreground font-medium">{profileData.email}</p>
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-all"
              />
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-50 to-white rounded-xl border border-violet-100">
                <Phone className="h-5 w-5 text-violet-600" />
                <p className="text-foreground font-medium">{profileData.phone}</p>
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">Address</label>
            {isEditing ? (
              <textarea
                value={editData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-all"
                rows={3}
              />
            ) : (
              <div className="flex items-start gap-3 px-4 py-3 bg-gradient-to-r from-violet-50 to-white rounded-xl border border-violet-100">
                <MapPin className="h-5 w-5 text-violet-600 mt-1 flex-shrink-0" />
                <p className="text-foreground font-medium">{profileData.address}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Role Information */}
      <Card className="border-0 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-violet-600 text-lg">Role Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="px-4 py-4 bg-gradient-to-br from-violet-50 to-white rounded-xl border border-violet-100">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Role</p>
              <p className="text-sm font-bold text-violet-600 mt-2">{profileData.role}</p>
            </div>
            <div className="px-4 py-4 bg-gradient-to-br from-violet-50 to-white rounded-xl border border-violet-100">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Assigned Booth</p>
              <p className="text-sm font-bold text-violet-600 mt-2">{profileData.booth}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Actions */}
      {isEditing && (
        <div className="flex gap-3">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1 border-violet-200 text-violet-600 hover:bg-violet-50 bg-white"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-lg"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  )
}
