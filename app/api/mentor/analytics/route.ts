// app/api/mentor/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TimeSlot from '@/models/TimeSlot';
import MentorFeedback from '@/models/MentorFeedback';
import Mentor from '@/models/Mentor';
import Mentee from '@/models/Mentee';
import User from '@/models/User';
import { getUserFromToken } from '@/lib/auth-helper';

export async function GET(request: NextRequest) {
    try {
        console.log('[Analytics API] Request received');

        // Use existing auth helper
        const authData = await getUserFromToken(request);

        if (!authData || authData.role !== 'mentor') {
            console.log('[Analytics API] Unauthorized - not a mentor');
            return NextResponse.json(
                { error: 'Unauthorized - Mentor authentication required' },
                { status: 401 }
            );
        }

        console.log('[Analytics API] Authenticated user:', authData.email);

        await dbConnect();
        console.log('[Analytics API] DB connected');

        // Get mentor profile
        const mentor = await Mentor.findOne({ user: authData.id });
        if (!mentor) {
            console.log('[Analytics API] Mentor profile not found');
            return NextResponse.json(
                { error: 'Mentor profile not found' },
                { status: 404 }
            );
        }

        const mentorId = mentor._id;
        console.log('[Analytics API] Mentor ID:', mentorId);

        // Get time period from query params (default: 6 months)
        const { searchParams } = new URL(request.url);
        const months = parseInt(searchParams.get('months') || '6');
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        console.log('[Analytics API] Fetching data for last', months, 'months');

        // 1. EARNINGS ANALYTICS - Using TimeSlots
        const bookedSlots = await TimeSlot.find({
            mentor: mentorId,
            status: 'booked',
            startTime: { $gte: startDate }
        }).lean();

        console.log('[Analytics API] Found', bookedSlots.length, 'booked slots');

        // Calculate earnings from booked slots
        let totalEarnings = 0;
        let pendingEarnings = 0;
        const earningsByMonth: { [key: string]: number } = {};
        const sessionsByMonth: { [key: string]: number } = {};
        const revenueByType: { [key: string]: { revenue: number; count: number } } = {};

        const referenceDate = new Date();

        for (const slot of bookedSlots) {
            // Get price from sessionOffering
            const offeringId = slot.sessionOffering;
            if (!offeringId) continue;

            const offering = mentor.sessionOfferings.find(
                (o: any) => o._id?.toString() === offeringId.toString()
            );

            const priceInCents = offering?.price || 0;
            const priceInDollars = priceInCents / 100; // Convert cents to dollars

            const isCompleted = new Date(slot.endTime) < referenceDate;

            if (isCompleted) {
                totalEarnings += priceInDollars;

                // Monthly trend
                const monthKey = new Date(slot.startTime).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short'
                });
                earningsByMonth[monthKey] = (earningsByMonth[monthKey] || 0) + priceInDollars;
                sessionsByMonth[monthKey] = (sessionsByMonth[monthKey] || 0) + 1;

                // Revenue by type
                const type = offering?.title || offering?.sessionType || 'Other';
                if (!revenueByType[type]) {
                    revenueByType[type] = { revenue: 0, count: 0 };
                }
                revenueByType[type].revenue += priceInDollars;
                revenueByType[type].count += 1;
            } else {
                // Future booked session -> Pending Earnings
                pendingEarnings += priceInDollars;
            }
        }

        const earningsTrend = Object.keys(earningsByMonth)
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
            .map(month => ({
                month,
                earnings: earningsByMonth[month], // Already in dollars
                sessions: sessionsByMonth[month]
            }));

        const revenueBreakdown = Object.keys(revenueByType).map(type => ({
            type,
            revenue: revenueByType[type].revenue, // Already in dollars
            sessions: revenueByType[type].count,
            percentage: totalEarnings > 0
                ? ((revenueByType[type].revenue / totalEarnings) * 100).toFixed(1)
                : '0'
        }));

        // Removed old "Available Slots" pending calculation to align with Earnings Page "Pending" definition (Future Booked)
        // 2. SESSION STATISTICS - Using TimeSlots
        const allSlots = await TimeSlot.find({ mentor: mentorId }).lean();
        const totalSlots = allSlots.length;
        const bookedCount = allSlots.filter((s: any) => s.status === 'booked').length;
        const availableCount = allSlots.filter((s: any) => s.status === 'available').length;
        const blockedCount = allSlots.filter((s: any) => s.status === 'blocked').length;
        const completionRate = totalSlots > 0 ? ((bookedCount / totalSlots) * 100).toFixed(1) : '0';

        // Sessions by status
        const sessionsByStatus: { [key: string]: number } = {
            booked: bookedCount,
            available: availableCount,
            blocked: blockedCount
        };

        // Sessions by type
        const sessionsByType: { [key: string]: number } = {};
        for (const slot of allSlots) {
            if (!(slot as any).sessionOffering) continue;
            const offering = mentor.sessionOfferings.find(
                (o: any) => o._id?.toString() === (slot as any).sessionOffering.toString()
            );
            const type = offering?.title || offering?.sessionType || 'Other';
            sessionsByType[type] = (sessionsByType[type] || 0) + 1;
        }

        const sessionTypeStats = Object.keys(sessionsByType).map(type => ({
            type,
            count: sessionsByType[type]
        }));

        // 3. FEEDBACK ANALYTICS
        const feedbacks = await MentorFeedback.find({ mentor: mentorId })
            .populate('mentee', 'user')
            .populate({
                path: 'mentee',
                populate: {
                    path: 'user',
                    select: 'full_name profile_photo'
                }
            })
            .sort({ createdAt: -1 });

        const totalFeedback = feedbacks.length;
        const avgRating = totalFeedback > 0
            ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedback).toFixed(1)
            : '0';

        // Rating distribution
        const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
            rating,
            count: feedbacks.filter(f => f.rating === rating).length
        }));

        // Recent feedback (last 10)
        const recentFeedback = feedbacks.slice(0, 10).map(f => ({
            id: f._id,
            mentee: {
                name: (f.mentee as any)?.user?.full_name || 'Unknown',
                photo: (f.mentee as any)?.user?.profile_photo || ''
            },
            rating: f.rating,
            reviewText: f.reviewText,
            date: f.createdAt
        }));

        // 4. MENTEES DATA
        // Only get slots that have mentees (booked slots)
        const slotsWithMentees = allSlots.filter((s: any) => s.mentee);
        const uniqueMenteeIds = [...new Set(slotsWithMentees.map((s: any) => s.mentee.toString()))];

        console.log('[Analytics API] Found', uniqueMenteeIds.length, 'unique mentees');

        const mentees = await Mentee.find({ _id: { $in: uniqueMenteeIds } })
            .populate('user', 'full_name email profile_photo');

        const menteesData = await Promise.all(
            mentees.map(async (mentee) => {
                const menteeSessions = slotsWithMentees.filter(
                    (s: any) => s.mentee.toString() === mentee._id.toString()
                );
                const completedMenteeSessions = menteeSessions.filter((s: any) => s.status === 'booked');

                const menteeFeedbacks = feedbacks.filter(f => {
                    const fMenteeId = (f.mentee as any)?._id || f.mentee;
                    return fMenteeId?.toString() === mentee._id.toString();
                });
                const avgMenteeRating = menteeFeedbacks.length > 0
                    ? (menteeFeedbacks.reduce((sum, f) => sum + f.rating, 0) / menteeFeedbacks.length).toFixed(1)
                    : null;

                const lastSession = menteeSessions
                    .sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];

                return {
                    id: mentee._id,
                    name: (mentee.user as any)?.full_name || 'Unknown',
                    email: (mentee.user as any)?.email || '',
                    photo: (mentee.user as any)?.profile_photo || '',
                    totalSessions: menteeSessions.length,
                    completedSessions: completedMenteeSessions.length,
                    lastSessionDate: (lastSession as any)?.startTime || null,
                    averageRating: avgMenteeRating
                };
            })
        );

        // 5. PERFORMANCE INSIGHTS
        // Calculate growth (compare last month vs previous month) - Fixed duplicates

        const lastMonthStart = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1, 1);
        const lastMonthEnd = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 0);
        const prevMonthStart = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 2, 1);
        const prevMonthEnd = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1, 0);

        const lastMonthSlots = bookedSlots.filter((s: any) => {
            const date = new Date(s.startTime);
            return date >= lastMonthStart && date <= lastMonthEnd;
        });

        const prevMonthSlots = bookedSlots.filter((s: any) => {
            const date = new Date(s.startTime);
            return date >= prevMonthStart && date <= prevMonthEnd;
        });

        let lastMonthEarnings = 0;
        for (const slot of lastMonthSlots) {
            if (!(slot as any).sessionOffering) continue;
            const offering = mentor.sessionOfferings.find(
                (o: any) => o._id?.toString() === (slot as any).sessionOffering.toString()
            );
            lastMonthEarnings += (offering?.price || 0) / 100; // Convert cents to dollars
        }

        let prevMonthEarnings = 0;
        for (const slot of prevMonthSlots) {
            if (!(slot as any).sessionOffering) continue;
            const offering = mentor.sessionOfferings.find(
                (o: any) => o._id?.toString() === (slot as any).sessionOffering.toString()
            );
            prevMonthEarnings += (offering?.price || 0) / 100; // Convert cents to dollars
        }

        const earningsGrowth = prevMonthEarnings > 0
            ? (((lastMonthEarnings - prevMonthEarnings) / prevMonthEarnings) * 100).toFixed(1)
            : '0';

        console.log('[Analytics API] Returning data');

        // Response
        return NextResponse.json({
            success: true,
            data: {
                // KPIs
                kpis: {
                    totalEarnings: totalEarnings,
                    totalSessions: totalSlots,
                    completedSessions: bookedCount,
                    averageRating: parseFloat(avgRating),
                    activeMentees: uniqueMenteeIds.length,
                    pendingEarnings: pendingEarnings,
                    completionRate: parseFloat(completionRate)
                },

                // Earnings
                earnings: {
                    trend: earningsTrend,
                    breakdown: revenueBreakdown,
                    total: totalEarnings,
                    pending: pendingEarnings,
                    growth: parseFloat(earningsGrowth)
                },

                // Sessions
                sessions: {
                    total: totalSlots,
                    completed: bookedCount,
                    completionRate: parseFloat(completionRate),
                    byStatus: sessionsByStatus,
                    byType: sessionTypeStats
                },

                // Feedback
                feedback: {
                    total: totalFeedback,
                    averageRating: parseFloat(avgRating),
                    distribution: ratingDistribution,
                    recent: recentFeedback
                },

                // Mentees
                mentees: {
                    total: uniqueMenteeIds.length,
                    list: menteesData
                },

                // Performance
                performance: {
                    earningsGrowth: parseFloat(earningsGrowth),
                    topSessionType: sessionTypeStats.sort((a, b) => b.count - a.count)[0]?.type || 'N/A'
                }
            }
        });

    } catch (error) {
        console.error('Error fetching mentor analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics data', details: (error as Error).message },
            { status: 500 }
        );
    }
}
