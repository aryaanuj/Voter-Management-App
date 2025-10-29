"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Users, Camera, Phone, MapPin, Loader2, AlertCircle } from "lucide-react";
import { useBoothActivities, useCreateBoothActivity } from "@/lib/hooks";
import { toast } from "sonner";

export function MemberTasksTab() {
    const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "completed">("all");
    const [isMounted, setIsMounted] = useState(false);

    const { data: activities, isLoading } = useBoothActivities({
        activityType: activeFilter === "all" ? undefined : activeFilter,
        limit: 50,
    });

    const createActivityMutation = useCreateBoothActivity();

    // Ensure component is mounted before making API calls
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleTaskComplete = async (taskId: string) => {
        try {
            await createActivityMutation.mutateAsync({
                voterId: "mock-voter-id", // This should be replaced with actual voter ID
                activityType: "TASK_COMPLETED",
                description: "Task marked as completed",
                metadata: { taskId },
            });
            toast.success("Task completed successfully");
        } catch (error) {
            toast.error("Failed to complete task");
        }
    };

    const getTaskIcon = (type: string) => {
        switch (type) {
            case "VERIFY_CONTACTS":
                return <Phone className="h-5 w-5 text-blue-600" />;
            case "COLLECT_PHOTOS":
                return <Camera className="h-5 w-5 text-green-600" />;
            case "VERIFY_ADDRESS":
                return <MapPin className="h-5 w-5 text-purple-600" />;
            case "UPDATE_STATUS":
                return <Users className="h-5 w-5 text-orange-600" />;
            default:
                return <CheckCircle className="h-5 w-5 text-gray-600" />;
        }
    };

    const getTaskColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "in_progress":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const mockTasks = [
        {
            id: "1",
            title: "Verify Voter Contacts",
            description: "Verify phone numbers for 50 voters in your assigned area",
            type: "VERIFY_CONTACTS",
            status: "pending",
            progress: 65,
            totalVoters: 50,
            completedVoters: 32,
            priority: "high",
            dueDate: "2024-01-15",
            assignedBy: "Booth Manager",
        },
        {
            id: "2",
            title: "Collect Voter Photos",
            description: "Collect photos with GPS location data for voter verification",
            type: "COLLECT_PHOTOS",
            status: "in_progress",
            progress: 40,
            totalVoters: 30,
            completedVoters: 12,
            priority: "medium",
            dueDate: "2024-01-20",
            assignedBy: "Admin",
        },
        {
            id: "3",
            title: "Update Voter Status",
            description: "Update sentiment status for verified voters",
            type: "UPDATE_STATUS",
            status: "completed",
            progress: 100,
            totalVoters: 25,
            completedVoters: 25,
            priority: "low",
            dueDate: "2024-01-10",
            assignedBy: "Booth Manager",
        },
    ];

    const filteredTasks = mockTasks.filter((task) => {
        if (activeFilter === "all") return true;
        return task.status === activeFilter;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Tasks</h2>
                    <p className="text-muted-foreground">Manage your assigned tasks and track progress</p>
                </div>
                <div className="flex gap-2">
                    <Button variant={activeFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setActiveFilter("all")}>
                        All Tasks
                    </Button>
                    <Button variant={activeFilter === "pending" ? "default" : "outline"} size="sm" onClick={() => setActiveFilter("pending")}>
                        Pending
                    </Button>
                    <Button variant={activeFilter === "completed" ? "default" : "outline"} size="sm" onClick={() => setActiveFilter("completed")}>
                        Completed
                    </Button>
                </div>
            </div>

            {/* Task Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Tasks</p>
                                <p className="text-2xl font-bold">{mockTasks.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold">{mockTasks.filter((t) => t.status === "pending").length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Completed</p>
                                <p className="text-2xl font-bold">{mockTasks.filter((t) => t.status === "completed").length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Voters</p>
                                <p className="text-2xl font-bold">{mockTasks.reduce((sum, task) => sum + task.totalVoters, 0)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {!isMounted ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <Card key={task.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="p-2 bg-gray-100 rounded-lg">{getTaskIcon(task.type)}</div>

                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold text-lg">{task.title}</h3>
                                                <Badge className={getTaskColor(task.status)}>{task.status.replace("_", " ")}</Badge>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        task.priority === "high"
                                                            ? "border-red-300 text-red-700"
                                                            : task.priority === "medium"
                                                            ? "border-yellow-300 text-yellow-700"
                                                            : "border-gray-300 text-gray-700"
                                                    }
                                                >
                                                    {task.priority}
                                                </Badge>
                                            </div>

                                            <p className="text-muted-foreground">{task.description}</p>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>
                                                        Progress: {task.completedVoters}/{task.totalVoters} voters
                                                    </span>
                                                    <span className="font-semibold">{task.progress}%</span>
                                                </div>
                                                <Progress value={task.progress} className="h-2" />
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                                <span>Assigned by: {task.assignedBy}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {task.status === "pending" && (
                                            <Button size="sm" onClick={() => handleTaskComplete(task.id)} disabled={createActivityMutation.isPending}>
                                                {createActivityMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start Task"}
                                            </Button>
                                        )}

                                        {task.status === "in_progress" && (
                                            <Button size="sm" variant="outline" onClick={() => handleTaskComplete(task.id)} disabled={createActivityMutation.isPending}>
                                                {createActivityMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark Complete"}
                                            </Button>
                                        )}

                                        {task.status === "completed" && (
                                            <div className="flex items-center gap-1 text-green-600">
                                                <CheckCircle className="h-4 w-4" />
                                                <span className="text-sm font-medium">Completed</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Empty State */}
            {filteredTasks.length === 0 && !isLoading && (
                <Card>
                    <CardContent className="p-8 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-gray-100 rounded-full">
                                <CheckCircle className="h-8 w-8 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">No tasks found</h3>
                                <p className="text-muted-foreground">{activeFilter === "all" ? "You don't have any tasks assigned yet." : `No ${activeFilter} tasks found.`}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
