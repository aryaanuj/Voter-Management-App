"use client"

import { useState } from "react"
import { UnifiedTabs } from "@/components/shared/unified-tabs"
import { LayoutGrid, MapPin, Users, BarChart3, User } from "lucide-react"
import { VoterListTab } from "@/components/booth-manager/voter-list-tab"
import { SentimentBreakdown } from "@/components/booth-manager/sentiment-breakdown"
import { ProfilePage } from "@/components/shared/profile-page"
import { StatsCard } from "@/components/shared/stats-card"
import { MapIcon, UsersIcon, CheckIcon } from "@/components/shared/svg-icons"
import { DashboardNavbar } from "@/components/shared/dashboard-navbar"
import { FeaturedCard } from "@/components/shared/featured-card"
import { BoothTab } from "@/components/booth-manager/booth-tab"
import { AnalyticsTab } from "@/components/booth-manager/analytics-tab"

interface BoothManagerDashboardProps {
  userName: string
  onLogout: () => void
}

export function BoothManagerDashboard({ userName, onLogout }: BoothManagerDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  const boothManagerTabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "booth", label: "Booth", icon: MapPin },
    { id: "voters", label: "Voters", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "profile", label: "Profile", icon: User },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar userName={userName} userRole="Booth Manager" onLogout={onLogout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <UnifiedTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={boothManagerTabs}>
          {activeTab === "dashboard" && (
            <>
              <FeaturedCard title="Great job!" subtitle="You have verified 2740 voters" days={24} />

              <div className="mb-8">
                <StatsCard
                  title="Assigned Booths"
                  value="2/4 Active"
                  subtitle="50% completion"
                  icon={<MapIcon />}
                  gradient="bg-gradient-to-br from-violet-600 to-violet-700"
                  textColor="text-white"
                  iconBg="bg-white/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <StatsCard
                  title="Total Registered"
                  value="4430"
                  subtitle="All voters"
                  icon={<UsersIcon />}
                  gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                  textColor="text-white"
                  iconBg="bg-white/20"
                />
                <StatsCard
                  title="Verified Contacts"
                  value="2740"
                  subtitle="61.8% verified"
                  icon={<CheckIcon />}
                  gradient="bg-gradient-to-br from-green-500 to-green-600"
                  textColor="text-white"
                  iconBg="bg-white/20"
                />
              </div>

              <SentimentBreakdown />
            </>
          )}

          {/* Booth Tab */}
          {activeTab === "booth" && <BoothTab />}

          {/* Voters Tab */}
          {activeTab === "voters" && <VoterListTab />}

          {/* Analytics Tab */}
          {activeTab === "analytics" && <AnalyticsTab />}

          {/* Profile Tab */}
          {activeTab === "profile" && <ProfilePage userName={userName} userRole="booth-manager" />}
        </UnifiedTabs>
      </main>
    </div>
  )
}
