"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Calendar, User, MapPin, Activity, Loader2, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useBoothActivities, useCreateBoothActivity, useBoothActivityStats, useVoters } from "@/lib/hooks";
import { format } from "date-fns";

const ACTIVITY_TYPES = ["VISIT", "PHONE_CALL", "MEETING", "CAMPAIGN", "FOLLOW_UP", "VERIFICATION", "OTHER"];

export function BoothActivityTab() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activityTypeFilter, setActivityTypeFilter] = useState<string>("all");
    const [page, setPage] = useState(1);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const { data: activitiesData, isLoading } = useBoothActivities({
        page,
        limit: 10,
        activityType: activityTypeFilter !== "all" ? activityTypeFilter : undefined,
    });

    const { data: stats } = useBoothActivityStats();
    const { data: votersData } = useVoters({ limit: 100 });
    const createActivityMutation = useCreateBoothActivity();

    const [newActivity, setNewActivity] = useState({
        voterId: "",
        activityType: "VISIT",
        description: "",
        metadata: {},
    });

    const handleCreateActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createActivityMutation.mutateAsync(newActivity);
            setNewActivity({
                voterId: "",
                activityType: "VISIT",
                description: "",
                metadata: {},
            });
            setIsAddDialogOpen(false);
        } catch (error) {
            console.error("Failed to create activity:", error);
        }
    };

    const getActivityTypeColor = (type: string) => {
        switch (type) {
            case "VISIT":
                return "bg-blue-100 text-blue-800";
            case "PHONE_CALL":
                return "bg-green-100 text-green-800";
            case "MEETING":
                return "bg-purple-100 text-purple-800";
            case "CAMPAIGN":
                return "bg-orange-100 text-orange-800";
            case "FOLLOW_UP":
                return "bg-yellow-100 text-yellow-800";
            case "VERIFICATION":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "VISIT":
                return <MapPin className="h-4 w-4" />;
            case "PHONE_CALL":
                return <User className="h-4 w-4" />;
            case "MEETING":
                return <Calendar className="h-4 w-4" />;
            case "CAMPAIGN":
                return <Activity className="h-4 w-4" />;
            case "FOLLOW_UP":
                return <CheckCircle className="h-4 w-4" />;
            case "VERIFICATION":
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <Activity className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Booth Activities</h2>
                    <p className="text-muted-foreground">Track and manage booth activities</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Record Activity
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Record New Activity</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateActivity} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Voter</label>
                                <Select value={newActivity.voterId} onValueChange={(value) => setNewActivity((prev) => ({ ...prev, voterId: value }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select voter" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {votersData?.data?.map((voter) => (
                                            <SelectItem key={voter.id} value={voter.id}>
                                                {voter.name} ({voter.voterId})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Activity Type</label>
                                <Select value={newActivity.activityType} onValueChange={(value) => setNewActivity((prev) => ({ ...prev, activityType: value }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ACTIVITY_TYPES.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type.replace("_", " ")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    placeholder="Describe the activity..."
                                    value={newActivity.description}
                                    onChange={(e) => setNewActivity((prev) => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={createActivityMutation.isPending}>
                                    {createActivityMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Recording...
                                        </>
                                    ) : (
                                        "Record Activity"
                                    )}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Activity className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground">Total Activities</p>
                                <p className="text-2xl font-bold">{stats?.totalActivities || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground">Today</p>
                                <p className="text-2xl font-bold">{stats?.todayActivities || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Calendar className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                                <p className="text-2xl font-bold">{stats?.weeklyActivities || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <User className="h-6 w-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground">Active Voters</p>
                                <p className="text-2xl font-bold">{stats?.activeVoters || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search activities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Activity Type</label>
                            <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {ACTIVITY_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.replace("_", " ")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Actions</label>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("");
                                    setActivityTypeFilter("all");
                                }}
                                className="w-full"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Activities Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>{activitiesData?.pagination?.total || 0} total activities</CardDescription>
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
                                        <TableHead>Type</TableHead>
                                        <TableHead>Voter</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {activitiesData?.data?.map((activity) => (
                                        <TableRow key={activity.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getActivityIcon(activity.activityType)}
                                                    <Badge className={getActivityTypeColor(activity.activityType)}>{activity.activityType.replace("_", " ")}</Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">{votersData?.data?.find((v) => v.id === activity.voterId)?.name || "Unknown"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-xs truncate">{activity.description || "No description"}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    {format(new Date(activity.createdAt), "MMM dd, yyyy")}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    {format(new Date(activity.createdAt), "HH:mm")}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Pagination */}
                    {activitiesData?.pagination && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {(activitiesData.pagination.page - 1) * activitiesData.pagination.limit + 1} to{" "}
                                {Math.min(activitiesData.pagination.page * activitiesData.pagination.limit, activitiesData.pagination.total)} of {activitiesData.pagination.total} results
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                                    Previous
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= activitiesData.pagination.totalPages}>
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
