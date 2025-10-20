"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, MapPin, Camera, Loader, X } from "lucide-react"

interface PhotoUploadFormProps {
  voterName: string
  onSubmit?: (data: PhotoUploadData) => void
  onCancel?: () => void
}

export interface PhotoUploadData {
  photo: File | null
  photoPreview: string
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  timestamp: string
  address: string
}

export function PhotoUploadForm({ voterName, onSubmit, onCancel }: PhotoUploadFormProps) {
  const [formData, setFormData] = useState<PhotoUploadData>({
    photo: null,
    photoPreview: "",
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: new Date().toISOString(),
    address: "",
  })

  const [loading, setLoading] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)

  // Get GPS Location
  const handleGetLocation = async () => {
    setGpsLoading(true)
    setError("")

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setGpsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords
        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
          accuracy,
        }))

        // Try to get address from coordinates (reverse geocoding)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          )
          const data = await response.json()
          setFormData((prev) => ({
            ...prev,
            address: data.address?.road || data.address?.city || "Location captured",
          }))
        } catch {
          setFormData((prev) => ({
            ...prev,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          }))
        }

        setGpsLoading(false)
      },
      (err) => {
        setError(`GPS Error: ${err.message}`)
        setGpsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          photo: file,
          photoPreview: event.target?.result as string,
        }))
        setError("")
      }
      reader.readAsDataURL(file)
    }
  }

  // Start Camera
  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      setError("Unable to access camera")
    }
  }

  // Capture Photo from Camera
  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)

        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `voter-photo-${Date.now()}.jpg`, { type: "image/jpeg" })
            setFormData((prev) => ({
              ...prev,
              photo: file,
              photoPreview: canvasRef.current?.toDataURL() || "",
            }))
            handleStopCamera()
          }
        }, "image/jpeg")
      }
    }
  }

  // Stop Camera
  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setCameraActive(false)
    }
  }

  // Remove Photo
  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photo: null,
      photoPreview: "",
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.photo) {
      setError("Please upload a photo")
      return
    }

    if (formData.latitude === null || formData.longitude === null) {
      setError("Please capture GPS location")
      return
    }

    setSubmitted(true)
    onSubmit?.(formData)
    setTimeout(() => setSubmitted(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo Upload with GPS</CardTitle>
        <CardDescription>Capture photo and location for {voterName}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Capture Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Photo Capture</h3>

            {!cameraActive && !formData.photoPreview && (
              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={handleStartCamera}
                  variant="outline"
                  className="w-full h-32 border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted bg-transparent"
                >
                  <Camera className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm">Take Photo with Camera</span>
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-muted transition">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Upload Photo</span>
                    </div>
                  </Label>
                  <Input
                    id="photo-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {cameraActive && (
              <div className="space-y-3">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg bg-black"
                  style={{ maxHeight: "400px" }}
                />
                <div className="flex gap-2">
                  <Button type="button" onClick={handleCapturePhoto} className="flex-1 bg-primary hover:bg-primary/90">
                    <Camera className="h-4 w-4 mr-2" />
                    Capture Photo
                  </Button>
                  <Button type="button" onClick={handleStopCamera} variant="outline" className="flex-1 bg-transparent">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {formData.photoPreview && (
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden bg-muted">
                  <img
                    src={formData.photoPreview || "/placeholder.svg"}
                    alt="Captured"
                    className="w-full max-h-96 object-cover"
                  />
                  <Button
                    type="button"
                    onClick={handleRemovePhoto}
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button type="button" onClick={handleRemovePhoto} variant="outline" className="flex-1 bg-transparent">
                    Change Photo
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* GPS Location Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">GPS Location</h3>

            <Button
              type="button"
              onClick={handleGetLocation}
              disabled={gpsLoading}
              variant="outline"
              className="w-full bg-transparent"
            >
              {gpsLoading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Capture GPS Location
                </>
              )}
            </Button>

            {formData.latitude && formData.longitude && (
              <div className="space-y-3">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-900">Location Captured</p>
                      <p className="text-sm text-green-700 mt-1">
                        {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                      </p>
                      {formData.accuracy && (
                        <p className="text-xs text-green-600 mt-1">Accuracy: ±{formData.accuracy.toFixed(0)}m</p>
                      )}
                      {formData.address && (
                        <p className="text-sm text-green-700 mt-2">
                          <strong>Address:</strong> {formData.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={gpsLoading}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  Update Location
                </Button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {submitted && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Photo and location uploaded successfully!</span>
            </div>
          )}

          {/* Hidden Canvas for Camera Capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={!formData.photo || formData.latitude === null}
              className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              Upload Photo & Location
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
