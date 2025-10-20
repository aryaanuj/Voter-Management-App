"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Trash2 } from "lucide-react"

interface PhotoEntry {
  id: number
  image: string
  latitude: number
  longitude: number
  accuracy: number
  address: string
  timestamp: string
  uploadedBy: string
}

interface PhotoGalleryProps {
  photos: PhotoEntry[]
  onDelete?: (id: number) => void
}

export function PhotoGallery({ photos, onDelete }: PhotoGalleryProps) {
  if (photos.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">No photos uploaded yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo Gallery</CardTitle>
        <CardDescription>{photos.length} photos uploaded</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition">
              <div className="relative bg-muted aspect-square overflow-hidden">
                <img src={photo.image || "/placeholder.svg"} alt="Voter photo" className="w-full h-full object-cover" />
                <Button
                  onClick={() => onDelete?.(photo.id)}
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-3 space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{new Date(photo.timestamp).toLocaleDateString()}</span>
                </div>

                <div className="flex items-start gap-2 text-xs">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-muted-foreground">{photo.address}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {photo.latitude.toFixed(4)}, {photo.longitude.toFixed(4)}
                    </p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      ±{photo.accuracy.toFixed(0)}m
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground pt-2 border-t">
                  <strong>By:</strong> {photo.uploadedBy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
