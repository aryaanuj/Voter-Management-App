"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Edit2, Save, X, Camera, Loader2 } from "lucide-react";
import { useGetProfile, useUpdateProfile, useUploadProfileImage } from "@/lib/hooks";
import { useImageUrl } from "@/lib/hooks";

interface ProfilePageProps {
    userName: string;
    userRole: "admin" | "booth-manager" | "member";
}

export function ProfilePage({ userName, userRole }: ProfilePageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: profileData, isLoading: profileLoading } = useGetProfile();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
    const { mutate: uploadProfileImage, isPending: isUploading } = useUploadProfileImage();

    const { data: profileImageUrl } = useImageUrl(profileData?.user?.profileImage);

    const [editData, setEditData] = useState({
        name: "",
        email: "",
        mobile: "",
    });

    const handleEdit = () => {
        if (profileData?.user) {
            setEditData({
                name: profileData.user.name,
                email: profileData.user.email || "",
                mobile: profileData.user.mobile,
            });
        }
        setIsEditing(true);
    };

    const handleSave = () => {
        updateProfile(editData, {
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleChange = (field: string, value: string) => {
        setEditData({ ...editData, [field]: value });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadProfileImage(file);
        }
    };

    const triggerImageUpload = () => {
        fileInputRef.current?.click();
    };

    if (profileLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const user = profileData?.user;
    const displayName = user?.name || userName;
    const displayEmail = user?.email || "No email provided";
    const displayMobile = user?.mobile || "No mobile provided";
    const displayRole = userRole === "admin" ? "Administrator" : userRole === "booth-manager" ? "Booth Manager" : "Member";

    return (
        <div className="space-y-6 pb-20">
            {/* Profile Header Card with Circular Image */}
            <Card className="border-0 bg-gradient-to-br from-violet-50 via-white to-violet-50 overflow-hidden shadow-lg">
                <CardContent className="pt-8 pb-8">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="w-32 h-32 bg-gradient-to-br from-violet-600 to-violet-700 rounded-full flex items-center justify-center shadow-xl border-4 border-white overflow-hidden">
                                {profileImageUrl ? <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" /> : <User className="h-16 w-16 text-white" />}
                            </div>
                            {isEditing && (
                                <button
                                    onClick={triggerImageUpload}
                                    disabled={isUploading}
                                    className="absolute bottom-0 right-0 bg-violet-600 hover:bg-violet-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
                                >
                                    {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                                </button>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </div>

                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-foreground">{displayName}</h2>
                            <p className="text-sm text-violet-600 font-semibold mt-2 bg-violet-100 px-4 py-1 rounded-full inline-block">{displayRole}</p>
                            <p className="text-xs text-muted-foreground mt-3">Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}</p>
                        </div>

                        {!isEditing && (
                            <Button onClick={handleEdit} className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-lg">
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="border-0 bg-white shadow-md">
                <CardHeader>
                    <CardTitle className="text-violet-600 text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="text-sm font-semibold text-foreground block mb-2">Full Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-all"
                                placeholder="Enter your full name"
                            />
                        ) : (
                            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-50 to-white rounded-xl border border-violet-100">
                                <User className="h-5 w-5 text-violet-600" />
                                <p className="text-foreground font-medium">{displayName}</p>
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm font-semibold text-foreground block mb-2">Email Address</label>
                        {isEditing ? (
                            <input
                                type="email"
                                value={editData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-all"
                                placeholder="Enter your email address"
                            />
                        ) : (
                            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-50 to-white rounded-xl border border-violet-100">
                                <Mail className="h-5 w-5 text-violet-600" />
                                <p className="text-foreground font-medium">{displayEmail}</p>
                            </div>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-sm font-semibold text-foreground block mb-2">Phone Number</label>
                        {isEditing ? (
                            <input
                                type="tel"
                                value={editData.mobile}
                                onChange={(e) => handleChange("mobile", e.target.value)}
                                className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-all"
                                placeholder="Enter your phone number"
                            />
                        ) : (
                            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-50 to-white rounded-xl border border-violet-100">
                                <Phone className="h-5 w-5 text-violet-600" />
                                <p className="text-foreground font-medium">{displayMobile}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Actions */}
            {isEditing && (
                <div className="flex gap-3">
                    <Button onClick={handleCancel} variant="outline" className="flex-1 border-violet-200 text-violet-600 hover:bg-violet-50 bg-white" disabled={isUpdating}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-lg" disabled={isUpdating}>
                        {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            )}
        </div>
    );
}
