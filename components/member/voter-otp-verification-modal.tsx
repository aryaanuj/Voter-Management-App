"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface VoterOTPVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    phoneNumber: string;
    onVerify: (otp: string) => void;
    voterId: string;
    isVerifying?: boolean;
}

export function VoterOTPVerificationModal({ isOpen, onClose, phoneNumber, onVerify, voterId, isVerifying = false }: VoterOTPVerificationModalProps) {
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(60);
    const [isMounted, setIsMounted] = useState(false);

    // Ensure component is mounted before making API calls
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Timer countdown
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(timer - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            onVerify(otp);
        } catch (error) {
            toast.error("Invalid OTP. Please try again.");
        }
    };

    const handleClose = () => {
        setOtp("");
        setTimer(60);
        onClose();
    };

    if (!isOpen || !isMounted) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-foreground">Verify Mobile Number</h1>
                    <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 hover:bg-gray-100">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
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
                    {timer > 0 && <p className="text-sm text-muted-foreground text-center">OTP expires in {timer}s</p>}
                </div>

                <Button
                    onClick={handleVerifyOTP}
                    disabled={otp.length !== 6 || isVerifying}
                    className="w-full py-3 text-base font-semibold bg-linear-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-lg disabled:opacity-50"
                >
                    {isVerifying ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        "Verify OTP"
                    )}
                </Button>
            </div>
        </div>
    );
}
