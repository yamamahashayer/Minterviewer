import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";
import Session from "@/models/Session";
import AiInterview from "@/models/AiInterview";
import CvAnalysis from "@/models/CvAnalysis";
import Feedback from "@/models/Feedback";
import MentorFeedback from "@/models/MentorFeedback";
import Job from "@/models/Job";
import Company from "@/models/Company";
import Mentor from "@/models/Mentor";
import Mentee from "@/models/Mentee";
import User from "@/models/User";
import mongoose from "mongoose";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // ============= EARNINGS (From Booked TimeSlots) =============
        const bookedSlots = await TimeSlot.find({ status: 'booked' })
            .populate({
                path: 'mentor',
                select: 'sessionOfferings'
            });

        let totalEarnings = 0;
        const earningsMap = new Map<string, number>(); // date -> amount

        bookedSlots.forEach((slot: any) => {
            if (slot.mentor && slot.mentor.sessionOfferings) {
                const offering = slot.mentor.sessionOfferings.find(
                    (off: any) => off._id.toString() === slot.sessionOffering.toString()
                );
                if (offering && offering.price) {
                    totalEarnings += offering.price;

                    // Group by date for chart
                    const date = new Date(slot.startTime).toISOString().split('T')[0];
                    earningsMap.set(date, (earningsMap.get(date) || 0) + offering.price);
                }
            }
        });

        const earningsChart = Array.from(earningsMap.entries())
            .map(([date, amount]) => ({ date, amount: amount / 100 }))
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(-30); // Last 30 days

        // ============= SESSION STATS (From TimeSlots + populated data) =============
        // Since Session model has minimal data, we'll use TimeSlots with populated mentor/session data
        const allTimeSlots = await TimeSlot.find({})
            .populate({
                path: 'mentor',
                select: 'sessionOfferings'
            })
            .populate('session');

        // Count by status
        const totalSlots = allTimeSlots.length;
        const bookedSlotsCount = allTimeSlots.filter(s => s.status === 'booked').length;
        const availableSlots = allTimeSlots.filter(s => s.status === 'available').length;
        const blockedSlots = allTimeSlots.filter(s => s.status === 'blocked').length;

        // Analyze booked slots for session details
        const bookedSlotsWithData = allTimeSlots.filter(s => s.status === 'booked');

        // Session types and topics from sessionOfferings
        const typeMap = new Map<string, number>();
        const topicMap = new Map<string, number>();

        bookedSlotsWithData.forEach((slot: any) => {
            if (slot.mentor && slot.mentor.sessionOfferings) {
                const offering = slot.mentor.sessionOfferings.find(
                    (off: any) => off._id.toString() === slot.sessionOffering.toString()
                );
                if (offering) {
                    // Count session types
                    const type = offering.sessionType || 'Unknown';
                    typeMap.set(type, (typeMap.get(type) || 0) + 1);

                    // Count topics
                    const topic = offering.topic || 'Other';
                    topicMap.set(topic, (topicMap.get(topic) || 0) + 1);
                }
            }
        });

        const sessionTypeData = Array.from(typeMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        const topicData = Array.from(topicMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10); // Top 10 topics

        // For Session status, we'll use the actual Session model (if it has data)
        const totalSessions = await Session.countDocuments({});
        const completedSessions = await Session.countDocuments({ status: 'completed' });
        const confirmedSessions = await Session.countDocuments({ status: 'confirmed' });
        const pendingSessions = await Session.countDocuments({
            status: { $in: ['pending_payment', 'pending_acceptance'] }
        });
        const cancelledSessions = await Session.countDocuments({
            status: { $in: ['cancelled_by_mentee', 'cancelled_by_mentor', 'rejected'] }
        });

        const sessionStatusData = [
            { name: 'Completed', value: completedSessions },
            { name: 'Confirmed', value: confirmedSessions },
            { name: 'Pending', value: pendingSessions },
            { name: 'Cancelled', value: cancelledSessions }
        ].filter(item => item.value > 0); // Only show non-zero statuses

        // ============= MENTORS & MENTEES =============
        const totalMentors = await Mentor.countDocuments({});
        const totalMentees = await Mentee.countDocuments({});
        const totalUsers = await User.countDocuments({});

        // User roles distribution
        const userRoles = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]).then(res => res.map(item => ({ name: item._id, value: item.count })));

        // User countries distribution (Top 10)
        const userCountries = await User.aggregate([
            { $match: { Country: { $exists: true, $ne: null, $ne: "" } } },
            { $group: { _id: "$Country", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]).then(res => res.map(item => ({ name: item._id, value: item.count })));

        // Mentor experience levels distribution
        const mentorExperience = await Mentor.aggregate([
            {
                $bucket: {
                    groupBy: "$yearsOfExperience",
                    boundaries: [0, 2, 5, 10, 15, 100],
                    default: "Unknown",
                    output: { count: { $sum: 1 } }
                }
            }
        ]).then(res => res.map(item => {
            let label = "Unknown";
            if (item._id === 0) label = "0-2 years";
            else if (item._id === 2) label = "2-5 years";
            else if (item._id === 5) label = "5-10 years";
            else if (item._id === 10) label = "10-15 years";
            else if (item._id === 15) label = "15+ years";
            return { name: label, value: item.count };
        }));

        // Mentor focus areas (Top 10)
        const mentorFocusAreas = await Mentor.aggregate([
            { $unwind: "$focusAreas" },
            { $group: { _id: "$focusAreas", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]).then(res => res.map(item => ({ name: item._id, value: item.count })));

        // Company industries distribution
        const companyIndustries = await Company.aggregate([
            { $match: { industry: { $exists: true, $ne: null, $ne: "" } } },
            { $group: { _id: "$industry", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]).then(res => res.map(item => ({ name: item._id, value: item.count })));

        // ============= FEEDBACK STATS =============
        const feedbackStats = await Feedback.aggregate([
            { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } }
        ]);
        const mentorFeedbackStats = await MentorFeedback.aggregate([
            { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } }
        ]);

        // Rating distribution
        const ratingDistribution = await Feedback.aggregate([
            { $group: { _id: "$rating", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]).then(res => res.map(item => ({ rating: item._id, count: item.count })));

        // ============= AI INTERVIEWS =============
        const totalInterviews = await AiInterview.countDocuments({});
        const finalizedInterviews = await AiInterview.countDocuments({ finalized: true });

        // Interview score distribution
        const scoreRanges = [
            { name: '0-20', min: 0, max: 20 },
            { name: '21-40', min: 21, max: 40 },
            { name: '41-60', min: 41, max: 60 },
            { name: '61-80', min: 61, max: 80 },
            { name: '81-100', min: 81, max: 100 }
        ];

        const scoreDistribution = await Promise.all(
            scoreRanges.map(async (range) => ({
                name: range.name,
                value: await AiInterview.countDocuments({
                    overallScore: { $gte: range.min, $lte: range.max }
                })
            }))
        );

        // Interview types (job application vs practice)
        const jobInterviews = await AiInterview.countDocuments({ isJobApplication: true });
        const practiceInterviews = totalInterviews - jobInterviews;

        // ============= CV ANALYSIS =============
        const totalCvAnalyses = await CvAnalysis.countDocuments({});

        // CV Score distribution
        const cvScoreDistribution = await Promise.all(
            scoreRanges.map(async (range) => ({
                name: range.name,
                value: await CvAnalysis.countDocuments({
                    score: { $gte: range.min, $lte: range.max }
                })
            }))
        );

        // ============= COMPANIES & JOBS =============
        const totalCompanies = await Company.countDocuments({});
        const verifiedCompanies = await Company.countDocuments({ isVerified: true });

        const jobs = await Job.find({});
        const totalJobs = jobs.length;
        const activeJobs = jobs.filter((j: any) => j.status === 'active').length;
        const aiInterviewJobs = jobs.filter((j: any) => j.interviewType === 'ai').length;
        const cvAnalysisJobs = jobs.filter((j: any) => j.enableCVAnalysis).length;

        // ============= CANDIDATES =============
        let totalApplicants = 0;
        let pendingApplicants = 0;
        let interviewPending = 0;
        let interviewCompleted = 0;
        let shortlisted = 0;
        let rejected = 0;

        jobs.forEach((job: any) => {
            if (job.applicants && Array.isArray(job.applicants)) {
                job.applicants.forEach((app: any) => {
                    totalApplicants++;
                    if (app.status === 'pending') pendingApplicants++;
                    if (app.status === 'interview_pending') interviewPending++;
                    if (app.status === 'interview_completed') interviewCompleted++;
                    if (app.status === 'shortlisted') shortlisted++;
                    if (app.status === 'rejected') rejected++;
                });
            }
        });

        const candidateStatusData = [
            { name: 'Pending', value: pendingApplicants },
            { name: 'Interview Pending', value: interviewPending },
            { name: 'Interview Done', value: interviewCompleted },
            { name: 'Shortlisted', value: shortlisted },
            { name: 'Rejected', value: rejected }
        ];

        // ============= ADDITIONAL MODEL STATISTICS =============

        // Resumes
        const totalResumes = await mongoose.models.Resume?.countDocuments({}) || 0;
        const resumesBySource = await mongoose.models.Resume?.aggregate([
            { $group: { _id: "$source", count: { $sum: 1 } } }
        ]).then((res: any) => res?.map((item: any) => ({ name: item._id, value: item.count }))) || [];

        // Job Interviews (separate from AI Interviews)
        const totalJobInterviews = await mongoose.models.JobInterview?.countDocuments({}) || 0;
        const completedJobInterviews = await mongoose.models.JobInterview?.countDocuments({ status: 'completed' }) || 0;
        const terminatedJobInterviews = await mongoose.models.JobInterview?.countDocuments({ status: 'terminated' }) || 0;

        const jobInterviewScores = await mongoose.models.JobInterview?.aggregate([
            { $match: { overallScore: { $exists: true, $ne: null } } },
            {
                $bucket: {
                    groupBy: "$overallScore",
                    boundaries: [0, 20, 40, 60, 80, 100],
                    default: "Other",
                    output: { count: { $sum: 1 } }
                }
            }
        ]).then((res: any) => res?.map((item: any) => {
            let label = "Other";
            if (item._id === 0) label = "0-20";
            else if (item._id === 20) label = "20-40";
            else if (item._id === 40) label = "40-60";
            else if (item._id === 60) label = "60-80";
            else if (item._id === 80) label = "80-100";
            return { name: label, value: item.count };
        })) || [];

        // Notifications
        const totalNotifications = await mongoose.models.Notification?.countDocuments({}) || 0;
        const unreadNotifications = await mongoose.models.Notification?.countDocuments({ read: false }) || 0;
        const notificationsByType = await mongoose.models.Notification?.aggregate([
            { $group: { _id: "$type", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]).then((res: any) => res?.map((item: any) => ({ name: item._id, value: item.count }))) || [];

        // Goals
        const totalGoals = await mongoose.models.Goal?.countDocuments({}) || 0;
        const achievedGoals = await mongoose.models.Goal?.countDocuments({ achived: true }) || 0;
        const activeGoals = totalGoals - achievedGoals;

        // Model Usage Report (for identifying empty/unused models)
        const modelUsageReport = {
            Payment: await mongoose.models.Payment?.countDocuments({}) || 0,
            MentorEarning: await mongoose.models.MentorEarning?.countDocuments({}) || 0,
            Activity: await mongoose.models.Activity?.countDocuments({}) || 0,
            Background: await mongoose.models.Background?.countDocuments({}) || 0,
            Conversation: await mongoose.models.Conversation?.countDocuments({}) || 0,
            Message: await mongoose.models.Message?.countDocuments({}) || 0,
            PerformancePeriod: await mongoose.models.PerformancePeriod?.countDocuments({}) || 0,
            AiReport: await mongoose.models.AiReport?.countDocuments({}) || 0,
        };

        // ============= RETURN COMPREHENSIVE STATS =============
        return NextResponse.json({
            earnings: {
                total: totalEarnings / 100, // Convert cents to dollars
                chart: earningsChart
            },
            timeslots: {
                total: totalSlots,
                booked: bookedSlotsCount,
                available: availableSlots,
                blocked: blockedSlots,
                utilizationRate: totalSlots > 0 ? ((bookedSlotsCount / totalSlots) * 100).toFixed(1) : 0
            },
            sessions: {
                total: totalSessions || bookedSlotsCount, // Use booked slots if no sessions
                completed: completedSessions,
                confirmed: confirmedSessions,
                pending: pendingSessions,
                cancelled: cancelledSessions,
                statusChart: sessionStatusData,
                typeChart: sessionTypeData,
                topicChart: topicData
            },
            users: {
                total: totalUsers,
                mentors: totalMentors,
                mentees: totalMentees,
                roleChart: userRoles,
                countryChart: userCountries
            },
            mentorAnalytics: {
                experienceDistribution: mentorExperience,
                focusAreas: mentorFocusAreas
            },
            companies: {
                total: totalCompanies,
                verified: verifiedCompanies,
                industryChart: companyIndustries
            },
            feedback: {
                menteeToMentor: {
                    avg: feedbackStats[0]?.avg || 0,
                    count: feedbackStats[0]?.count || 0
                },
                mentorToMentee: {
                    avg: mentorFeedbackStats[0]?.avg || 0,
                    count: mentorFeedbackStats[0]?.count || 0
                },
                ratingDistribution
            },
            interviews: {
                total: totalInterviews,
                finalized: finalizedInterviews,
                jobInterviews,
                practiceInterviews,
                scoreDistribution,
                typeChart: [
                    { name: 'Job Application', value: jobInterviews },
                    { name: 'Practice', value: practiceInterviews }
                ]
            },
            cvAnalysis: {
                total: totalCvAnalyses,
                scoreDistribution: cvScoreDistribution
            },
            jobs: {
                total: totalJobs,
                active: activeJobs,
                aiInterviews: aiInterviewJobs,
                cvAnalysisEnabled: cvAnalysisJobs
            },
            candidates: {
                total: totalApplicants,
                statusChart: candidateStatusData,
                pending: pendingApplicants,
                interviewPending,
                interviewCompleted,
                shortlisted,
                rejected
            },
            resumes: {
                total: totalResumes,
                bySource: resumesBySource
            },
            jobInterviews: {
                total: totalJobInterviews,
                completed: completedJobInterviews,
                terminated: terminatedJobInterviews,
                scoreDistribution: jobInterviewScores
            },
            notifications: {
                total: totalNotifications,
                unread: unreadNotifications,
                byType: notificationsByType
            },
            goals: {
                total: totalGoals,
                achieved: achievedGoals,
                active: activeGoals,
                completionRate: totalGoals > 0 ? ((achievedGoals / totalGoals) * 100).toFixed(1) : 0
            },
            modelUsage: modelUsageReport
        });

    } catch (error: any) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json({
            message: "Server error",
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
