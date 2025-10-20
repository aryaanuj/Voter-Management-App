"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UnifiedTabs } from "@/components/shared/unified-tabs"
import { LayoutGrid, Users, MapPin, BarChart3, User } from "lucide-react"
import { UserManagementTab } from "@/components/admin/user-management-tab"
import { BoothOverviewTab } from "@/components/admin/booth-overview-tab"
import { ReportsTab } from "@/components/admin/reports-tab"
import { ProfilePage } from "@/components/shared/profile-page"
import { StatsCard } from "@/components/shared/stats-card"
import { UsersIcon, BoothIcon, CheckIcon, BarChartIcon } from "@/components/shared/svg-icons"
import { DashboardNavbar } from "@/components/shared/dashboard-navbar"
import { FeaturedCard } from "@/components/shared/featured-card"

interface AdminDashboardProps {
  userName: string
  onLogout: () => void
}

export function AdminDashboard({ userName, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  const adminTabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "users", label: "Users", icon: Users },
    { id: "booths", label: "Booths", icon: MapPin },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "profile", label: "Profile", icon: User },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar userName={userName} userRole="Admin" onLogout={onLogout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <UnifiedTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={adminTabs}>
          {activeTab === "dashboard" && (
            <>
              <FeaturedCard title="Great job!" subtitle="You have been managing 150 booths" days={24} />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard
                  title="Total Users"
                  value="1247"
                  subtitle="↑ Active"
                  icon={<UsersIcon />}
                  gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                  textColor="text-white"
                  iconBg="bg-white/20"
                />
                <StatsCard
                  title="Total Booths"
                  value="150"
                  subtitle="95% Active"
                  icon={<BoothIcon />}
                  gradient="bg-gradient-to-br from-violet-500 to-violet-600"
                  textColor="text-white"
                  iconBg="bg-white/20"
                />
                <StatsCard
                  title="Active Booths"
                  value="142"
                  subtitle="94.7%"
                  icon={<CheckIcon />}
                  gradient="bg-gradient-to-br from-green-500 to-green-600"
                  textColor="text-white"
                  iconBg="bg-white/20"
                />
                <StatsCard
                  title="Inactive Booths"
                  value="8"
                  subtitle="5.3%"
                  icon={<BarChartIcon />}
                  gradient="bg-gradient-to-br from-red-500 to-red-600"
                  textColor="text-white"
                  iconBg="bg-white/20"
                />
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>1247 Total</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-6 rounded-lg text-center">
                        <p className="text-3xl font-bold text-primary">5</p>
                        <p className="text-sm text-muted-foreground mt-2">Admins</p>
                      </div>
                      <div className="bg-green-50 p-6 rounded-lg text-center">
                        <p className="text-3xl font-bold text-green-600">25</p>
                        <p className="text-sm text-muted-foreground mt-2">Managers</p>
                      </div>
                      <div className="bg-orange-50 p-6 rounded-lg text-center">
                        <p className="text-3xl font-bold text-primary">1217</p>
                        <p className="text-sm text-muted-foreground mt-2">Members</p>
                      </div>
                    </div>
                    <Button className="w-full mt-6 bg-primary hover:bg-primary/90">Manage Users</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Booth Overview</CardTitle>
                    <CardDescription>95% Active</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-6 rounded-lg text-center">
                        <p className="text-3xl font-bold text-primary">150</p>
                        <p className="text-sm text-muted-foreground mt-2">Total Booths</p>
                      </div>
                      <div className="bg-green-50 p-6 rounded-lg text-center">
                        <p className="text-3xl font-bold text-green-600">142</p>
                        <p className="text-sm text-muted-foreground mt-2">Active</p>
                      </div>
                      <div className="bg-red-50 p-6 rounded-lg text-center">
                        <p className="text-3xl font-bold text-red-600">8</p>
                        <p className="text-sm text-muted-foreground mt-2">Inactive</p>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                      <div className="text-red-600 mt-1">⚠</div>
                      <div>
                        <p className="text-sm font-medium text-red-900">8 booths have been inactive for &gt;30 days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Users Tab */}
          {activeTab === "users" && <UserManagementTab />}

          {/* Booths Tab */}
          {activeTab === "booths" && <BoothOverviewTab />}

          {/* Reports Tab */}
          {activeTab === "reports" && <ReportsTab />}

          {/* Profile Tab */}
          {activeTab === "profile" && <ProfilePage userName={userName} userRole="admin" />}
        </UnifiedTabs>
      </main>
    </div>
  )
}
