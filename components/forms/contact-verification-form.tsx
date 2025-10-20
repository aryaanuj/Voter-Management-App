"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, AlertCircle, Phone } from "lucide-react"

interface ContactVerificationFormProps {
  voterName: string
  voterPhone: string
  onSubmit?: (data: VerificationData) => void
  onCancel?: () => void
}

export interface VerificationData {
  contactMethod: "phone" | "email" | "in-person"
  status: "verified" | "not-reachable" | "wrong-number" | "declined"
  notes: string
  alternatePhone?: string
}

export function ContactVerificationForm({ voterName, voterPhone, onSubmit, onCancel }: ContactVerificationFormProps) {
  const [formData, setFormData] = useState<VerificationData>({
    contactMethod: "phone",
    status: "verified",
    notes: "",
    alternatePhone: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    onSubmit?.(formData)
    setTimeout(() => setSubmitted(false), 2000)
  }

  const statusOptions = [
    { value: "verified", label: "Verified", color: "text-green-600" },
    { value: "not-reachable", label: "Not Reachable", color: "text-orange-600" },
    { value: "wrong-number", label: "Wrong Number", color: "text-red-600" },
    { value: "declined", label: "Declined to Verify", color: "text-red-600" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Verification</CardTitle>
        <CardDescription>Verify contact details for {voterName}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Voter Information */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-muted-foreground">Verifying Contact For</p>
            <p className="font-semibold text-foreground mt-1">{voterName}</p>
            <p className="text-sm text-foreground mt-2 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {voterPhone}
            </p>
          </div>

          {/* Contact Method */}
          <div className="space-y-2">
            <Label htmlFor="contactMethod">Contact Method *</Label>
            <Select
              value={formData.contactMethod}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  contactMethod: value as "phone" | "email" | "in-person",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Verification Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Verification Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as "verified" | "not-reachable" | "wrong-number" | "declined",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className={option.color}>{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Alternate Phone (if wrong number) */}
          {formData.status === "wrong-number" && (
            <div className="space-y-2">
              <Label htmlFor="alternatePhone">Correct Phone Number</Label>
              <Input
                id="alternatePhone"
                placeholder="Enter correct phone number"
                value={formData.alternatePhone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    alternatePhone: e.target.value.replace(/\D/g, "").slice(0, 10),
                  }))
                }
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Verification Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about the verification attempt"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={4}
            />
          </div>

          {/* Status Indicator */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Current Status</p>
            <div className="flex items-center gap-2">
              {formData.status === "verified" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-600" />
              )}
              <span className="font-semibold text-foreground">
                {statusOptions.find((s) => s.value === formData.status)?.label}
              </span>
            </div>
          </div>

          {/* Success Message */}
          {submitted && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Verification recorded successfully!</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              Save Verification
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
