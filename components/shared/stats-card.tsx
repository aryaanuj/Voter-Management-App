"use client"

import React from "react"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  gradient: string
  textColor: string
  iconBg: string
}

export function StatsCard({ title, value, subtitle, icon, gradient, textColor, iconBg }: StatsCardProps) {
  return (
    <div className={`${gradient} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-white/80 uppercase tracking-wide">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</p>
          {subtitle && <p className="text-xs text-white/70 mt-2">{subtitle}</p>}
        </div>
        <div className={`${iconBg} p-3 rounded-xl flex-shrink-0`}>{icon}</div>
      </div>
    </div>
  )
}
