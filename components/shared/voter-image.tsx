"use client";

import { useImageUrl } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

interface VoterImageProps {
    filePath?: string;
    alt: string;
    className?: string;
    fallbackSrc?: string;
    expiryMinutes?: number;
}

export function VoterImage({ filePath, alt, className = "", fallbackSrc = "/placeholder.svg?height=56&width=56&query=voter profile", expiryMinutes = 60 }: VoterImageProps) {
    const { data: imageUrl, isLoading, error } = useImageUrl(filePath, expiryMinutes);

    // Show loading state
    if (isLoading && filePath) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
        );
    }

    // Show fallback image if no file path, error, or failed to load
    const src = imageUrl || fallbackSrc;

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={(e) => {
                // Fallback to placeholder if image fails to load
                if (e.currentTarget.src !== fallbackSrc) {
                    e.currentTarget.src = fallbackSrc;
                }
            }}
        />
    );
}
