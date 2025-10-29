"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, LogOut, Bell, User, BarChart3 } from "lucide-react";
import { MemberVoterListTab } from "@/components/member/member-voter-list-tab";
import { MemberTasksTab } from "@/components/member/member-tasks-tab";
import { UnifiedTabs } from "@/components/shared/unified-tabs";
import { ProfilePage } from "@/components/shared/profile-page";
import { StatsCard } from "@/components/shared/stats-card";
import { MapIcon, UsersIcon, CameraIcon } from "@/components/shared/svg-icons";
import { DashboardNavbar } from "@/components/shared/dashboard-navbar";
import { FeaturedCard } from "@/components/shared/featured-card";
import { useAuth } from "@/lib/providers";
import { useDashboardStats } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

interface MemberDashboardProps {
    userName: string;
    onLogout?: () => void;
}

export function MemberDashboard({ userName, onLogout }: MemberDashboardProps) {
    const [activeTab, setActiveTab] = useState("dashboard");
    const { logout } = useAuth();
    const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();

    const handleLogout = () => {
        logout();
        onLogout?.();
    };

    const memberTabs = [
        { id: "dashboard", label: "Dashboard", icon: BarChart3 },
        { id: "voters", label: "Voters", icon: Users },
        { id: "tasks", label: "Tasks", icon: MapPin },
        { id: "profile", label: "Profile", icon: User },
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-white via-violet-50 to-white">
            <DashboardNavbar userName={userName} userRole="Member" onLogout={handleLogout} />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-4 pb-32">
                <UnifiedTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={memberTabs}>
                    {activeTab === "dashboard" && (
                        <>
                            {statsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                </div>
                            ) : (
                                <>
                                    <FeaturedCard title="Great job!" subtitle={`You have verified ${dashboardStats?.voters?.verifiedMobile || 0} voters`} days={24} />

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
                                            value={dashboardStats?.voters?.verifiedMobile?.toString() || "0"}
                                            subtitle={`Out of ${dashboardStats?.voters?.total || 0}`}
                                            icon={<UsersIcon />}
                                            gradient="bg-gradient-to-br from-green-500 to-green-600"
                                            textColor="text-white"
                                            iconBg="bg-white/20"
                                        />
                                        <StatsCard
                                            title="Photos Uploaded"
                                            value={dashboardStats?.voters?.withPhoto?.toString() || "0"}
                                            subtitle="With GPS data"
                                            icon={<CameraIcon />}
                                            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                                            textColor="text-white"
                                            iconBg="bg-white/20"
                                        />
                                    </div>
                                </>
                            )}

                            <Card className="border-violet-200 bg-white">
                                <CardHeader>
                                    <CardTitle className="text-violet-600">Overview</CardTitle>
                                    <CardDescription>Your booth and voter management summary</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="border border-violet-200 rounded-xl p-4 bg-linear-to-r from-violet-50 to-white">
                                            <h3 className="font-semibold text-foreground">Quick Stats</h3>
                                            <p className="text-sm text-muted-foreground mt-2">
                                                You have verified {dashboardStats?.voters?.verifiedMobile || 0} voters and uploaded {dashboardStats?.voters?.withPhoto || 0} photos with GPS location
                                                data.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {activeTab === "voters" && (
                        <div className="mb-8">
                            <MemberVoterListTab />
                        </div>
                    )}

                    {activeTab === "tasks" && (
                        <div className="mb-8">
                            <MemberTasksTab />
                        </div>
                    )}

                    {activeTab === "profile" && <ProfilePage userName={userName} userRole="member" />}
                </UnifiedTabs>
            </main>
        </div>
    );
}
