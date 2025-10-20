"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MapPin, LogOut, Bell, User, BarChart3 } from 'lucide-react'
import { VoterListTab } from "@/components/booth-manager/voter-list-tab"
import { UnifiedTabs } from "@/components/shared/unified-tabs"
import { ProfilePage } from "@/components/shared/profile-page"
import { StatsCard } from "@/components/shared/stats-card"
import { MapIcon, UsersIcon, CameraIcon } from "@/components/shared/svg-icons"
import { DashboardNavbar } from "@/components/shared/dashboard-navbar"
import { FeaturedCard } from "@/components/shared/featured-card"

interface MemberDashboardProps {
  userName: string
  onLogout: () => void
}

export function MemberDashboard({ userName, onLogout }: MemberDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  const memberTabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "voters", label: "Voters", icon: Users },
    { id: "tasks", label: "Tasks", icon: MapPin },
    { id: "profile", label: "Profile", icon: User },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-violet-50 to-white">
      <DashboardNavbar userName={userName} userRole="Member" onLogout={onLogout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        <UnifiedTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={memberTabs}>
          {activeTab === "dashboard" && (
            <>
              <FeaturedCard
                title="Great job!"
                subtitle="You have verified 245 voters"
                days={24}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatsCard
                  title="Assigned Booth"
                  value="Booth A-01"
                  subtitle="Active"
                  icon={<MapIcon />}
                  gradient="bg-gradient-to-br from-violet-500 to-violet-600"
                  textColor="text-white"
                  iconBg="bg-white/20"
                />
                <StatsCard
                  title="Voters Verified"
                  value="245"
                  subtitle="Out of 500"
                  icon={<UsersIcon />}
                  gradient="bg-gradient-to-br from-green-500 to-green-600"
                  textColor="text-white"
                  iconBg="bg-white/20"
                />
                <StatsCard
                  title="Photos Uploaded"
                  value="89"
                  subtitle="With GPS data"
                  icon={<CameraIcon />}
                  gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                  textColor="text-white"
                  iconBg="bg-white/20"
                />
              </div>

              <Card className="border-violet-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-violet-600">Overview</CardTitle>
                  <CardDescription>Your booth and voter management summary</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border border-violet-200 rounded-xl p-4 bg-gradient-to-r from-violet-50 to-white">
                      <h3 className="font-semibold text-foreground">Quick Stats</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        You have verified 245 voters and uploaded 89 photos with GPS location data.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "voters" && (
            <div className="mb-8">
              <VoterListTab />
            </div>
          )}

          {activeTab === "tasks" && (
            <Card className="border-violet-200 bg-white">
              <CardHeader>
                <CardTitle className="text-violet-600">Tasks</CardTitle>
                <CardDescription>Your assigned tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border border-violet-200 rounded-xl p-4 bg-gradient-to-r from-violet-50 to-white hover:shadow-md transition">
                    <h3 className="font-bold text-foreground">Verify Voter Contacts</h3>
                    <p className="text-sm text-muted-foreground mt-1">Verify phone numbers for 50 voters</p>
                    <div className="mt-3 bg-violet-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-violet-600 to-violet-400 h-full transition-all"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                    <p className="text-xs text-violet-600 font-semibold mt-2">65% Complete</p>
                  </div>
                  <div className="border border-violet-200 rounded-xl p-4 bg-gradient-to-r from-violet-50 to-white hover:shadow-md transition">
                    <h3 className="font-bold text-foreground">Collect Voter Photos</h3>
                    <p className="text-sm text-muted-foreground mt-1">Collect photos with GPS location</p>
                    <div className="mt-3 bg-violet-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-violet-600 to-violet-400 h-full transition-all"
                        style={{ width: "40%" }}
                      ></div>
                    </div>
                    <p className="text-xs text-violet-600 font-semibold mt-2">40% Complete</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "profile" && <ProfilePage userName={userName} userRole="member" />}
        </UnifiedTabs>
      </main>
    </div>
  )
}
