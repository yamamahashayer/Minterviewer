"use client";

import React, { useEffect, useState } from "react";
import {
    DollarSign, Users, Briefcase, FileText, Activity, Star, Clock, TrendingUp, Target, Award
} from "lucide-react";
import { EarningsChart, SessionStatusChart, SessionTypeChart, ScoreDistributionChart, TopicChart } from "@/components/admin/Charts";

export default function AdminPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/admin/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                } else {
                    console.error("Failed to fetch stats:", await res.text());
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Loading comprehensive statistics...</div>;
    }

    if (!stats) {
        return <div className="p-8 text-center text-red-500">Failed to load statistics. Check console for errors.</div>;
    }

    return (
        <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                    Admin Dashboard
                </h1>
                <p className="text-gray-500 mt-2">Comprehensive Platform Analytics & Insights</p>
            </header>

            {/* KEY METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Total Earnings */}
                <div className="p-6 rounded-2xl bg-white dark:bg-[#1a2036] border border-gray-100 dark:border-gray-800 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                            <DollarSign size={24} />
                        </div>
                        <div className="text-xs text-gray-500">{stats?.timeslots?.booked || 0} booked</div>
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Earnings</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        ${stats?.earnings?.total?.toLocaleString() || 0}
                    </p>
                </div>

                {/* Total Users */}
                <div className="p-6 rounded-2xl bg-white dark:bg-[#1a2036] border border-gray-100 dark:border-gray-800 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                            <Users size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Users</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {stats?.users?.total?.toLocaleString() || 0}
                    </p>
                    <div className="mt-2 text-xs text-gray-400 flex gap-3">
                        <span className="text-purple-400">{stats?.users?.mentors} Mentors</span>
                        <span className="text-green-400">{stats?.users?.mentees} Mentees</span>
                    </div>
                </div>

                {/* Total Sessions */}
                <div className="p-6 rounded-2xl bg-white dark:bg-[#1a2036] border border-gray-100 dark:border-gray-800 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400">
                            <Activity size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Sessions</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {stats?.sessions?.total?.toLocaleString() || 0}
                    </p>
                    <div className="mt-2 text-xs text-gray-400">
                        <span className="text-green-500">{stats?.sessions?.completed} Completed</span>
                    </div>
                </div>

                {/* AI Interviews */}
                <div className="p-6 rounded-2xl bg-white dark:bg-[#1a2036] border border-gray-100 dark:border-gray-800 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
                            <Target size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">AI Interviews</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {stats?.interviews?.total?.toLocaleString() || 0}
                    </p>
                    <div className="mt-2 text-xs text-gray-400">
                        <span className="text-purple-400">{stats?.interviews?.finalized} Finalized</span>
                    </div>
                </div>
            </div>

            {/* EARNINGS & TIMESLOT UTILIZATION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-[#1a2036] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl">
                    <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Earnings Over Time</h3>
                    <EarningsChart data={stats?.earnings?.chart || []} />
                </div>

                <div className="bg-white dark:bg-[#1a2036] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl">
                    <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">TimeSlot Utilization</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Total Slots</span>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.timeslots?.total || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Booked</span>
                            <span className="text-xl font-bold text-green-600">{stats?.timeslots?.booked || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
                            <span className="text-xl font-bold text-blue-600">{stats?.timeslots?.available || 0}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden mt-4">
                            <div
                                className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full transition-all"
                                style={{ width: `${stats?.timeslots?.utilizationRate || 0}%` }}
                            />
                        </div>
                        <p className="text-center text-sm text-gray-500 mt-2">
                            {stats?.timeslots?.utilizationRate || 0}% Utilization Rate
                        </p>
                    </div>
                </div>
            </div>

            {/* SESSION ANALYTICS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#1a2036] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl">
                    <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Session Status</h3>
                    <SessionStatusChart data={stats?.sessions?.statusChart || []} />
                </div>

                <div className="bg-white dark:bg-[#1a2036] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl">
                    <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Session Types</h3>
                    <SessionTypeChart data={stats?.sessions?.typeChart || []} />
                </div>

                <div className="bg-white dark:bg-[#1a2036] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl">
                    <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Top Topics</h3>
                    <TopicChart data={stats?.sessions?.topicChart || []} />
                </div>
            </div>

            {/* INTERVIEW & CV ANALYSIS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#1a2036] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Interview Score Distribution</h3>
                    <ScoreDistributionChart data={stats?.interviews?.scoreDistribution || []} title="Interview Scores" />
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <p className="text-xs text-gray-500">Job Interviews</p>
                            <p className="text-xl font-bold text-purple-600">{stats?.interviews?.jobInterviews || 0}</p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-xs text-gray-500">Practice</p>
                            <p className="text-xl font-bold text-blue-600">{stats?.interviews?.practiceInterviews || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a2036] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">CV Analysis Score Distribution</h3>
                    <ScoreDistributionChart data={stats?.cvAnalysis?.scoreDistribution || []} title="CV Scores" />
                    <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <p className="text-xs text-gray-500">Total CV Analyses</p>
                        <p className="text-2xl font-bold text-orange-600">{stats?.cvAnalysis?.total || 0}</p>
                    </div>
                </div>
            </div>

            {/* COMPANIES & JOBS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#1a2036] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl">
                    <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Companies & Jobs</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                            <Briefcase className="text-indigo-600 mb-2" size={24} />
                            <p className="text-xs text-gray-500">Total Companies</p>
                            <p className="text-2xl font-bold text-indigo-600">{stats?.companies?.total || 0}</p>
                            <p className="text-xs text-gray-400 mt-1">{stats?.companies?.verified} Verified</p>
                        </div>
                        <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                            <Award className="text-pink-600 mb-2" size={24} />
                            <p className="text-xs text-gray-500">Active Jobs</p>
                            <p className="text-2xl font-bold text-pink-600">{stats?.jobs?.active || 0}</p>
                            <p className="text-xs text-gray-400 mt-1">of {stats?.jobs?.total} total</p>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <Target className="text-purple-600 mb-2" size={24} />
                            <p className="text-xs text-gray-500">AI Interview Jobs</p>
                            <p className="text-2xl font-bold text-purple-600">{stats?.jobs?.aiInterviews || 0}</p>
                        </div>
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                            <FileText className="text-orange-600 mb-2" size={24} />
                            <p className="text-xs text-gray-500">CV Analysis Jobs</p>
                            <p className="text-2xl font-bold text-orange-600">{stats?.jobs?.cvAnalysisEnabled || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a2036] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl">
                    <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Candidate Pipeline</h3>
                    <div className="space-y-3">
                        {stats?.candidates?.statusChart?.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                        <p className="text-xs text-gray-500">Total Candidates</p>
                        <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            {stats?.candidates?.total || 0}
                        </p>
                    </div>
                </div>
            </div>

            {/* DEMOGRAPHICS & EXPERIENCE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#1a2036] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl">
                    <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Mentor Experience Levels</h3>
                    <SessionTypeChart data={stats?.mentorAnalytics?.experienceDistribution || []} />
                </div>

                <div className="bg-white dark:bg-[#1a2036] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl">
                    <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Top User Countries</h3>
                    <TopicChart data={stats?.users?.countryChart || []} />
                </div>

                <div className="bg-white dark:bg-[#1a2036] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl">
                    <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Company Industries</h3>
                    <SessionTypeChart data={stats?.companies?.industryChart || []} />
                </div>
            </div>

            {/* MENTOR FOCUS AREAS */}
            <div className="bg-white dark:bg-[#1a2036] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl">
                <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Top Mentor Focus Areas</h3>
                <TopicChart data={stats?.mentorAnalytics?.focusAreas || []} />
            </div>

            {/* FEEDBACK & RATINGS */}
            <div className="bg-white dark:bg-[#1a2036] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl">
                <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">User Satisfaction & Feedback</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Star className="text-yellow-500 fill-yellow-500" size={20} />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mentee → Mentor</span>
                        </div>
                        <p className="text-3xl font-bold text-yellow-600">{stats?.feedback?.menteeToMentor?.avg?.toFixed(2) || "0.00"}</p>
                        <p className="text-xs text-gray-500 mt-1">{stats?.feedback?.menteeToMentor?.count} reviews</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Star className="text-blue-500 fill-blue-500" size={20} />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mentor → Mentee</span>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">{stats?.feedback?.mentorToMentee?.avg?.toFixed(2) || "0.00"}</p>
                        <p className="text-xs text-gray-500 mt-1">{stats?.feedback?.mentorToMentee?.count} reviews</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="text-green-500" size={20} />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Satisfaction</span>
                        </div>
                        <p className="text-3xl font-bold text-green-600">
                            {((stats?.feedback?.menteeToMentor?.avg + stats?.feedback?.mentorToMentee?.avg) / 2).toFixed(2) || "0.00"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Average Rating</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
