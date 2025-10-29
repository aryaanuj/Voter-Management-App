"use client";

import { useState } from "react";
import { UnifiedTabs } from "@/components/shared/unified-tabs";
import { LayoutGrid, MapPin, Users, BarChart3, User, Activity } from "lucide-react";
import { VoterListTab } from "@/components/booth-manager/voter-list-tab";
import { SentimentBreakdown } from "@/components/booth-manager/sentiment-breakdown";
import { ProfilePage } from "@/components/shared/profile-page";
import { StatsCard } from "@/components/shared/stats-card";
import { MapIcon, UsersIcon, CheckIcon } from "@/components/shared/svg-icons";
import { DashboardNavbar } from "@/components/shared/dashboard-navbar";
import { FeaturedCard } from "@/components/shared/featured-card";
import { BoothTab } from "@/components/booth-manager/booth-tab";
import { AnalyticsTab } from "@/components/booth-manager/analytics-tab";
import { BoothActivityTab } from "@/components/booth-manager/booth-activity-tab";
import { useAuth } from "@/lib/providers";
import { useDashboardStats } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

interface BoothManagerDashboardProps {
    userName: string;
    onLogout?: () => void;
}

export function BoothManagerDashboard({ userName, onLogout }: BoothManagerDashboardProps) {
    const [activeTab, setActiveTab] = useState("dashboard");
    const { logout } = useAuth();
    const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();

    const handleLogout = () => {
        logout();
        onLogout?.();
    };

    const boothManagerTabs = [
        { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
        { id: "booth", label: "Booth", icon: MapPin },
        { id: "voters", label: "Voters", icon: Users },
        { id: "activities", label: "Activities", icon: Activity },
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "profile", label: "Profile", icon: User },
    ];

    return (
        <div className="min-h-screen bg-background">
            <DashboardNavbar userName={userName} userRole="Booth Manager" onLogout={handleLogout} />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <UnifiedTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={boothManagerTabs}>
                    {activeTab === "dashboard" && (
                        <>
                            {statsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                </div>
                            ) : (
                                <>
                                    <FeaturedCard title="Great job!" subtitle={`You have ${dashboardStats?.voters?.verifiedMobile || 0} verified voters`} days={24} />

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
                                            title="Total Voters"
                                            value={dashboardStats?.voters?.total?.toString() || "0"}
                                            subtitle="In your booth"
                                            icon={<UsersIcon />}
                                            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                                            textColor="text-white"
                                            iconBg="bg-white/20"
                                        />
                                        <StatsCard
                                            title="Verified Contacts"
                                            value={dashboardStats?.voters?.verifiedMobile?.toString() || "0"}
                                            subtitle={`${dashboardStats?.voters?.mobileVerificationPercentage?.toFixed(1) || "0"}% verified`}
                                            icon={<CheckIcon />}
                                            gradient="bg-gradient-to-br from-green-500 to-green-600"
                                            textColor="text-white"
                                            iconBg="bg-white/20"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                                            title="Against"
                                            value={dashboardStats?.voters?.against?.toString() || "0"}
                                            subtitle={`${dashboardStats?.voters?.againstPercentage?.toFixed(1) || "0"}%`}
                                            icon={<UsersIcon />}
                                            gradient="bg-gradient-to-br from-red-500 to-red-600"
                                            textColor="text-white"
                                            iconBg="bg-white/20"
                                        />
                                        <StatsCard
                                            title="Neutral"
                                            value={dashboardStats?.voters?.neutral?.toString() || "0"}
                                            subtitle={`${dashboardStats?.voters?.neutralPercentage?.toFixed(1) || "0"}%`}
                                            icon={<MapIcon />}
                                            gradient="bg-gradient-to-br from-gray-500 to-gray-600"
                                            textColor="text-white"
                                            iconBg="bg-white/20"
                                        />
                                    </div>
                                </>
                            )}

                            <SentimentBreakdown />
                        </>
                    )}

                    {/* Booth Tab */}
                    {activeTab === "booth" && <BoothTab />}

                    {/* Voters Tab */}
                    {activeTab === "voters" && <VoterListTab />}

                    {/* Activities Tab */}
                    {activeTab === "activities" && <BoothActivityTab />}

                    {/* Analytics Tab */}
                    {activeTab === "analytics" && <AnalyticsTab />}

                    {/* Profile Tab */}
                    {activeTab === "profile" && <ProfilePage userName={userName} userRole="booth-manager" />}
                </UnifiedTabs>
            </main>
        </div>
    );
}
