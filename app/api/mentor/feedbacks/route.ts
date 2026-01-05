import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";
import Feedback from "@/models/Feedback"; // Generic Feedback model for Mentee <-> Mentor
import Mentor from "@/models/Mentor";
import { getUserFromToken } from "@/lib/auth-helper";

import fs from 'fs';
import path from 'path';

export const runtime = "nodejs";

function log(msg: string) {
    try {
        fs.appendFileSync('api_debug.log', `[${new Date().toISOString()}] ${msg}\n`);
    } catch (e) {
        console.error("Log error:", e);
    }
}

export async function GET(request: NextRequest) {
    try {
        log("GET /api/mentor/feedbacks called");
        const authData = await getUserFromToken(request);
        if (!authData || authData.role !== 'mentor') {
            log("Unauthorized access attempt");
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        log(`User authorized: ${authData.id}`);

        await dbConnect();

        // 1. Get Mentor Profile
        const mentor = await Mentor.findOne({ user: authData.id });
        if (!mentor) {
            log("Mentor profile not found");
            return NextResponse.json({ error: 'Mentor profile not found' }, { status: 404 });
        }
        log(`Mentor profile found: ${mentor._id}`);


        // 2. Fetch Submitted Feedbacks (History: Given by Mentor)
        const submittedFeedbacks = await Feedback.find({ fromUser: authData.id })
            .populate('toUser', 'full_name profile_photo')
            .populate({
                path: 'session',
                populate: { path: 'sessionOffering', select: 'title' }
            })
            .sort({ createdAt: -1 })
            .lean();

        // 3. Fetch Received Feedbacks (Reviews from Mentees)
        const receivedFeedbacks = await Feedback.find({ toUser: authData.id })
            .populate('fromUser', 'full_name profile_photo')
            .populate({
                path: 'session',
                populate: { path: 'sessionOffering', select: 'title' }
            })
            .sort({ createdAt: -1 })
            .lean();

        log(`Submitted (Given) count: ${submittedFeedbacks.length}`);
        log(`Received count: ${receivedFeedbacks.length}`);

        // 4. Fetch Pending Feedbacks
        // Find ALL completed booked sessions for this mentor
        const now = new Date();
        const completedSessions = await TimeSlot.find({
            mentor: mentor._id,
            status: 'booked',
            endTime: { $lt: now }
        })
            .populate('mentee', 'full_name profile_photo')
            .populate('sessionOffering', 'title')
            .lean();

        // Filter out sessions that already have feedback (Given by Mentor)
        const submittedSessionIds = new Set(submittedFeedbacks.map((f: any) => f.session?._id?.toString()));

        const pendingSessions = completedSessions.filter((slot: any) => {
            return !submittedSessionIds.has(slot._id.toString());
        });

        // Format Pending Data
        const formattedPending = pendingSessions.map((slot: any) => ({
            id: slot._id,
            menteeId: slot.mentee?._id,
            menteeName: slot.mentee?.full_name || 'Unknown Mentee',
            sessionTitle: slot.sessionOffering?.title || 'Session',
            date: new Date(slot.startTime).toLocaleDateString(),
            rawDate: slot.startTime
        }));

        // Format Submitted Data (Given)
        const formattedSubmitted = submittedFeedbacks.map((f: any) => ({
            id: f._id,
            menteeName: f.toUser?.full_name || 'Unknown',
            sessionTitle: f.session?.sessionOffering?.title || 'Session',
            date: new Date(f.createdAt).toLocaleDateString(),
            rating: f.rating,
            feedback: f.feedback,
            strengths: f.tags || [],
            improvements: []
        }));

        // Format Received Data
        const formattedReceived = receivedFeedbacks.map((f: any) => ({
            id: f._id,
            studentName: f.fromUser?.full_name || 'Unknown Student',
            sessionTitle: f.session?.sessionOffering?.title || 'Session',
            date: new Date(f.createdAt).toLocaleDateString(),
            rating: f.rating,
            feedback: f.feedback,
            tags: f.tags || []
        }));

        return NextResponse.json({
            success: true,
            data: {
                pending: formattedPending,
                submitted: formattedSubmitted,
                received: formattedReceived
            }
        });

    } catch (error) {
        console.error('Feedback API Error:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const authData = await getUserFromToken(request);
        if (!authData || authData.role !== 'mentor') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { sessionId, menteeId, rating, feedback, strengths, improvements } = body;

        await dbConnect();

        // Validate Session
        const mentor = await Mentor.findOne({ user: authData.id });
        const slot = await TimeSlot.findOne({
            _id: sessionId,
            mentor: mentor._id,
            mentee: menteeId
        });

        if (!slot) {
            return NextResponse.json({ error: 'Invalid Session' }, { status: 400 });
        }

        const tags = [...(strengths || []), ...(improvements || [])];

        const newFeedback = await Feedback.create({
            session: sessionId,
            fromUser: authData.id,
            toUser: menteeId,
            rating,
            feedback,
            tags: tags
        });

        return NextResponse.json({ success: true, data: newFeedback });

    } catch (error) {
        console.error('Submit Feedback Error:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
