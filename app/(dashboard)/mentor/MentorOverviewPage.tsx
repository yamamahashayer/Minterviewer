"use client";

import { useState, useEffect } from "react";
import ProfileOverview from "@/app/(dashboard)/mentor/ProfileOverview";
import { UpcomingSessions } from "@/app/(dashboard)/mentor/UpcomingSessions";
import { MenteesProgress } from "@/app/(dashboard)/mentor/MenteesProgress";
import { FeedbackManager } from "@/app/(dashboard)/mentor/FeedbackManager";
import { PerformanceStats } from "@/app/(dashboard)/mentor/PerformanceStats";
import { QuickActions } from "@/app/(dashboard)/mentor/QuickActions";

export default function MentorOverviewPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOverviewData = async () => {
            try {
                setLoading(true);
                const token = sessionStorage.getItem('token');

                if (!token) {
                    throw new Error('Authentication required');
                }

                const response = await fetch('/api/mentor/overview', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch overview data');
                }

                const result = await response.json();
                setData(result.data);
            } catch (err) {
                console.error('Error fetching overview:', err);
                setError(err instanceof Error ? err.message : 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchOverviewData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <ProfileOverview />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2">
                    <UpcomingSessions sessions={data?.upcomingSessions || []} />
                </div>
                <QuickActions />
            </div>

            <div className="mt-6">
                <MenteesProgress data={data?.progressChart || []} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <FeedbackManager />
                <PerformanceStats stats={data?.stats} />
            </div>
        </div>
    );
}
