"use client";

import type { ReactNode } from "react";
import { Users, CheckSquare, User } from "lucide-react";

interface AndroidTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    children: ReactNode;
}

export function AndroidTabs({ activeTab, onTabChange, children }: AndroidTabsProps) {
    const tabs = [
        { id: "voters", label: "Voters", icon: Users },
        { id: "tasks", label: "Tasks", icon: CheckSquare },
        { id: "profile", label: "Profile", icon: User },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Tab Content */}
            <div className="flex-1 overflow-auto">{children}</div>

            {/* Android-style Bottom Tab Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-violet-100 shadow-2xl">
                <div className="flex items-center justify-around max-w-7xl mx-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`flex-1 flex flex-col items-center justify-center py-4 px-3 transition-all duration-300 relative group ${
                                    isActive ? "text-violet-600" : "text-muted-foreground hover:text-violet-500"
                                }`}
                            >
                                {/* Active indicator */}
                                {isActive && <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-violet-600 to-violet-400" />}

                                {/* Icon with ripple effect */}
                                <div className={`relative p-2 rounded-lg transition-all ${isActive ? "bg-violet-100 scale-110" : "group-hover:bg-violet-50"}`}>
                                    <Icon className="h-6 w-6" />
                                </div>

                                {/* Label */}
                                <span className={`text-xs font-semibold mt-1 transition-all ${isActive ? "text-violet-600" : "text-muted-foreground"}`}>{tab.label}</span>

                                {/* Ripple animation on active */}
                                {isActive && <div className="absolute inset-0 rounded-lg bg-violet-600 opacity-0 animate-pulse" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Spacer for fixed tab bar */}
            <div className="h-20" />
        </div>
    );
}
