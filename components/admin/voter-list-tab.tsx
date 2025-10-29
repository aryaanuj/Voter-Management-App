"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { useVoters, useUpdateVoterStatus, useDeleteVoter } from "@/lib/hooks";
import { VoterStatus, VoterCategory } from "@/lib/types";
import { AddVoterForm } from "@/components/forms/add-voter-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/lib/providers";

export function VoterListTab() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<VoterStatus | "all">("all");
    const [categoryFilter, setCategoryFilter] = useState<VoterCategory | "all">("all");
    const [page, setPage] = useState(1);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Get user role from auth context
    const { user } = useAuth();

    const { data: votersData, isLoading } = useVoters(
        {
            page,
            limit: 10,
            search: searchTerm || undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
            category: categoryFilter !== "all" ? categoryFilter : undefined,
        },
        {
            userRole: user?.role, // Pass user role to determine API endpoint (will use regular voters API for ADMIN)
        }
    );

    const updateStatusMutation = useUpdateVoterStatus();
    const deleteVoterMutation = useDeleteVoter();

    const handleStatusUpdate = async (voterId: string, newStatus: VoterStatus) => {
        try {
            await updateStatusMutation.mutateAsync({ id: voterId, status: newStatus });
        } catch (error) {
            console.error("Failed to update voter status:", error);
        }
    };

    const handleDeleteVoter = async (voterId: string) => {
        if (confirm("Are you sure you want to delete this voter?")) {
            try {
                await deleteVoterMutation.mutateAsync(voterId);
            } catch (error) {
                console.error("Failed to delete voter:", error);
            }
        }
    };

    const getStatusBadgeVariant = (status: VoterStatus) => {
        switch (status) {
            case VoterStatus.FAVOUR:
                return "default";
            case VoterStatus.AGAINST:
                return "destructive";
            case VoterStatus.NEUTRAL:
                return "secondary";
            default:
                return "outline";
        }
    };

    const getStatusColor = (status: VoterStatus) => {
        switch (status) {
            case VoterStatus.FAVOUR:
                return "text-green-600";
            case VoterStatus.AGAINST:
                return "text-red-600";
            case VoterStatus.NEUTRAL:
                return "text-gray-600";
            default:
                return "text-gray-600";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Voter Management</h2>
                    <p className="text-muted-foreground">Manage and track voter information</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Voter
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Voter</DialogTitle>
                        </DialogHeader>
                        <AddVoterForm onSubmit={() => setIsAddDialogOpen(false)} onCancel={() => setIsAddDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search by name or voter ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as VoterStatus | "all")}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value={VoterStatus.FAVOUR}>In Favour</SelectItem>
                                    <SelectItem value={VoterStatus.AGAINST}>Against</SelectItem>
                                    <SelectItem value={VoterStatus.NEUTRAL}>Neutral</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as VoterCategory | "all")}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value={VoterCategory.GENERAL}>General</SelectItem>
                                    <SelectItem value={VoterCategory.OBC}>OBC</SelectItem>
                                    <SelectItem value={VoterCategory.SC}>SC</SelectItem>
                                    <SelectItem value={VoterCategory.ST}>ST</SelectItem>
                                    <SelectItem value={VoterCategory.OTHER}>Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Actions</label>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("all");
                                    setCategoryFilter("all");
                                }}
                                className="w-full"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Voters Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Voters</CardTitle>
                    <CardDescription>{votersData?.pagination?.total || 0} total voters</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Voter ID</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {votersData?.data?.map((voter) => (
                                        <TableRow key={voter.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{voter.name}</div>
                                                    <div className="text-sm text-muted-foreground">{voter.fatherName && `S/O ${voter.fatherName}`}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-sm bg-muted px-2 py-1 rounded">{voter.voterId}</code>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {voter.mobile && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone className="h-3 w-3" />
                                                            {voter.mobile}
                                                        </div>
                                                    )}
                                                    {voter.email && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Mail className="h-3 w-3" />
                                                            {voter.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Select value={voter.status || VoterStatus.NEUTRAL} onValueChange={(value) => handleStatusUpdate(voter.id, value as VoterStatus)}>
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={VoterStatus.FAVOUR}>Favour</SelectItem>
                                                        <SelectItem value={VoterStatus.AGAINST}>Against</SelectItem>
                                                        <SelectItem value={VoterStatus.NEUTRAL}>Neutral</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{voter.category || "N/A"}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <MapPin className="h-3 w-3" />
                                                    <span className="truncate max-w-32">{voter.address}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteVoter(voter.id)} disabled={deleteVoterMutation.isPending}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Pagination */}
                    {votersData?.pagination && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {(votersData.pagination.page - 1) * votersData.pagination.limit + 1} to{" "}
                                {Math.min(votersData.pagination.page * votersData.pagination.limit, votersData.pagination.total)} of {votersData.pagination.total} results
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                                    Previous
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= votersData.pagination.totalPages}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
