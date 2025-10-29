"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UnifiedTabs } from "@/components/shared/unified-tabs";
import { LayoutGrid, Users, MapPin, BarChart3, User, UserCheck, Building2 } from "lucide-react";
import { UserManagementTab } from "@/components/admin/user-management-tab";
import { BoothOverviewTab } from "@/components/admin/booth-overview-tab";
import { ReportsTab } from "@/components/admin/reports-tab";
import { VoterListTab } from "@/components/admin/voter-list-tab";
import { ProfilePage } from "@/components/shared/profile-page";
import { DistrictManagementTab } from "@/components/admin/district-management";
import { StatsCard } from "@/components/shared/stats-card";
import { UsersIcon, BoothIcon, CheckIcon, BarChartIcon } from "@/components/shared/svg-icons";
import { DashboardNavbar } from "@/components/shared/dashboard-navbar";
import { FeaturedCard } from "@/components/shared/featured-card";
import { useAuth } from "@/lib/providers";
import { useDashboardStats, useVoterStats } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

interface AdminDashboardProps {
    userName: string;
    onLogout?: () => void;
}

export function AdminDashboard({ userName, onLogout }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState("dashboard");
    const { logout } = useAuth();
    const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();
    const { data: voterStats } = useVoterStats();

    const handleLogout = () => {
        logout();
        onLogout?.();
    };

    const adminTabs = [
        { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
        { id: "users", label: "Users", icon: Users },
        { id: "voters", label: "Voters", icon: UserCheck },
        { id: "districts", label: "Districts", icon: Building2 },
        { id: "booths", label: "Booths", icon: MapPin },
        { id: "reports", label: "Reports", icon: BarChart3 },
        { id: "profile", label: "Profile", icon: User },
    ];

    return (
        <div className="min-h-screen bg-background">
            <DashboardNavbar userName={userName} userRole="Admin" onLogout={handleLogout} />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <UnifiedTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={adminTabs}>
                    {activeTab === "dashboard" && (
                        <>
                            {statsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                </div>
                            ) : (
                                <>
                                    <FeaturedCard title="Great job!" subtitle={`You have ${dashboardStats?.voters?.total || 0} total voters in your constituency`} days={24} />

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                        <StatsCard
                                            title="Total Voters"
                                            value={dashboardStats?.voters?.total?.toString() || "0"}
                                            subtitle="Registered"
                                            icon={<UsersIcon />}
                                            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                                            textColor="text-white"
                                            iconBg="bg-white/20"
                                        />
                                        <StatsCard
                                            title="In Favour"
                                            value={dashboardStats?.voters?.favour?.toString() || "0"}
                                            subtitle={`${dashboardStats?.voters?.favourPercentage?.toFixed(1) || "0"}%`}
                                            icon={<CheckIcon />}
                                            gradient="bg-gradient-to-br from-green-500 to-green-600"
                                            textColor="text-white"
                                            iconBg="bg-white/20"
                                        />
                                        <StatsCard
                                            title="Mobile Verified"
                                            value={dashboardStats?.voters?.verifiedMobile?.toString() || "0"}
                                            subtitle={`${dashboardStats?.voters?.mobileVerificationPercentage?.toFixed(1) || "0"}%`}
                                            icon={<BarChartIcon />}
                                            gradient="bg-gradient-to-br from-violet-500 to-violet-600"
                                            textColor="text-white"
                                            iconBg="bg-white/20"
                                        />
                                        <StatsCard
                                            title="Photos Uploaded"
                                            value={dashboardStats?.voters?.withPhoto?.toString() || "0"}
                                            subtitle={`${dashboardStats?.voters?.photoUploadPercentage?.toFixed(1) || "0"}%`}
                                            icon={<BoothIcon />}
                                            gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                                            textColor="text-white"
                                            iconBg="bg-white/20"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>User Management</CardTitle>
                                        <CardDescription>{dashboardStats?.totalUsers || 0} Total</CardDescription>
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
                                                <p className="text-3xl font-bold text-primary">{(dashboardStats?.totalUsers || 0) - 30}</p>
                                                <p className="text-sm text-muted-foreground mt-2">Candidates</p>
                                            </div>
                                        </div>
                                        <Button className="w-full mt-6 bg-primary hover:bg-primary/90">Manage Users</Button>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Voter Statistics</CardTitle>
                                        <CardDescription>{dashboardStats?.voters?.total || 0} Total Voters</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-green-50 p-6 rounded-lg text-center">
                                                <p className="text-3xl font-bold text-green-600">{dashboardStats?.voters?.favour || 0}</p>
                                                <p className="text-sm text-muted-foreground mt-2">In Favour</p>
                                                <p className="text-xs text-green-600 mt-1">{dashboardStats?.voters?.favourPercentage?.toFixed(1) || "0"}%</p>
                                            </div>
                                            <div className="bg-red-50 p-6 rounded-lg text-center">
                                                <p className="text-3xl font-bold text-red-600">{dashboardStats?.voters?.against || 0}</p>
                                                <p className="text-sm text-muted-foreground mt-2">Against</p>
                                                <p className="text-xs text-red-600 mt-1">{dashboardStats?.voters?.againstPercentage?.toFixed(1) || "0"}%</p>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg text-center">
                                                <p className="text-3xl font-bold text-gray-600">{dashboardStats?.voters?.neutral || 0}</p>
                                                <p className="text-sm text-muted-foreground mt-2">Neutral</p>
                                                <p className="text-xs text-gray-600 mt-1">{dashboardStats?.voters?.neutralPercentage?.toFixed(1) || "0"}%</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                                <p className="text-2xl font-bold text-blue-600">{dashboardStats?.voters?.verifiedMobile || 0}</p>
                                                <p className="text-sm text-muted-foreground mt-1">Mobile Verified</p>
                                                <p className="text-xs text-blue-600 mt-1">{dashboardStats?.voters?.mobileVerificationPercentage?.toFixed(1) || "0"}%</p>
                                            </div>
                                            <div className="bg-purple-50 p-4 rounded-lg text-center">
                                                <p className="text-2xl font-bold text-purple-600">{dashboardStats?.voters?.withPhoto || 0}</p>
                                                <p className="text-sm text-muted-foreground mt-1">Photos Uploaded</p>
                                                <p className="text-xs text-purple-600 mt-1">{dashboardStats?.voters?.photoUploadPercentage?.toFixed(1) || "0"}%</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Activity Summary</CardTitle>
                                        <CardDescription>Recent booth activities</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-orange-50 p-6 rounded-lg text-center">
                                                <p className="text-3xl font-bold text-orange-600">{dashboardStats?.activities?.total || 0}</p>
                                                <p className="text-sm text-muted-foreground mt-2">Total Activities</p>
                                            </div>
                                            <div className="bg-indigo-50 p-6 rounded-lg text-center">
                                                <p className="text-3xl font-bold text-indigo-600">{dashboardStats?.activities?.today || 0}</p>
                                                <p className="text-sm text-muted-foreground mt-2">Today's Activities</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}

                    {/* Users Tab */}
                    {activeTab === "users" && <UserManagementTab />}

                    {/* Voters Tab */}
                    {activeTab === "voters" && <VoterListTab />}

                    {/* Districts Tab */}
                    {activeTab === "districts" && <DistrictManagementTab />}

                    {/* Booths Tab */}
                    {activeTab === "booths" && <BoothOverviewTab />}

                    {/* Reports Tab */}
                    {activeTab === "reports" && <ReportsTab />}

                    {/* Profile Tab */}
                    {activeTab === "profile" && <ProfilePage userName={userName} userRole="admin" />}
                </UnifiedTabs>
            </main>
        </div>
    );
}
