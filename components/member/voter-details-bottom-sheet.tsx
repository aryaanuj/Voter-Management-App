"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Upload, CheckCircle, AlertCircle } from "lucide-react"
import { OTPVerificationModal } from "./otp-verification-modal"

interface VoterDetailsBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  voter: {
    id: number
    name: string
    age: number
    religion?: string
    category?: string
    caste?: string
    phone?: string
    status?: string
    image?: string
    phoneVerified?: boolean
  }
  onSave: (data: any) => void
}

export function VoterDetailsBottomSheet({ isOpen, onClose, voter, onSave }: VoterDetailsBottomSheetProps) {
  const [selectedReligion, setSelectedReligion] = useState(voter.religion || "")
  const [selectedCategory, setSelectedCategory] = useState(voter.category || "")
  const [casteInput, setCasteInput] = useState(voter.caste || "")
  const [phoneInput, setPhoneInput] = useState(voter.phone || "")
  const [selectedStatus, setSelectedStatus] = useState(voter.status || "Active")
  const [sentiment, setSentiment] = useState<"favor" | "neutral" | "against" | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState(voter.image || "")
  const [phoneVerified, setPhoneVerified] = useState(voter.phoneVerified || false)
  const [showOTPModal, setShowOTPModal] = useState(false)

  const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Other"]
  const categories = ["General", "OBC", "SC", "ST"]
  const statuses = ["Active", "Deceased", "Moved"]

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVerifyPhone = () => {
    setShowOTPModal(true)
  }

  const handleOTPVerify = (otp: string) => {
    setPhoneVerified(true)
    setShowOTPModal(false)
  }

  const handleSave = () => {
    onSave({
      religion: selectedReligion,
      category: selectedCategory,
      caste: casteInput,
      phone: phoneInput,
      status: selectedStatus,
      sentiment,
      photo: photoFile,
      phoneVerified,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

        {/* Bottom Sheet */}
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between rounded-t-3xl">
            <h2 className="text-lg font-bold text-gray-900">Edit Voter Details</h2>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition">
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 py-4 space-y-4">
            {/* Voter Info */}
            <div className="space-y-1">
              <p className="text-base font-semibold text-gray-900">{voter.name}</p>
              <p className="text-xs text-gray-600">Age: {voter.age}</p>
            </div>

            <div className="space-y-2 bg-gradient-to-br from-violet-50 to-purple-50 p-3 rounded-xl border border-violet-100">
              <label className="text-sm font-bold text-gray-900 block">Party Sentiment</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSentiment("favor")}
                  className={`py-2.5 px-2 rounded-lg font-semibold transition-all text-xs flex flex-col items-center gap-1 ${
                    sentiment === "favor"
                      ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md"
                      : "bg-white text-green-600 border border-green-200 hover:border-green-400"
                  }`}
                >
                  <span className="text-lg">✓</span>
                  <span>Favour</span>
                </button>
                <button
                  onClick={() => setSentiment("neutral")}
                  className={`py-2.5 px-2 rounded-lg font-semibold transition-all text-xs flex flex-col items-center gap-1 ${
                    sentiment === "neutral"
                      ? "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-md"
                      : "bg-white text-yellow-600 border border-yellow-200 hover:border-yellow-400"
                  }`}
                >
                  <span className="text-lg">◐</span>
                  <span>Neutral</span>
                </button>
                <button
                  onClick={() => setSentiment("against")}
                  className={`py-2.5 px-2 rounded-lg font-semibold transition-all text-xs flex flex-col items-center gap-1 ${
                    sentiment === "against"
                      ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md"
                      : "bg-white text-red-600 border border-red-200 hover:border-red-400"
                  }`}
                >
                  <span className="text-lg">✕</span>
                  <span>Against</span>
                </button>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <div className="flex gap-3">
                {photoPreview && (
                  <img
                    src={photoPreview || "/placeholder.svg"}
                    alt="Preview"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                )}
                <label className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                    <span className="text-xs font-medium text-gray-600">Upload Photo</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Religion Section */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">Religion</label>
              <div className="flex flex-wrap gap-1.5">
                {religions.map((religion) => (
                  <button
                    key={religion}
                    onClick={() => setSelectedReligion(religion)}
                    className={`px-3 py-1.5 rounded-full font-medium text-xs transition ${
                      selectedReligion === religion
                        ? "border-2 border-violet-600 text-violet-600 bg-white"
                        : "border border-gray-300 text-gray-600 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {religion}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Section */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-full font-medium text-xs transition ${
                      selectedCategory === category
                        ? "border-2 border-violet-600 text-violet-600 bg-white"
                        : "border border-gray-300 text-gray-600 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Caste Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-900">Caste</label>
              <input
                type="text"
                value={casteInput}
                onChange={(e) => setCasteInput(e.target.value)}
                placeholder="Enter caste"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-900">Phone Number</label>
                {phoneVerified && (
                  <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Enter phone number"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                />
                {!phoneVerified && (
                  <button
                    onClick={handleVerifyPhone}
                    className="px-3 py-2 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-1 whitespace-nowrap"
                  >
                    <AlertCircle className="h-3 w-3" />
                    Verify
                  </button>
                )}
              </div>
            </div>

            {/* Current Status Section */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">Current Status</label>
              <div className="flex flex-wrap gap-1.5">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1.5 rounded-full font-medium text-xs transition ${
                      selectedStatus === status
                        ? "border-2 border-violet-600 text-violet-600 bg-white"
                        : "border border-gray-300 text-gray-600 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3 pb-6">
              <Button
                onClick={onClose}
                className="flex-1 py-2 text-sm font-semibold border-2 border-gray-300 text-gray-900 bg-white hover:bg-gray-50"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 py-2 text-sm font-semibold bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-lg rounded-lg"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        phoneNumber={phoneInput}
        onVerify={handleOTPVerify}
      />
    </>
  )
}
