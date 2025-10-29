"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface Tab {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface UnifiedTabsProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    tabs: Tab[];
    children: ReactNode;
}

export function UnifiedTabs({ activeTab, onTabChange, tabs, children }: UnifiedTabsProps) {
    return (
        <div className="relative">
            {/* Tab Content */}
            <div className="pb-20">{children}</div>

            {/* Bottom Tab Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-violet-100 shadow-2xl">
                <div className="max-w-7xl mx-auto px-2">
                    <div className="flex items-end justify-around h-20">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button key={tab.id} onClick={() => onTabChange(tab.id)} className="relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 group">
                                    {isActive && (
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-linear-to-br from-violet-600 to-violet-700 rounded-full flex items-center justify-center shadow-lg ring-3 ring-white">
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                    )}

                                    {/* Inactive Tab Icon */}
                                    {!isActive && <Icon className="h-5 w-5 text-gray-400 group-hover:text-violet-600 transition-colors mb-0.5" />}

                                    <span className={`text-xs font-medium mt-0.5 transition-colors ${isActive ? "text-violet-600" : "text-gray-500 group-hover:text-violet-600"}`}>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
