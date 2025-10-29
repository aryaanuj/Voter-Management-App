"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Loader2, Users } from "lucide-react";
import { VoterCard } from "@/components/shared/voter-card";
import { useVoters } from "@/lib/hooks";
import { VoterStatus, VoterCategory } from "@/lib/types";
import { useAuth } from "@/lib/providers";

export function VoterListTab() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<VoterStatus | "all">("all");
    const [categoryFilter, setCategoryFilter] = useState<VoterCategory | "all">("all");
    const [page, setPage] = useState(1);
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
            userRole: user?.role, // Pass user role to determine API endpoint (will use sentiments for BOOTH_MANAGER)
        }
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Voter List</CardTitle>
                        <CardDescription>Manage and verify voters</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white">Add Voter</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-6 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by name, EPIC ID, or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

                {!isMounted ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {votersData?.data?.map((voter) => (
                            <VoterCard
                                key={voter.id}
                                voter={{
                                    id: voter.id,
                                    name: voter.name,
                                    epicId: voter.voterId,
                                    age: voter.age || 0,
                                    fatherName: voter.fatherName || "",
                                    phone: voter.mobile || "",
                                    religion: voter.religion || "",
                                    status: voter.isMobileVerified ? "Verified" : "Unverified",
                                    sentiment: voter.status === VoterStatus.FAVOUR ? "favor" : voter.status === VoterStatus.AGAINST ? "against" : "neutral",
                                    photoUrl: voter.photoUrl || "/placeholder.svg?height=56&width=56&query=voter profile",
                                }}
                            />
                        ))}

                        {/* Empty State */}
                        {votersData?.data?.length === 0 && (
                            <div className="text-center py-8">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 bg-gray-100 rounded-full">
                                        <Users className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">No voters found</h3>
                                        <p className="text-gray-600">{searchTerm ? "Try adjusting your search." : "No voters have been registered yet."}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
