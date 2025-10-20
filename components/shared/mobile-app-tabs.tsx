"use client"

import type { ReactNode } from "react"

interface MobileAppTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  tabs: Array<{
    id: string
    label: string
    icon: any
  }>
  children: ReactNode
}

export function MobileAppTabs({ activeTab, onTabChange, tabs, children }: MobileAppTabsProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Tab Content */}
      <div className="flex-1 overflow-auto pb-40">{children}</div>

      {/* Fixed Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="flex justify-center items-end px-4 py-4 bg-white rounded-t-3xl shadow-2xl mx-4 mb-4">
          {tabs.map((tab, index) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <div key={tab.id} className="flex-1 flex justify-center">
                {isActive ? (
                  <div className="relative flex flex-col items-center">
                    <div className="absolute -top-8 w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => onTabChange(tab.id)}
                    className="flex flex-col items-center justify-center gap-1 p-2 transition-colors duration-200 hover:text-violet-500"
                  >
                    <Icon className="h-6 w-6 text-gray-400" />
                    <span className="text-xs text-gray-400 font-medium">{tab.label}</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Spacer for fixed tab bar */}
      <div className="h-40" />
    </div>
  )
}
