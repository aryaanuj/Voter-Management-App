"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Lock, Phone, CheckCircle2, ArrowRight } from "lucide-react"

interface LoginPageProps {
  onLogin: (role: "admin" | "booth-manager" | "member", name: string) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [step, setStep] = useState<"role" | "phone" | "otp">("role")
  const [selectedRole, setSelectedRole] = useState<"admin" | "booth-manager" | "member" | null>(null)
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [userName, setUserName] = useState("")

  const handleRoleSelect = (role: "admin" | "booth-manager" | "member") => {
    setSelectedRole(role)
    setStep("phone")
  }

  const handlePhoneSubmit = () => {
    if (phone.length === 10) {
      setStep("otp")
    }
  }

  const handleOtpSubmit = () => {
    if (otp.length === 4) {
      onLogin(selectedRole!, userName || "User")
    }
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Administrator",
      "booth-manager": "Booth Manager",
      member: "Member",
    }
    return labels[role] || role
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Voter Management</h1>
          <p className="text-gray-600 font-light">Secure authentication system</p>
        </div>

        {/* Main Card */}
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            {step === "role" && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-700 mb-6 uppercase tracking-wide">Select Your Role</p>

                {/* Role Buttons */}
                <button
                  onClick={() => handleRoleSelect("admin")}
                  className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 p-4 border-2 border-violet-200 hover:border-violet-500 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Administrator</p>
                      <p className="text-xs text-gray-600">Full system access</p>
                    </div>
                  </div>
                  <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => handleRoleSelect("booth-manager")}
                  className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 p-4 border-2 border-violet-200 hover:border-violet-500 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Booth Manager</p>
                      <p className="text-xs text-gray-600">Manage booth operations</p>
                    </div>
                  </div>
                  <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => handleRoleSelect("member")}
                  className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 p-4 border-2 border-violet-200 hover:border-violet-500 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Member</p>
                      <p className="text-xs text-gray-600">Limited access</p>
                    </div>
                  </div>
                  <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            )}

            {step === "phone" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-violet-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Enter Phone Number</p>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Logging in as <span className="font-semibold text-violet-600">{getRoleLabel(selectedRole!)}</span>
                  </p>
                  <Input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.slice(0, 10))}
                    maxLength={10}
                    className="h-12 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-violet-500 text-base"
                  />
                </div>

                <Button
                  onClick={handlePhoneSubmit}
                  disabled={phone.length !== 10}
                  className="w-full h-12 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send OTP
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>

                <Button
                  onClick={() => setStep("role")}
                  variant="ghost"
                  className="w-full h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
                >
                  Back
                </Button>
              </div>
            )}

            {step === "otp" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Verify OTP</p>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    OTP sent to <span className="font-semibold">+91 {phone}</span>
                  </p>
                  <Input
                    type="text"
                    placeholder="Enter 4-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 4))}
                    maxLength={4}
                    className="h-12 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-violet-500 text-base tracking-widest text-center"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Full Name</label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="h-12 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-violet-500 text-base"
                  />
                </div>

                <Button
                  onClick={handleOtpSubmit}
                  disabled={otp.length !== 4 || !userName}
                  className="w-full h-12 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify & Login
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>

                <Button
                  onClick={() => setStep("phone")}
                  variant="ghost"
                  className="w-full h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
                >
                  Back
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">Secure authentication powered by OTP verification</p>
      </div>
    </div>
  )
}
