"use client";

import { useState } from "react";
import { Phone, Edit2, ThumbsUp, Minus, ThumbsDown, CheckCircle } from "lucide-react";
import { VoterDetailsBottomSheet } from "@/components/member/voter-details-bottom-sheet";
import { VoterImage } from "@/components/shared/voter-image";

interface VoterCardProps {
    voter: {
        id: number;
        name: string;
        epicId: string;
        age: number;
        fatherName: string;
        phone: string;
        religion: string;
        status: string;
        sentiment?: "favor" | "neutral" | "against";
        photoUrl: string;
    };
}

export function VoterCard({ voter }: VoterCardProps) {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedSentiment, setSelectedSentiment] = useState<"favor" | "neutral" | "against" | null>(voter.sentiment || null);

    return (
        <>
            <div className="bg-white rounded-xl p-4 border border-violet-100 hover:shadow-md transition-all duration-300">
                {/* Header with Name and Edit Icon */}
                <div className="flex items-start gap-3 mb-3">
                    {/* Profile Image with Verified Badge Overlay */}
                    <div className="relative flex-shrink-0">
                        <VoterImage filePath={voter.photoUrl} alt={voter.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-violet-200" />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 ring-2 ring-white">
                            <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                    </div>

                    {/* Name and EPIC ID */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-foreground leading-tight">{voter.name}</h3>
                            <button onClick={() => setIsDetailsOpen(true)} className="p-1 hover:bg-violet-100 rounded-full transition-colors flex-shrink-0" title="Edit">
                                <Edit2 className="h-4 w-4 text-violet-600" />
                            </button>
                        </div>
                        <p className="text-xs text-violet-600 font-semibold">EPIC: {voter.epicId}</p>
                    </div>
                </div>

                {/* Voter Details */}
                <div className="space-y-1.5 text-xs mb-3">
                    {/* Age and Father Name */}
                    <div className="flex gap-4">
                        <div>
                            <span className="text-muted-foreground">Age:</span>
                            <span className="font-semibold text-foreground ml-1">{voter.age}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Father:</span>
                            <span className="font-semibold text-foreground ml-1">{voter.fatherName}</span>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-violet-600 flex-shrink-0" />
                        <span className="font-semibold text-foreground">{voter.phone}</span>
                    </div>

                    {/* Religion */}
                    <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-violet-600 flex-shrink-0"></div>
                        <span className="text-muted-foreground">Religion:</span>
                        <span className="font-semibold text-violet-600">{voter.religion}</span>
                    </div>
                </div>

                <div className="flex gap-1.5 pt-2 border-t border-violet-100">
                    {/* Favour Button */}
                    <button
                        onClick={() => setSelectedSentiment(selectedSentiment === "favor" ? null : "favor")}
                        className={`flex-1 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            selectedSentiment === "favor" ? "bg-green-500 text-white shadow-md" : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}
                        title="Favour"
                    >
                        <ThumbsUp className="h-3.5 w-3.5" />
                    </button>

                    {/* Neutral Button */}
                    <button
                        onClick={() => setSelectedSentiment(selectedSentiment === "neutral" ? null : "neutral")}
                        className={`flex-1 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            selectedSentiment === "neutral" ? "bg-yellow-500 text-white shadow-md" : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                        }`}
                        title="Neutral"
                    >
                        <Minus className="h-3.5 w-3.5" />
                    </button>

                    {/* Against Button */}
                    <button
                        onClick={() => setSelectedSentiment(selectedSentiment === "against" ? null : "against")}
                        className={`flex-1 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            selectedSentiment === "against" ? "bg-red-500 text-white shadow-md" : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                        title="Against"
                    >
                        <ThumbsDown className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            <VoterDetailsBottomSheet
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                voter={voter}
                onSave={(data) => {
                    console.log("Voter details saved:", data);
                    setIsDetailsOpen(false);
                }}
            />
        </>
    );
}
