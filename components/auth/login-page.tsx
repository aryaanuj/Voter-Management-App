"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Phone, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/providers";
import { useSendOtp, useVerifyOtp } from "@/lib/hooks";
import { UserRole } from "@/lib/types";
import { toast } from "sonner";

interface LoginPageProps {
    onLogin?: (role: UserRole, name: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
    const [step, setStep] = useState<"role" | "phone" | "otp">("role");
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    const { login } = useAuth();
    const sendOtpMutation = useSendOtp();
    const verifyOtpMutation = useVerifyOtp();

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        setStep("phone");
    };

    const handlePhoneSubmit = async () => {
        if (phone.length === 10) {
            try {
                await sendOtpMutation.mutateAsync({ mobile: phone });
                setStep("otp");
                toast.success("OTP sent successfully");
            } catch (error) {
                toast.error("Failed to send OTP");
            }
        }
    };

    const handleOtpSubmit = async () => {
        if (otp.length === 6) {
            try {
                const response = await verifyOtpMutation.mutateAsync({
                    mobile: phone,
                    otp: otp,
                });

                login(response.accessToken, response.refreshToken, response.user);
                toast.success("Login successful");
                onLogin?.(response.user.role, response.user.name);
            } catch (error) {
                toast.error("Invalid OTP");
            }
        }
    };

    const getRoleLabel = (role: UserRole) => {
        const labels: Record<UserRole, string> = {
            [UserRole.ADMIN]: "Administrator",
            [UserRole.BOOTH_MANAGER]: "Booth Manager",
            [UserRole.CANDIDATE]: "Candidate",
        };
        return labels[role] || role;
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-violet-500 to-violet-600 rounded-2xl mb-4 shadow-lg">
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
                                    onClick={() => handleRoleSelect(UserRole.ADMIN)}
                                    className="w-full group relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-50 to-violet-100 p-4 border-2 border-violet-200 hover:border-violet-500 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
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
                                    onClick={() => handleRoleSelect(UserRole.BOOTH_MANAGER)}
                                    className="w-full group relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-50 to-violet-100 p-4 border-2 border-violet-200 hover:border-violet-500 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
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
                                    onClick={() => handleRoleSelect(UserRole.CANDIDATE)}
                                    className="w-full group relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-50 to-violet-100 p-4 border-2 border-violet-200 hover:border-violet-500 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-900">Candidate</p>
                                            <p className="text-xs text-gray-600">Campaign management</p>
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
                                    disabled={phone.length !== 10 || sendOtpMutation.isPending}
                                    className="w-full h-12 bg-linear-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sendOtpMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send OTP
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </>
                                    )}
                                </Button>

                                <Button onClick={() => setStep("role")} variant="ghost" className="w-full h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl">
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
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                                        maxLength={6}
                                        className="h-12 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-violet-500 text-base tracking-widest text-center"
                                    />
                                </div>

                                <Button
                                    onClick={handleOtpSubmit}
                                    disabled={otp.length !== 6 || verifyOtpMutation.isPending}
                                    className="w-full h-12 bg-linear-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {verifyOtpMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            Verify & Login
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </>
                                    )}
                                </Button>

                                <Button onClick={() => setStep("phone")} variant="ghost" className="w-full h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl">
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
    );
}
