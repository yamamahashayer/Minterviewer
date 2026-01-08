// app/api/mentor/overview/route.ts
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
        console.log('[Overview API] Request received');

        // 1. Authentication
        const authData = await getUserFromToken(request);

        if (!authData || authData.role !== 'mentor') {
            return NextResponse.json(
                { error: 'Unauthorized - Mentor authentication required' },
                { status: 401 }
            );
        }

        await dbConnect();

        // 2. Get Mentor Profile
        const mentor = await Mentor.findOne({ user: authData.id });
        if (!mentor) {
            console.log('[Overview API] Mentor profile not found');
            return NextResponse.json(
                { error: 'Mentor profile not found' },
                { status: 404 }
            );
        }
        const mentorId = mentor._id;
        console.log('[Overview API] Mentor ID:', mentorId);

        // 3. Get Upcoming Sessions
        // Find booked slots with startTime > now, limit 5, sorted by time asc
        const upcomingSlots = await TimeSlot.find({
            mentor: mentorId,
            status: 'booked',
            startTime: { $gt: new Date() }
        })
            .sort({ startTime: 1 })
            .limit(3)
            .populate({
                path: 'mentee',
                select: 'full_name profile_photo'
            })
            .lean();

        console.log('[Overview API] Found', upcomingSlots.length, 'upcoming slots');

        const formattedSessions = upcomingSlots.map((slot: any) => {
            // Find offering to get details
            const offeringId = slot.sessionOffering;
            const offering = mentor.sessionOfferings.find(
                (o: any) => o._id?.toString() === offeringId?.toString()
            );

            // Format date and time
            const dateObj = new Date(slot.startTime);
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

            // Mock colors for now (could be stored in offering type or randomized)
            const type = offering?.title || 'Session';
            const colors = getSessionColors(type);

            // Log if something is missing
            if (!slot.mentee) console.log('[Overview API] Warning: Slot', slot._id, 'has no mentee');

            return {
                id: slot._id,
                mentee: slot.mentee?.full_name || 'Unknown User',
                menteePhoto: slot.mentee?.profile_photo || '',
                type: type,
                date: dateStr,
                time: timeStr,
                color: colors.color,
                borderColor: colors.borderColor
            };
        });

        console.log('[Overview API] Sessions formatted');

        // 4. Get Performance Stats
        const feedbacks = await MentorFeedback.find({ mentor: mentorId }).lean();
        console.log('[Overview API] Found', feedbacks.length, 'feedbacks');

        const avgRating = feedbacks.length > 0
            ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
            : '0'; // e.g. "4.8"

        // Satisfaction % (assuming 4+ stars is "satisfied")
        const positiveFeedbacks = feedbacks.filter(f => f.rating >= 4).length;
        const satisfactionRate = feedbacks.length > 0
            ? Math.round((positiveFeedbacks / feedbacks.length) * 100)
            : 0;

        // Sessions this week
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startOfWeek.setHours(0, 0, 0, 0);

        const sessionsThisWeekCount = await TimeSlot.countDocuments({
            mentor: mentorId,
            status: 'booked',
            startTime: { $gte: startOfWeek }
        });

        // XP / Rank Calculation (Mock logic based on verified sessions/ratings)
        // Level 1: 0-10 sessions
        // Level 2: 10-50 sessions
        // Level 3: 50+ sessions
        const totalSessions = await TimeSlot.countDocuments({
            mentor: mentorId,
            status: 'booked',
            startTime: { $lt: new Date() } // completed
        });

        let level = 1;
        let xp = totalSessions * 10 + feedbacks.length * 5; // Simple XP formula
        let nextLevelXp = 100;

        if (xp > 500) { level = 3; nextLevelXp = 1000; }
        else if (xp > 100) { level = 2; nextLevelXp = 500; }

        const progress = Math.min(Math.round((xp / nextLevelXp) * 100), 100);

        // 5. Mentees Progress (Mock data for now as we don't track mentee improvement explicitly yet)
        // We can show "Sessions per week" trend as a proxy for activity
        const weeklyActivity = await getWeeklyActivity(mentorId);

        return NextResponse.json({
            success: true,
            data: {
                upcomingSessions: formattedSessions,
                stats: {
                    satisfaction: `${satisfactionRate}%`,
                    sessionsThisWeek: sessionsThisWeekCount,
                    rank: `#${level}`, // Simplified rank
                    level: level,
                    xp: xp,
                    maxXp: nextLevelXp,
                    progress: progress
                },
                progressChart: weeklyActivity
            }
        });

    } catch (error) {
        console.error('[Overview API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch overview data', details: (error as Error).message },
            { status: 500 }
        );
    }
}

function getSessionColors(type: string) {
    const t = type.toLowerCase();
    if (t.includes('technical') || t.includes('code')) {
        return { color: 'from-cyan-500 to-blue-500', borderColor: 'border-cyan-500/30' };
    }
    if (t.includes('behavioral') || t.includes('hr')) {
        return { color: 'from-teal-500 to-green-500', borderColor: 'border-teal-500/30' };
    }
    return { color: 'from-purple-500 to-pink-500', borderColor: 'border-purple-500/30' };
}

async function getWeeklyActivity(mentorId: any) {
    // Get last 7 weeks activity
    const weeks = [];
    for (let i = 6; i >= 0; i--) {
        const start = new Date();
        start.setDate(start.getDate() - (i * 7) - 7);
        const end = new Date();
        end.setDate(end.getDate() - (i * 7));

        const count = await TimeSlot.countDocuments({
            mentor: mentorId,
            status: 'booked',
            startTime: { $gte: start, $lt: end }
        });

        weeks.push({
            week: `Week ${7 - i}`,
            progress: count // Using session count as proxy for activity/progress
        });
    }
    return weeks;
}
