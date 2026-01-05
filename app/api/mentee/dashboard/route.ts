import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose, { isValidObjectId } from "mongoose";
import dbConnect from "@/lib/mongodb";
import Mentee from "@/models/Mentee";
import AiInterview from "@/models/AiInterview";
import Session from "@/models/Session";
import Goal from "@/models/Goal";
import JobInterview from "@/models/JobInterview";
import User from "@/models/User";

export const dynamic = "force-dynamic";

type TokenPayload = JwtPayload & {
    id?: string;
    _id?: string;
};

export async function GET(req: Request) {
    try {
        await dbConnect();

        // 1. Auth Validation
        const auth = req.headers.get("authorization") || "";
        let token = "";
        if (auth.startsWith("Bearer ")) token = auth.slice(7);

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const secret = process.env.JWT_SECRET!;
        let payload: TokenPayload;
        try {
            payload = jwt.verify(token, secret) as TokenPayload;
        } catch {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const userId = String(payload.id || payload._id || "");
        if (!isValidObjectId(userId)) {
            return NextResponse.json({ message: "Invalid user ID" }, { status: 401 });
        }

        // 2. Fetch Mentee Profile
        const mentee = await Mentee.findOne({ user: new mongoose.Types.ObjectId(userId) }).lean();
        if (!mentee) {
            return NextResponse.json({ message: "Mentee profile not found" }, { status: 404 });
        }
        const menteeId = mentee._id;

        // 3. Fetch Data

        // A. Stats (from Mentee model + aggregation)
        // We can also aggregate AiInterviews for more precise stats if Mentee model is not updated
        // For now, let's trust Mentee model keys but also calculate some fresh ones.

        // Calculate total practice time (minutes) from AiInterviews
        // The AiInterview model has 'duration' in seconds.
        const aiInterviews = await AiInterview.find({
            $or: [
                { mentee: menteeId },
                { mentee: new mongoose.Types.ObjectId(userId) }
            ]
        })
            .sort({ createdAt: -1 })
            .lean();

        console.log(`[Dashboard Debug] Searching with MenteeID: ${menteeId} OR UserID: ${userId}`);
        console.log(`[Dashboard Debug] Found ${aiInterviews.length} AI interviews.`);
        if (aiInterviews.length > 0) {
            console.log(`[Dashboard Debug] Latest Interview: ID=${aiInterviews[0]._id}, CreatedAt=${aiInterviews[0].createdAt}, Score=${aiInterviews[0].overallScore}`);
        }

        // Merge interviews for history
        // User requested to use aiinterviews collection for scores/stats.
        // Assuming AiInterview model covers all relevant interviews.
        const allInterviews = aiInterviews; // already sorted desc

        const totalInterviews = allInterviews.length;

        let totalDurationSeconds = 0;
        let totalScoreSum = 0;
        let validScoreCount = 0;

        allInterviews.forEach(i => {
            if (i.duration) totalDurationSeconds += i.duration;
            if (i.overallScore !== undefined && i.overallScore !== null) {
                totalScoreSum += i.overallScore;
                validScoreCount++;
            }
        });

        const averageScore = validScoreCount > 0 ? (totalScoreSum / validScoreCount).toFixed(1) : 0;
        const totalHours = (totalDurationSeconds / 3600).toFixed(1);

        // Fetch TimeSlots for this mentee to calculate session-based stats
        const TimeSlot = (await import('@/models/TimeSlot')).default;
        const timeSlots = await TimeSlot.find({
            $or: [
                { mentee: userId },
                { mentee: menteeId }
            ],
            status: 'booked'
        }).lean();

        // Calculate Active Days: unique days with AI interviews OR scheduled sessions
        const activeDaysSet = new Set<string>();

        // Add days from AI interviews
        allInterviews.forEach(i => {
            const date = new Date(i.createdAt || i.startedAt);
            if (!isNaN(date.getTime())) {
                activeDaysSet.add(date.toDateString());
            }
        });

        // Add days from scheduled sessions
        timeSlots.forEach((slot: any) => {
            const date = new Date(slot.startTime);
            if (!isNaN(date.getTime())) {
                activeDaysSet.add(date.toDateString());
            }
        });

        const activeDays = activeDaysSet.size;

        // Calculate total hours from scheduled sessions
        const sessionHoursTotal = timeSlots.reduce((acc: number, slot: any) => {
            return acc + ((slot.duration || 0) / 60); // duration is in minutes
        }, 0);

        // Calculate this week's stats
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const interviewsThisWeek = allInterviews.filter(i => {
            const date = new Date(i.createdAt || i.startedAt);
            return date >= oneWeekAgo;
        });

        const timeThisWeekSeconds = interviewsThisWeek.reduce((acc, curr) => acc + (curr.duration || 0), 0);
        const hoursThisWeek = (timeThisWeekSeconds / 3600).toFixed(1);

        const stats = {
            overallScore: averageScore,
            totalInterviews: totalInterviews,
            hoursThisWeek: hoursThisWeek,
            totalHours: sessionHoursTotal.toFixed(1), // Hours from scheduled sessions
            activeDays: activeDays // New field: unique days with activity
        };

        // B. Weekly Performance Chart (Last 7 days scores)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Improve: Key strictly by Date String to avoid overwrites
        const weeklyData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dayStr = days[d.getDay()];
            // Find interviews on this specific date
            const dayInterviews = interviewsThisWeek.filter(interview => {
                const iDate = new Date(interview.createdAt || interview.startedAt);
                return iDate.toDateString() === d.toDateString();
            });

            let dayScore = 0;
            let dayTime = 0;
            if (dayInterviews.length > 0) {
                const scoreSum = dayInterviews.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
                dayScore = scoreSum / dayInterviews.length;
                dayTime = dayInterviews.reduce((acc, curr) => acc + (curr.duration || 0), 0) / 3600;
            }

            // Scale score to 0-10 if it's 0-100
            const scaledScore = dayScore > 10 ? dayScore / 10 : dayScore;

            weeklyData.push({
                day: dayStr,
                score: Number(scaledScore.toFixed(1)),
                time: Number(dayTime.toFixed(1))
            });
        }


        // C. Upcoming Interviews (Sessions)
        // Status: 'confirmed', 'pending_acceptance', 'pending_payment'
        const upcomingSessions = await Session.find({
            mentee: menteeId,
            scheduledTime: { $gte: now },
            status: { $in: ['confirmed', 'pending_acceptance', 'pending_payment'] }
        })
            .sort({ scheduledTime: 1 })
            .limit(3)
            .lean();

        const formattedUpcoming = upcomingSessions.map(s => ({
            id: s._id,
            title: s.topic,
            type: s.sessionType, // 'technical', 'behavioral' etc ?
            time: new Date(s.scheduledTime).toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: 'numeric' }),
            duration: `${s.duration} min`
        }));


        // D. Current Goals
        const goals = await Goal.find({ mentee: menteeId, achived: false })
            .limit(3)
            .lean();

        // Mock progress if not in DB (Goal model has no progress field, only 'achived')
        // Maybe we just show them. Or we can assume goals might be linked to metrics later.
        // For now we return what we have.
        const formattedGoals = goals.map(g => ({
            id: g._id,
            title: g.title,
            progress: 0, // No progress field in model
            current: 0,
            target: 100 // Mock
        }));


        // E. Recent Achievements (Recent high scores or completed goals)
        // Let's use recent finished interviews with high scores (> 80)
        const recentHighScores = allInterviews
            .filter(i => (i.overallScore || 0) >= 80) // 80/100
            .slice(0, 3);

        const formattedAchievements = recentHighScores.map(i => ({
            id: i._id,
            title: `High Score: ${(i.overallScore || 0).toFixed(0)}%`, // e.g. "High Score: 90%"
            icon: "Trophy", // Signal to UI to use Trophy icon
            color: "text-amber-400",
            date: new Date(i.createdAt || i.startedAt).toLocaleDateString()
        }));

        // F. Last AI Interview Insights
        // Fetch strictly the last AI interview regardless of score
        const lastAiInterview = aiInterviews.length > 0 ? aiInterviews[0] : null; // aiInterviews is already sorted desc

        let lastInterviewFeedback = null;
        if (lastAiInterview) {
            let dateStr = "N/A";
            try {
                if (lastAiInterview.createdAt) {
                    dateStr = new Date(lastAiInterview.createdAt).toLocaleDateString();
                }
            } catch (e) {
                console.error("Date error:", e);
            }

            lastInterviewFeedback = {
                id: lastAiInterview._id,
                date: dateStr,
                score: lastAiInterview.overallScore || 0,
                strengths: lastAiInterview.strengths || [],
                improvements: lastAiInterview.improvements || [],
                skills: [
                    ...(lastAiInterview.techstack && typeof lastAiInterview.techstack === 'string' ? lastAiInterview.techstack.split(',').map((s: string) => s.trim()) : []),
                    lastAiInterview.type,
                    lastAiInterview.role
                ].filter(Boolean)
            };
        }

        // G. Monthly Performance Data (Last 6 Months)
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyDataMap = new Map<string, { scores: number[], count: number, sessionHours: number }>();

        // Process AI interviews by month
        allInterviews.forEach(i => {
            const date = new Date(i.createdAt || i.startedAt);
            if (date >= sixMonthsAgo) {
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!monthlyDataMap.has(monthKey)) {
                    monthlyDataMap.set(monthKey, { scores: [], count: 0, sessionHours: 0 });
                }
                const data = monthlyDataMap.get(monthKey)!;
                if (i.overallScore !== undefined && i.overallScore !== null) {
                    data.scores.push(i.overallScore);
                }
                data.count++;
            }
        });

        // Process sessions by month
        timeSlots.forEach((slot: any) => {
            const date = new Date(slot.startTime);
            if (date >= sixMonthsAgo) {
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!monthlyDataMap.has(monthKey)) {
                    monthlyDataMap.set(monthKey, { scores: [], count: 0, sessionHours: 0 });
                }
                const data = monthlyDataMap.get(monthKey)!;
                data.sessionHours += (slot.duration || 0) / 60;
            }
        });

        // Format monthly data
        const monthlyData = Array.from(monthlyDataMap.entries())
            .map(([month, data]) => ({
                month,
                avgScore: data.scores.length > 0 ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length : 0,
                interviewCount: data.count,
                sessionHours: Number(data.sessionHours.toFixed(1))
            }))
            .sort((a, b) => a.month.localeCompare(b.month));

        // H. Skills Breakdown (Extract from AI interviews)
        const skillsMap = new Map<string, { totalScore: number, count: number }>();
        allInterviews.forEach(i => {
            const skills = [
                ...(i.techstack && typeof i.techstack === 'string' ? i.techstack.split(',').map((s: string) => s.trim()) : []),
                i.type,
                i.role
            ].filter(Boolean);

            skills.forEach(skill => {
                if (!skillsMap.has(skill)) {
                    skillsMap.set(skill, { totalScore: 0, count: 0 });
                }
                const data = skillsMap.get(skill)!;
                if (i.overallScore !== undefined && i.overallScore !== null) {
                    data.totalScore += i.overallScore;
                    data.count++;
                }
            });
        });

        const skillsBreakdown = Array.from(skillsMap.entries())
            .map(([skill, data]) => ({
                skill,
                avgScore: data.count > 0 ? data.totalScore / data.count : 0,
                attempts: data.count
            }))
            .sort((a, b) => b.attempts - a.attempts)
            .slice(0, 10);

        // I. Activity Pattern (Last 30 days heatmap data)
        const activityPattern = [];
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateKey = d.toISOString().split('T')[0];

            const count = allInterviews.filter(inv => {
                const iDate = new Date(inv.createdAt || inv.startedAt);
                return iDate.toDateString() === d.toDateString();
            }).length + timeSlots.filter((slot: any) => {
                const sDate = new Date(slot.startTime);
                return sDate.toDateString() === d.toDateString();
            }).length;

            activityPattern.push({ date: dateKey, count });
        }

        // J. Session Metrics
        const sessionMetrics = {
            totalBooked: timeSlots.length,
            totalCompleted: timeSlots.filter((s: any) => s.status === 'booked' && new Date(s.endTime) < now).length,
            completionRate: timeSlots.length > 0
                ? Math.round((timeSlots.filter((s: any) => s.status === 'booked' && new Date(s.endTime) < now).length / timeSlots.length) * 100)
                : 0,
            avgDuration: timeSlots.length > 0
                ? Math.round(timeSlots.reduce((acc: number, s: any) => acc + (s.duration || 0), 0) / timeSlots.length)
                : 0
        };

        // K. Progress Metrics
        const recentInterviews = allInterviews.slice(0, 5);
        const olderInterviews = allInterviews.slice(5, 10);

        const recentAvg = recentInterviews.length > 0
            ? recentInterviews.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / recentInterviews.length
            : 0;
        const olderAvg = olderInterviews.length > 0
            ? olderInterviews.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / olderInterviews.length
            : recentAvg;

        // Calculate Streak
        let currentStreak = 0;
        const checkDate = new Date(now);
        while (true) {
            const hasActivity = allInterviews.some(inv => new Date(inv.createdAt || inv.startedAt).toDateString() === checkDate.toDateString()) ||
                timeSlots.some((slot: any) => new Date(slot.startTime).toDateString() === checkDate.toDateString());

            if (hasActivity) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
            if (currentStreak > 365) break;
        }

        const progressMetrics = {
            improvement: olderAvg > 0 ? Math.round(((recentAvg - olderAvg) / olderAvg) * 100) : 0,
            consistency: validScoreCount > 1
                ? Math.max(0, 100 - (Math.sqrt(allInterviews.reduce((acc, curr) => acc + Math.pow((curr.overallScore || 0) - Number(averageScore), 2), 0) / validScoreCount) * 2))
                : 100,
            currentStreak
        };

        return NextResponse.json({
            stats,
            weeklyData,
            upcomingInterviews: formattedUpcoming,
            currentGoals: formattedGoals,
            recentAchievements: formattedAchievements,
            lastInterviewFeedback,
            // New analytics data
            monthlyData,
            skillsBreakdown,
            activityPattern,
            sessionMetrics,
            progressMetrics
        });

    } catch (error: any) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
