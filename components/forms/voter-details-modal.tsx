"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Phone, MapPin, User, Calendar } from "lucide-react"

interface VoterDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  voter: {
    id: number
    name: string
    epicId: string
    age: number
    fatherName: string
    phone: string
    religion: string
    caste: string
    address: string
    status: string
    sentiment?: "favor" | "neutral" | "against"
    image: string
    notes?: string
    verifiedDate?: string
  }
  onEdit?: () => void
  onDelete?: () => void
}

export function VoterDetailsModal({ open, onOpenChange, voter, onEdit, onDelete }: VoterDetailsModalProps) {
  const sentimentColors = {
    favor: { bg: "bg-green-100", text: "text-green-700", label: "In Favor" },
    neutral: { bg: "bg-orange-100", text: "text-orange-700", label: "Neutral" },
    against: { bg: "bg-red-100", text: "text-red-700", label: "Against" },
  }

  const sentiment = voter.sentiment ? sentimentColors[voter.sentiment] : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Voter Details</DialogTitle>
          <DialogDescription>Complete information for {voter.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex gap-6 items-start">
            <img
              src={voter.image || "/placeholder.svg"}
              alt={voter.name}
              className="h-24 w-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{voter.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">EPIC ID: {voter.epicId}</p>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline" className="bg-green-50">
                  {voter.status}
                </Badge>
                {sentiment && <Badge className={`${sentiment.bg} ${sentiment.text} border-0`}>{sentiment.label}</Badge>}
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {voter.age} years
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Father's Name</p>
              <p className="font-semibold text-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                {voter.fatherName}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="font-semibold text-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {voter.phone}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Religion</p>
              <p className="font-semibold text-foreground">{voter.religion}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Caste Category</p>
              <p className="font-semibold text-foreground">{voter.caste}</p>
            </div>
            {voter.verifiedDate && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Verified Date</p>
                <p className="font-semibold text-foreground">{voter.verifiedDate}</p>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Address</p>
            <div className="p-3 bg-muted rounded-lg flex gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{voter.address}</p>
            </div>
          </div>

          {/* Notes */}
          {voter.notes && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Notes</p>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-foreground">{voter.notes}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={onEdit} variant="outline" className="flex-1 bg-transparent">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button onClick={onDelete} variant="destructive" className="flex-1">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
