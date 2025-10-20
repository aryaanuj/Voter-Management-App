"use client"

import { Plus } from "lucide-react"

interface FeaturedCardProps {
  title: string
  subtitle: string
  days?: number
  avatars?: string[]
  gradient?: string
}

export function FeaturedCard({
  title,
  subtitle,
  days = 24,
  avatars = [],
  gradient = "bg-gradient-to-br from-violet-500 via-violet-600 to-purple-600",
}: FeaturedCardProps) {
  return (
    <div className={`${gradient} rounded-3xl p-6 text-white relative overflow-hidden mb-6 shadow-lg`}>
      {/* Decorative elements */}
      <div className="absolute top-4 right-6 text-3xl opacity-30">☁️</div>
      <div className="absolute bottom-4 right-8 text-2xl opacity-20">✨</div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs font-semibold opacity-90 mb-1">ACHIEVEMENT</p>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-sm opacity-90">{subtitle}</p>
            {days && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-2xl font-bold">{days}</span>
                <span className="text-xs opacity-90">days</span>
              </div>
            )}
          </div>

          {/* Avatar Circle */}
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center text-2xl">
              👤
            </div>
          </div>
        </div>

        {/* Avatars Row */}
        {avatars.length > 0 && (
          <div className="flex items-center gap-2 mt-4">
            {avatars.map((avatar, idx) => (
              <div
                key={idx}
                className="w-8 h-8 rounded-full bg-white/30 border border-white/50 flex items-center justify-center text-xs"
              >
                {avatar}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plus button */}
      <button className="absolute bottom-4 left-6 bg-white/20 hover:bg-white/30 transition rounded-full p-2 backdrop-blur-sm">
        <Plus className="h-4 w-4 text-white" />
      </button>
    </div>
  )
}
