"use client"

import { useState } from "react"
import { LoginPage } from "@/components/auth/login-page"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { BoothManagerDashboard } from "@/components/dashboards/booth-manager-dashboard"
import { MemberDashboard } from "@/components/dashboards/member-dashboard"

type UserRole = "admin" | "booth-manager" | "member" | null

export default function Home() {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [userName, setUserName] = useState("")

  const handleLogin = (role: UserRole, name: string) => {
    setUserRole(role)
    setUserName(name)
  }

  const handleLogout = () => {
    setUserRole(null)
    setUserName("")
  }

  if (!userRole) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-background">
      {userRole === "admin" && <AdminDashboard userName={userName} onLogout={handleLogout} />}
      {userRole === "booth-manager" && <BoothManagerDashboard userName={userName} onLogout={handleLogout} />}
      {userRole === "member" && <MemberDashboard userName={userName} onLogout={handleLogout} />}
    </div>
  )
}
