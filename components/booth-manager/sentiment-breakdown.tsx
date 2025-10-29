"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { useDashboardStats } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

export function SentimentBreakdown() {
    const { data: dashboardStats, isLoading, error } = useDashboardStats();

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Sentiment Breakdown</CardTitle>
                    <CardDescription>Voter sentiment analysis</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Sentiment Breakdown</CardTitle>
                    <CardDescription>Voter sentiment analysis</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Failed to load sentiment data</p>
                </CardContent>
            </Card>
        );
    }

    const sentiments = [
        {
            label: "In Favour",
            count: dashboardStats?.voters?.favour || 0,
            percentage: dashboardStats?.voters?.favourPercentage || 0,
            color: "bg-green-500",
            icon: ThumbsUp,
        },
        {
            label: "Neutral",
            count: dashboardStats?.voters?.neutral || 0,
            percentage: dashboardStats?.voters?.neutralPercentage || 0,
            color: "bg-orange-500",
            icon: Minus,
        },
        {
            label: "Against",
            count: dashboardStats?.voters?.against || 0,
            percentage: dashboardStats?.voters?.againstPercentage || 0,
            color: "bg-red-500",
            icon: ThumbsDown,
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sentiment Breakdown</CardTitle>
                <CardDescription>Voter sentiment analysis - {dashboardStats?.voters?.total || 0} total voters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {sentiments.map((sentiment) => {
                    const Icon = sentiment.icon;
                    return (
                        <div key={sentiment.label}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    <span className="text-sm font-medium">{sentiment.label}</span>
                                </div>
                                <span className="text-sm font-semibold text-primary">
                                    {sentiment.count.toLocaleString()} ({sentiment.percentage.toFixed(1)}%)
                                </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                <div className={`h-full ${sentiment.color}`} style={{ width: `${sentiment.percentage}%` }}></div>
                            </div>
                        </div>
                    );
                })}

                {/* Additional stats */}
                <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                            <p className="font-semibold text-blue-600">{dashboardStats?.voters?.verifiedMobile || 0}</p>
                            <p className="text-muted-foreground">Mobile Verified</p>
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-purple-600">{dashboardStats?.voters?.withPhoto || 0}</p>
                            <p className="text-muted-foreground">Photos Uploaded</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
