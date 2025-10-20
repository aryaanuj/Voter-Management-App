"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Phone, CheckCircle } from "lucide-react"

interface OTPVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  phoneNumber: string
  onVerify: (otp: string) => void
}

export function OTPVerificationModal({ isOpen, onClose, phoneNumber, onVerify }: OTPVerificationModalProps) {
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"phone" | "otp" | "verified">("phone")
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)

  const handleSendOTP = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setStep("otp")
      setTimer(60)
      setLoading(false)
    }, 1000)
  }

  const handleVerifyOTP = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setStep("verified")
      onVerify(otp)
      setLoading(false)
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 space-y-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-violet-50 rounded-full transition">
          <X className="h-5 w-5 text-foreground" />
        </button>

        {step === "phone" && (
          <>
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-violet-100 rounded-full">
                  <Phone className="h-6 w-6 text-violet-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Verify Phone Number</h2>
              <p className="text-muted-foreground">We'll send an OTP to verify your number</p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground block">Phone Number</label>
              <Input
                type="tel"
                value={phoneNumber}
                disabled
                className="py-3 text-base bg-violet-50 border-violet-200"
              />
            </div>

            <Button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full py-3 text-base font-semibold bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-lg"
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Enter OTP</h2>
              <p className="text-muted-foreground">Enter the 6-digit code sent to {phoneNumber}</p>
            </div>

            <div className="space-y-3">
              <Input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                maxLength={6}
                className="py-3 text-center text-2xl tracking-widest font-bold border-violet-200"
              />
              {timer > 0 && <p className="text-sm text-muted-foreground text-center">Resend OTP in {timer}s</p>}
            </div>

            <Button
              onClick={handleVerifyOTP}
              disabled={otp.length !== 6 || loading}
              className="w-full py-3 text-base font-semibold bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-lg disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </>
        )}

        {step === "verified" && (
          <>
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Verified Successfully</h2>
              <p className="text-muted-foreground">Your phone number has been verified</p>
            </div>

            <Button
              onClick={onClose}
              className="w-full py-3 text-base font-semibold bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-lg"
            >
              Done
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
