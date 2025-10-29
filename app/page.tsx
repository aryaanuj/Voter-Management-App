"use client";

import { useAuth } from "@/lib/providers";
import { LoginPage } from "@/components/auth/login-page";
import { AdminDashboard } from "@/components/dashboards/admin-dashboard";
import { BoothManagerDashboard } from "@/components/dashboards/booth-manager-dashboard";
import { MemberDashboard } from "@/components/dashboards/member-dashboard";
import { UserRole } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function Home() {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <LoginPage />;
    }

    const renderDashboard = () => {
        switch (user.role) {
            case UserRole.ADMIN:
                return <AdminDashboard userName={user.name} onLogout={() => {}} />;
            case UserRole.BOOTH_MANAGER:
                return <BoothManagerDashboard userName={user.name} onLogout={() => {}} />;
            case UserRole.CANDIDATE:
                return <MemberDashboard userName={user.name} onLogout={() => {}} />;
            default:
                return <LoginPage />;
        }
    };

    return <div className="min-h-screen bg-background">{renderDashboard()}</div>;
}
