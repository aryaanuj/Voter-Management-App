"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Phone, Loader2, CheckCircle, Minus, Users, ThumbsUp, ThumbsDown, Edit2, Filter, PencilLine, Meh, ChevronLeft, ChevronRight } from "lucide-react";
import { useVoters, useUpdateSentiment } from "@/lib/hooks";
import { VoterStatus, VoterCategory } from "@/lib/types";
import { VoterDetailsBottomSheet } from "./voter-details-bottom-sheet";
import { VoterImage } from "@/components/shared/voter-image";
import { toast } from "sonner";
import { useAuth } from "@/lib/providers";

export function MemberVoterListTab() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<VoterStatus | "all">("all");
    const [categoryFilter, setCategoryFilter] = useState<VoterCategory | "all">("all");
    const [page, setPage] = useState(1);
    const [selectedVoter, setSelectedVoter] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Get user role from auth context
    const { user } = useAuth();

    // Ensure component is mounted before making API calls
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const {
        data: votersData,
        isLoading,
        refetch,
    } = useVoters(
        {
            page,
            limit: 20,
            search: searchTerm || undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
            category: categoryFilter !== "all" ? categoryFilter : undefined,
        },
        {
            enabled: isMounted, // Only run query after component is mounted
            userRole: user?.role, // Pass user role to determine API endpoint
        }
    );

    const updateSentimentMutation = useUpdateSentiment();

    const handleUpdateStatus = async (voterId: string, status: VoterStatus) => {
        try {
            await updateSentimentMutation.mutateAsync({ voterId, data: { status } });
            toast.success("Voter sentiment updated successfully");
        } catch (error) {
            toast.error("Failed to update voter sentiment");
        }
    };

    const handleVoterDetails = (voter: any) => {
        setSelectedVoter(voter);
        setIsDetailsOpen(true);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Voter Management</h2>
                <p className="text-sm text-gray-600 mt-1">Manage and track voter information</p>
            </div>

            {/* Search Bar with Filter Icon */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search voters..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 text-sm rounded-lg border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`h-10 px-3 rounded-lg border transition-all duration-200 flex items-center gap-1 ${
                        showFilters || statusFilter !== "all" || categoryFilter !== "all"
                            ? "bg-violet-600 text-white border-violet-600"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                >
                    <Filter className="h-4 w-4" />
                </button>
            </div>
            {/* Collapsible Filters */}
            {showFilters && (
                <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 animate-in slide-in-from-top-2 duration-200">
                    {/* Compact Filter Chips */}
                    <div className="space-y-2">
                        {/* Status Filter */}
                        <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">Status</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setStatusFilter("all")}
                                    className={`px-2 py-1 rounded-md text-sm transition-all ${statusFilter === "all" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setStatusFilter(VoterStatus.FAVOUR)}
                                    className={`px-2 py-1 rounded-md text-sm transition-all ${
                                        statusFilter === VoterStatus.FAVOUR ? "bg-green-600 text-white" : "bg-green-100 text-green-600 hover:bg-green-200"
                                    }`}
                                >
                                    ✓ Favour
                                </button>
                                <button
                                    onClick={() => setStatusFilter(VoterStatus.NEUTRAL)}
                                    className={`px-2 py-1 rounded-md text-sm transition-all ${
                                        statusFilter === VoterStatus.NEUTRAL ? "bg-yellow-600 text-white" : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                                    }`}
                                >
                                    ◐ Neutral
                                </button>
                                <button
                                    onClick={() => setStatusFilter(VoterStatus.AGAINST)}
                                    className={`px-2 py-1 rounded-md text-sm transition-all ${
                                        statusFilter === VoterStatus.AGAINST ? "bg-red-600 text-white" : "bg-red-100 text-red-600 hover:bg-red-200"
                                    }`}
                                >
                                    ✕ Against
                                </button>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">Category</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCategoryFilter("all")}
                                    className={`px-2 py-1 rounded-md text-sm transition-all ${categoryFilter === "all" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setCategoryFilter(VoterCategory.GENERAL)}
                                    className={`px-2 py-1 rounded-md text-sm transition-all ${
                                        categoryFilter === VoterCategory.GENERAL ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                    }`}
                                >
                                    Gen
                                </button>
                                <button
                                    onClick={() => setCategoryFilter(VoterCategory.OBC)}
                                    className={`px-2 py-1 rounded-md text-sm transition-all ${
                                        categoryFilter === VoterCategory.OBC ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                                    }`}
                                >
                                    OBC
                                </button>
                                <button
                                    onClick={() => setCategoryFilter(VoterCategory.SC)}
                                    className={`px-2 py-1 rounded-md text-sm transition-all ${
                                        categoryFilter === VoterCategory.SC ? "bg-orange-600 text-white" : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                                    }`}
                                >
                                    SC
                                </button>
                                <button
                                    onClick={() => setCategoryFilter(VoterCategory.ST)}
                                    className={`px-2 py-1 rounded-md text-xs transition-all ${
                                        categoryFilter === VoterCategory.ST ? "bg-teal-600 text-white" : "bg-teal-100 text-teal-600 hover:bg-teal-200"
                                    }`}
                                >
                                    ST
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("all");
                                    setCategoryFilter("all");
                                }}
                                className="w-full py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-medium transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Mobile-Style Voter Cards Container */}

            {/* Content */}
            <div className="">
                {!isMounted ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Voter Cards */}
                        {votersData?.data?.map((voter) => (
                            <div key={voter.id} className="bg-white rounded-xl p-4 border border-violet-100 hover:shadow-md transition-all duration-300">
                                {/* Header with Name and Edit Icon */}
                                <div className="flex items-start gap-3 mb-3">
                                    {/* Profile Image with Verified Badge Overlay */}
                                    <div className="relative shrink-0">
                                        <VoterImage filePath={voter.photoUrl} alt={voter.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-violet-200" />
                                        {voter.isMobileVerified && (
                                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 ring-2 ring-white">
                                                <CheckCircle className="h-4 w-4 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Name and Voter ID */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-sm text-foreground leading-tight">{voter.name}</h3>
                                            <button onClick={() => handleVoterDetails(voter)} className="p-2 bg-violet-50 hover:bg-violet-100 rounded-sm transition-colors shrink-0" title="Edit">
                                                <PencilLine className="h-4 w-4 text-violet-600" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-violet-600 font-semibold">EPIC: {voter.voterId}</p>
                                    </div>
                                </div>

                                {/* Voter Details */}
                                <div className="space-y-1.5 text-xs mb-3">
                                    {/* Age and Father Name */}
                                    <div className="flex gap-4">
                                        <div>
                                            <span className="text-muted-foreground">Age:</span>
                                            <span className="font-semibold text-foreground ml-1">{voter.age || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Father:</span>
                                            <span className="font-semibold text-foreground ml-1">{voter.fatherName || "N/A"}</span>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-center gap-1.5">
                                        <Phone className="h-3 w-3 text-violet-600 shrink-0" />
                                        <span className="font-semibold text-foreground">{voter.mobile || "N/A"}</span>
                                    </div>

                                    <div className="flex gap-4 items-center">
                                        {/* Religion */}
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-2 w-2 rounded-full bg-violet-600 shrink-0"></div>
                                            <span className="text-muted-foreground">Religion:</span>
                                            <span className="font-semibold text-violet-600">{voter.religion || "N/A"}</span>
                                        </div>

                                        {/* Category */}
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0"></div>
                                            <span className="text-muted-foreground">Category:</span>
                                            <span className="font-semibold text-blue-600">{voter.category || "N/A"}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        {/* Caste */}
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-2 w-2 rounded-full bg-pink-600 shrink-0"></div>
                                            <span className="text-muted-foreground">Caste:</span>
                                            <span className="font-semibold text-pink-600">{voter.caste || "N/A"}</span>
                                        </div>

                                        {/* Status */}
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-2 w-2 rounded-full bg-orange-600 shrink-0"></div>
                                            <span className="text-muted-foreground">Status:</span>
                                            <span className="font-semibold text-orange-600 capitalize">{voter?.residentStatus?.toLowerCase() || "N/A"}</span>
                                        </div>
                                    </div>
                                    {/* Address */}
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-gray-600 shrink-0"></div>
                                        <span className="text-muted-foreground">Address:</span>
                                        <span className="font-semibold text-gray-600">{voter.address || "N/A"}</span>
                                    </div>
                                </div>

                                {/* Sentiment Status Buttons */}
                                <div className="flex gap-2 pt-2 border-t border-violet-100">
                                    {/* Favour Button */}
                                    <button
                                        onClick={() => handleUpdateStatus(voter.id, VoterStatus.FAVOUR)}
                                        disabled={updateSentimentMutation.isPending}
                                        className={`flex-1 text-xs h-10 gap-2 rounded-sm flex items-center justify-center transition-all duration-300 ${
                                            voter.sentimentStatus === VoterStatus.FAVOUR
                                                ? "bg-green-500 border border-green-600 text-white shadow-md scale-105"
                                                : "bg-green-50 text-green-600 border border-green-300 hover:bg-green-200 hover:scale-105"
                                        } ${updateSentimentMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                                        title="Mark as Favour"
                                    >
                                        {updateSentimentMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ThumbsUp className="h-3.5 w-3.5" />} Favour
                                    </button>

                                    {/* Neutral Button */}
                                    <button
                                        onClick={() => handleUpdateStatus(voter.id, VoterStatus.NEUTRAL)}
                                        disabled={updateSentimentMutation.isPending}
                                        className={`flex-1 text-xs h-10 rounded-sm gap-2 flex items-center justify-center transition-all duration-300 ${
                                            voter.sentimentStatus === VoterStatus.NEUTRAL
                                                ? "bg-yellow-500 border border-yellow-600 text-white shadow-md scale-105"
                                                : "bg-yellow-50 text-yellow-700 border border-yellow-300 hover:bg-yellow-200 hover:scale-105"
                                        } ${updateSentimentMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                                        title="Mark as Neutral"
                                    >
                                        {updateSentimentMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Meh className="h-3.5 w-3.5" />} Neutral
                                    </button>

                                    {/* Against Button */}
                                    <button
                                        onClick={() => handleUpdateStatus(voter.id, VoterStatus.AGAINST)}
                                        disabled={updateSentimentMutation.isPending}
                                        className={`flex-1 text-xs h-10 rounded-sm gap-2 flex items-center justify-center transition-all duration-300 ${
                                            voter.sentimentStatus === VoterStatus.AGAINST
                                                ? "bg-red-500 border border-red-600 text-white shadow-md scale-105"
                                                : "bg-red-50 border border-red-300 text-red-600 hover:bg-red-200 hover:scale-105"
                                        } ${updateSentimentMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                                        title="Mark as Against"
                                    >
                                        {updateSentimentMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ThumbsDown className="h-3.5 w-3.5" />} Against
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Empty State */}
                        {votersData?.data?.length === 0 && (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="p-4 bg-gray-100 rounded-full">
                                            <Users className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">No voters found</h3>
                                            <p className="text-gray-600">
                                                {searchTerm || statusFilter !== "all" || categoryFilter !== "all" ? "Try adjusting your search or filters." : "No voters have been registered yet."}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {votersData?.meta && (
                    <div className="space-y-4 mt-6">
                        {/* Results Info */}
                        <div className="text-center text-sm text-gray-600">
                            Showing {(votersData.meta.page - 1) * votersData.meta.limit + 1} to {Math.min(votersData.meta.page * votersData.meta.limit, votersData.meta.total)} of{" "}
                            {votersData.meta.total} voters
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="flex-1 flex items-center gap-2 justify-center py-2 px-4 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-xl text-sm font-medium transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" /> Previous
                            </button>
                            <div className="px-4 py-2 text-sm font-medium bg-violet-100 text-violet-700 rounded-xl">
                                Page {page} of {Math.ceil(votersData.meta.total / votersData.meta.limit)}
                            </div>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page >= Math.ceil(votersData.meta.total / votersData.meta.limit)}
                                className="flex-1 flex items-center gap-2 justify-center py-2 px-4 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-xl text-sm font-medium transition-colors"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Voter Details Bottom Sheet */}
            {selectedVoter && (
                <VoterDetailsBottomSheet
                    isOpen={isDetailsOpen}
                    onClose={() => {
                        setIsDetailsOpen(false);
                        setSelectedVoter(null);
                    }}
                    voter={{
                        id: selectedVoter.id,
                        name: selectedVoter.name,
                        age: selectedVoter.age || 0,
                        religion: selectedVoter.religion,
                        category: selectedVoter.category,
                        caste: selectedVoter.caste,
                        phone: selectedVoter.mobile,
                        status: selectedVoter.status,
                        photoUrl: selectedVoter.photoUrl,
                        phoneVerified: selectedVoter.isMobileVerified,
                        assemblyConstituencyId: selectedVoter.assemblyConstituencyId,
                        pollingStationId: selectedVoter.pollingStationId,
                        sentimentStatus: selectedVoter.sentimentStatus,
                    }}
                />
            )}
        </div>
    );
}
