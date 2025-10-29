"use client";

import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardNavbarProps {
    userName: string;
    userRole: string;
    onLogout: () => void;
}

export function DashboardNavbar({ userName, userRole, onLogout }: DashboardNavbarProps) {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <header className="bg-white sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">{getGreeting()}</p>
                        <h1 className="text-xl font-bold text-black bg-clip-text ">Welcome Back, {userName}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="relative hover:bg-violet-100 transition h-8 w-8">
                            <Bell className="h-4 w-4 text-violet-600" />
                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                        </Button>
                        <Button onClick={onLogout} variant="ghost" size="icon" className="text-violet-600 hover:bg-violet-100 transition h-8 w-8" title="Logout">
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
