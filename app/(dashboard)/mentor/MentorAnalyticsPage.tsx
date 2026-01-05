"use client";

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import {
    DollarSign,
    TrendingUp,
    Calendar,
    Star,
    Users,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    PieChart,
    Activity,
    Award,
    Clock,
    MessageSquare,
    Mail,
    Video
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

interface AnalyticsData {
    kpis: {
        totalEarnings: number;
        totalSessions: number;
        completedSessions: number;
        averageRating: number;
        activeMentees: number;
        pendingEarnings: number;
        completionRate: number;
    };
    earnings: {
        trend: Array<{ month: string; earnings: number; sessions: number }>;
        breakdown: Array<{ type: string; revenue: number; sessions: number; percentage: string }>;
        total: number;
        pending: number;
        growth: number;
    };
    sessions: {
        total: number;
        completed: number;
        completionRate: number;
        byStatus: { [key: string]: number };
        byType: Array<{ type: string; count: number }>;
    };
    feedback: {
        total: number;
        averageRating: number;
        distribution: Array<{ rating: number; count: number }>;
        recent: Array<{
            id: string;
            mentee: { name: string; photo: string };
            rating: number;
            reviewText: string;
            date: string;
        }>;
    };
    mentees: {
        total: number;
        list: Array<{
            id: string;
            name: string;
            email: string;
            photo: string;
            totalSessions: number;
            completedSessions: number;
            lastSessionDate: string | null;
            averageRating: string | null;
        }>;
    };
    performance: {
        earningsGrowth: number;
        topSessionType: string;
    };
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

export const MentorAnalyticsPage = () => {
    const [timePeriod, setTimePeriod] = useState('6');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAnalytics();
    }, [timePeriod]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem('token');

            console.log('Fetching analytics with token:', token ? 'Token exists' : 'No token');

            const response = await fetch(`/api/mentor/analytics?months=${timePeriod}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('API Error:', errorData);
                throw new Error(`Failed to fetch analytics: ${errorData.error || response.statusText}`);
            }

            const result = await response.json();
            console.log('Analytics data received:', result);
            setData(result.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError(err instanceof Error ? err.message : 'Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-center h-96">
                    <div className="text-[var(--foreground-muted)]">Loading analytics...</div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-center h-96">
                    <div className="text-red-400">{error || 'No data available'}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-[var(--foreground)] mb-2">Analytics Overview</h1>
                        <p className="text-[var(--foreground-muted)]">
                            Comprehensive insights into your mentoring performance
                        </p>
                    </div>
                    <Select value={timePeriod} onValueChange={setTimePeriod}>
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="3">Last 3 months</SelectItem>
                            <SelectItem value="6">Last 6 months</SelectItem>
                            <SelectItem value="12">Last 12 months</SelectItem>
                            <SelectItem value="24">Last 2 years</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 backdrop-blur-xl border border-green-500/30 p-5"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-400" />
                            </div>
                            {data.earnings.growth !== 0 && (
                                <Badge className={`${data.earnings.growth > 0 ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                                    {data.earnings.growth > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                    {Math.abs(data.earnings.growth)}%
                                </Badge>
                            )}
                        </div>
                        <p className="text-[var(--foreground-muted)] text-sm mb-1">Total Earnings</p>
                        <p className="text-[var(--foreground)] text-2xl font-bold">${data.kpis.totalEarnings.toLocaleString()}</p>
                        <p className="text-[var(--foreground-subtle)] text-xs mt-1">
                            ${data.kpis.pendingEarnings.toFixed(2)} pending
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 p-5"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-purple-400" />
                            </div>
                        </div>
                        <p className="text-[var(--foreground-muted)] text-sm mb-1">Total Sessions</p>
                        <p className="text-[var(--foreground)] text-2xl font-bold">{data.kpis.totalSessions}</p>
                        <p className="text-[var(--foreground-subtle)] text-xs mt-1">
                            {data.kpis.completedSessions} completed
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/30 p-5"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg flex items-center justify-center">
                                <Star className="w-6 h-6 text-yellow-400" />
                            </div>
                        </div>
                        <p className="text-[var(--foreground-muted)] text-sm mb-1">Average Rating</p>
                        <p className="text-[var(--foreground)] text-2xl font-bold">{data.kpis.averageRating.toFixed(1)}</p>
                        <p className="text-[var(--foreground-subtle)] text-xs mt-1">
                            {data.feedback.total} reviews
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 p-5"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>
                        <p className="text-[var(--foreground-muted)] text-sm mb-1">Active Mentees</p>
                        <p className="text-[var(--foreground)] text-2xl font-bold">{data.kpis.activeMentees}</p>
                        <p className="text-[var(--foreground-subtle)] text-xs mt-1">
                            {data.kpis.completionRate.toFixed(0)}% completion rate
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Charts Section */}
            <Tabs defaultValue="earnings" className="mb-6">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="earnings">Earnings</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                    <TabsTrigger value="mentees">Mentees</TabsTrigger>
                </TabsList>

                {/* EARNINGS TAB */}
                <TabsContent value="earnings">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Earnings Trend */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="relative overflow-hidden rounded-xl backdrop-blur-xl border border-purple-500/30 p-6"
                                style={{ background: 'var(--card)' }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                    <div>
                                        <h3 className="text-[var(--foreground)]">Revenue Trend</h3>
                                        <p className="text-[var(--foreground-muted)] text-sm">Monthly earnings overview</p>
                                    </div>
                                </div>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data.earnings.trend}>
                                            <defs>
                                                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1f2937',
                                                    border: '1px solid #10b981',
                                                    borderRadius: '8px',
                                                    color: '#fff'
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="earnings"
                                                stroke="#10b981"
                                                strokeWidth={3}
                                                fill="url(#colorEarnings)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        </div>

                        {/* Revenue Breakdown */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative overflow-hidden rounded-xl backdrop-blur-xl border border-purple-500/30 p-6"
                            style={{ background: 'var(--card)' }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <PieChart className="w-5 h-5 text-purple-400" />
                                <div>
                                    <h3 className="text-[var(--foreground)]">Revenue by Type</h3>
                                    <p className="text-[var(--foreground-muted)] text-sm">Session breakdown</p>
                                </div>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPieChart>
                                        <Pie
                                            data={data.earnings.breakdown}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ percentage }) => `${percentage}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="revenue"
                                        >
                                            {data.earnings.breakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1f2937',
                                                border: '1px solid #8b5cf6',
                                                borderRadius: '8px',
                                                color: '#fff'
                                            }}
                                        />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-2 mt-4">
                                {data.earnings.breakdown.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                            />
                                            <span className="text-[var(--foreground-muted)]">{item.type}</span>
                                        </div>
                                        <span className="text-[var(--foreground)]">${item.revenue.toFixed(0)}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </TabsContent>

                {/* SESSIONS TAB */}
                <TabsContent value="sessions">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Sessions by Type */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative overflow-hidden rounded-xl backdrop-blur-xl border border-purple-500/30 p-6"
                            style={{ background: 'var(--card)' }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <BarChart3 className="w-5 h-5 text-blue-400" />
                                <div>
                                    <h3 className="text-[var(--foreground)]">Sessions by Type</h3>
                                    <p className="text-[var(--foreground-muted)] text-sm">Distribution overview</p>
                                </div>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.sessions.byType}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="type" stroke="#9ca3af" style={{ fontSize: '12px' }} angle={-45} textAnchor="end" height={100} />
                                        <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1f2937',
                                                border: '1px solid #3b82f6',
                                                borderRadius: '8px',
                                                color: '#fff'
                                            }}
                                        />
                                        <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Session Status */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative overflow-hidden rounded-xl backdrop-blur-xl border border-purple-500/30 p-6"
                            style={{ background: 'var(--card)' }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Activity className="w-5 h-5 text-purple-400" />
                                <div>
                                    <h3 className="text-[var(--foreground)]">Session Status</h3>
                                    <p className="text-[var(--foreground-muted)] text-sm">Current breakdown</p>
                                </div>
                            </div>

                            {/* Completion Rate Circle */}
                            <div className="flex items-center justify-center mb-6">
                                <div className="relative w-48 h-48">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="80"
                                            stroke="#374151"
                                            strokeWidth="12"
                                            fill="none"
                                        />
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="80"
                                            stroke="#10b981"
                                            strokeWidth="12"
                                            fill="none"
                                            strokeDasharray={`${(data.sessions.completionRate / 100) * 502.4} 502.4`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-bold text-[var(--foreground)]">
                                            {data.sessions.completionRate.toFixed(0)}%
                                        </span>
                                        <span className="text-sm text-[var(--foreground-muted)]">Completion Rate</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status List */}
                            <div className="space-y-3">
                                {Object.entries(data.sessions.byStatus).map(([status, count], index) => (
                                    <div
                                        key={status}
                                        className="flex items-center justify-between p-3 rounded-lg"
                                        style={{ background: 'var(--background-muted)' }}
                                    >
                                        <span className="text-[var(--foreground)] capitalize">
                                            {status.replace(/_/g, ' ')}
                                        </span>
                                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                                            {count}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </TabsContent>

                {/* FEEDBACK TAB */}
                <TabsContent value="feedback">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Rating Distribution */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative overflow-hidden rounded-xl backdrop-blur-xl border border-purple-500/30 p-6"
                            style={{ background: 'var(--card)' }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Star className="w-5 h-5 text-yellow-400" />
                                <div>
                                    <h3 className="text-[var(--foreground)]">Rating Distribution</h3>
                                    <p className="text-[var(--foreground-muted)] text-sm">Feedback breakdown</p>
                                </div>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.feedback.distribution} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                        <YAxis dataKey="rating" type="category" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1f2937',
                                                border: '1px solid #f59e0b',
                                                borderRadius: '8px',
                                                color: '#fff'
                                            }}
                                        />
                                        <Bar dataKey="count" fill="#f59e0b" radius={[0, 8, 8, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Recent Feedback */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="relative overflow-hidden rounded-xl backdrop-blur-xl border border-purple-500/30 p-6"
                                style={{ background: 'var(--card)' }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <MessageSquare className="w-5 h-5 text-green-400" />
                                    <div>
                                        <h3 className="text-[var(--foreground)]">Recent Feedback</h3>
                                        <p className="text-[var(--foreground-muted)] text-sm">Latest reviews</p>
                                    </div>
                                </div>
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {data.feedback.recent.map((feedback, index) => (
                                        <motion.div
                                            key={feedback.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="p-4 rounded-lg border"
                                            style={{ background: 'var(--background-muted)', borderColor: 'var(--border)' }}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                                        <span className="text-white text-sm">
                                                            {feedback.mentee.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[var(--foreground)] font-medium">
                                                            {feedback.mentee.name}
                                                        </p>
                                                        <p className="text-[var(--foreground-subtle)] text-xs">
                                                            {new Date(feedback.date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                    <span className="text-[var(--foreground)]">{feedback.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-[var(--foreground-muted)] text-sm">
                                                {feedback.reviewText}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </TabsContent>

                {/* MENTEES TAB */}
                <TabsContent value="mentees">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden rounded-xl backdrop-blur-xl border border-purple-500/30 p-6"
                        style={{ background: 'var(--card)' }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-blue-400" />
                                <div>
                                    <h3 className="text-[var(--foreground)]">Your Mentees</h3>
                                    <p className="text-[var(--foreground-muted)] text-sm">
                                        {data.mentees.total} total mentees
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.mentees.list.map((mentee, index) => (
                                <motion.div
                                    key={mentee.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-5 rounded-xl border hover:border-blue-500/50 transition-all"
                                    style={{ background: 'var(--background-muted)', borderColor: 'var(--border)' }}
                                >
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                            {mentee.photo ? (
                                                <img
                                                    src={mentee.photo}
                                                    alt={mentee.name}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-white font-medium">
                                                    {mentee.name.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[var(--foreground)] font-medium truncate">
                                                {mentee.name}
                                            </h4>
                                            <p className="text-[var(--foreground-subtle)] text-xs truncate">
                                                {mentee.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-[var(--foreground-muted)]">Sessions</span>
                                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                                {mentee.completedSessions}/{mentee.totalSessions}
                                            </Badge>
                                        </div>
                                        {mentee.averageRating && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-[var(--foreground-muted)]">Rating</span>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                    <span className="text-[var(--foreground)]">{mentee.averageRating}</span>
                                                </div>
                                            </div>
                                        )}
                                        {mentee.lastSessionDate && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-[var(--foreground-muted)]">Last Session</span>
                                                <span className="text-[var(--foreground-subtle)] text-xs">
                                                    {new Date(mentee.lastSessionDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="flex-1 bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500/30"
                                        >
                                            <Mail className="w-3 h-3 mr-1" />
                                            Message
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="flex-1 bg-purple-500/20 border border-purple-500/50 text-purple-300 hover:bg-purple-500/30"
                                        >
                                            <Video className="w-3 h-3 mr-1" />
                                            Schedule
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {data.mentees.list.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-[var(--foreground-muted)] mx-auto mb-4" />
                                <p className="text-[var(--foreground-muted)]">No mentees yet</p>
                                <p className="text-[var(--foreground-subtle)] text-sm">
                                    Start accepting sessions to build your mentee network
                                </p>
                            </div>
                        )}
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
