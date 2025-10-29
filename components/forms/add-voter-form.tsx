"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useCreateVoter, useUpdateVoter } from "@/lib/hooks";
import { VoterFormData, VoterCategory } from "@/lib/types";
import { useDistricts, useAssemblyConstituencies, usePollingStations } from "@/lib/hooks";

interface AddVoterFormProps {
    onSubmit?: (data: VoterFormData) => void;
    onCancel?: () => void;
    initialData?: Partial<VoterFormData>;
    isEditing?: boolean;
}

export function AddVoterForm({ onSubmit, onCancel, initialData, isEditing }: AddVoterFormProps) {
    const [formData, setFormData] = useState<VoterFormData>({
        name: initialData?.name || "",
        voterId: initialData?.voterId || "",
        fatherName: initialData?.fatherName || "",
        motherName: initialData?.motherName || "",
        mobile: initialData?.mobile || "",
        email: initialData?.email || "",
        age: initialData?.age || undefined,
        gender: initialData?.gender || "",
        religion: initialData?.religion || "",
        caste: initialData?.caste || "",
        category: initialData?.category || VoterCategory.GENERAL,
        address: initialData?.address || "",
        assemblyConstituencyId: initialData?.assemblyConstituencyId || "",
        pollingStationId: initialData?.pollingStationId || "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const createVoterMutation = useCreateVoter();
    const updateVoterMutation = useUpdateVoter();
    const { data: districts } = useDistricts();
    const { data: assemblyConstituencies } = useAssemblyConstituencies(formData.assemblyConstituencyId);
    const { data: pollingStations } = usePollingStations(formData.pollingStationId);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.voterId.trim()) newErrors.voterId = "Voter ID is required";
        if (!formData.age || formData.age < 18 || formData.age > 120) {
            newErrors.age = "Age must be between 18 and 120";
        }
        if (!formData.fatherName?.trim()) newErrors.fatherName = "Father's name is required";
        if (formData.mobile && !/^\d{10}$/.test(formData.mobile.replace(/\D/g, ""))) {
            newErrors.mobile = "Mobile must be 10 digits";
        }
        if (!formData.religion) newErrors.religion = "Religion is required";
        if (!formData.caste) newErrors.caste = "Caste category is required";
        if (!formData.address?.trim()) newErrors.address = "Address is required";
        if (!formData.assemblyConstituencyId) newErrors.assemblyConstituencyId = "Assembly Constituency is required";
        if (!formData.pollingStationId) newErrors.pollingStationId = "Polling Station is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof VoterFormData, value: string | number | undefined) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                if (isEditing && initialData?.id) {
                    await updateVoterMutation.mutateAsync({
                        id: initialData.id,
                        data: formData,
                    });
                } else {
                    await createVoterMutation.mutateAsync(formData);
                }
                setSubmitted(true);
                onSubmit?.(formData);
                setTimeout(() => setSubmitted(false), 2000);
            } catch (error) {
                console.error("Failed to submit voter form:", error);
            }
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isEditing ? "Edit Voter" : "Add New Voter"}</CardTitle>
                <CardDescription>{isEditing ? "Update voter information" : "Register a new voter in the system"}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information Section */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Personal Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="voterId">Voter ID *</Label>
                                <Input
                                    id="voterId"
                                    placeholder="e.g., VOTER001"
                                    value={formData.voterId}
                                    onChange={(e) => handleChange("voterId", e.target.value.toUpperCase())}
                                    className={errors.voterId ? "border-red-500" : ""}
                                />
                                {errors.voterId && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.voterId}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="age">Age *</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    placeholder="Enter age"
                                    value={formData.age || ""}
                                    onChange={(e) => handleChange("age", parseInt(e.target.value) || undefined)}
                                    className={errors.age ? "border-red-500" : ""}
                                />
                                {errors.age && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.age}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fatherName">Father's Name *</Label>
                                <Input
                                    id="fatherName"
                                    placeholder="Enter father's name"
                                    value={formData.fatherName}
                                    onChange={(e) => handleChange("fatherName", e.target.value)}
                                    className={errors.fatherName ? "border-red-500" : ""}
                                />
                                {errors.fatherName && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.fatherName}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Contact Information</h3>

                        <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile Number</Label>
                            <Input
                                id="mobile"
                                placeholder="10-digit mobile number"
                                value={formData.mobile || ""}
                                onChange={(e) => handleChange("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                                className={errors.mobile ? "border-red-500" : ""}
                            />
                            {errors.mobile && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.mobile}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="Enter email address" value={formData.email || ""} onChange={(e) => handleChange("email", e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address *</Label>
                            <Textarea
                                id="address"
                                placeholder="Enter complete address"
                                value={formData.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                className={errors.address ? "border-red-500" : ""}
                                rows={3}
                            />
                            {errors.address && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.address}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Demographics Section */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Demographics</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="religion">Religion *</Label>
                                <Select value={formData.religion} onValueChange={(value) => handleChange("religion", value)}>
                                    <SelectTrigger className={errors.religion ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select religion" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hindu">Hindu</SelectItem>
                                        <SelectItem value="muslim">Muslim</SelectItem>
                                        <SelectItem value="christian">Christian</SelectItem>
                                        <SelectItem value="sikh">Sikh</SelectItem>
                                        <SelectItem value="buddhist">Buddhist</SelectItem>
                                        <SelectItem value="jain">Jain</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.religion && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.religion}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Caste Category *</Label>
                                <Select value={formData.category} onValueChange={(value) => handleChange("category", value as VoterCategory)}>
                                    <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={VoterCategory.GENERAL}>General</SelectItem>
                                        <SelectItem value={VoterCategory.OBC}>OBC</SelectItem>
                                        <SelectItem value={VoterCategory.SC}>SC</SelectItem>
                                        <SelectItem value={VoterCategory.ST}>ST</SelectItem>
                                        <SelectItem value={VoterCategory.OTHER}>Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.category}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Location Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="assemblyConstituency">Assembly Constituency *</Label>
                                <Select value={formData.assemblyConstituencyId} onValueChange={(value) => handleChange("assemblyConstituencyId", value)}>
                                    <SelectTrigger className={errors.assemblyConstituencyId ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select Assembly Constituency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {assemblyConstituencies?.map((ac) => (
                                            <SelectItem key={ac.id} value={ac.id}>
                                                {ac.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.assemblyConstituencyId && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.assemblyConstituencyId}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pollingStation">Polling Station *</Label>
                                <Select value={formData.pollingStationId} onValueChange={(value) => handleChange("pollingStationId", value)} disabled={!formData.assemblyConstituencyId}>
                                    <SelectTrigger className={errors.pollingStationId ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select Polling Station" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pollingStations?.map((ps) => (
                                            <SelectItem key={ps.id} value={ps.id}>
                                                {ps.name} ({ps.number})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.pollingStationId && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.pollingStationId}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Success Message */}
                    {submitted && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">Voter {isEditing ? "updated" : "added"} successfully!</span>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={createVoterMutation.isPending || updateVoterMutation.isPending}>
                            {createVoterMutation.isPending || updateVoterMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isEditing ? "Updating..." : "Adding..."}
                                </>
                            ) : isEditing ? (
                                "Update Voter"
                            ) : (
                                "Add Voter"
                            )}
                        </Button>
                        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
