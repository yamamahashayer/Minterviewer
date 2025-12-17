import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Feedback from "@/models/Feedback";
import TimeSlot from "@/models/TimeSlot"; // Assuming TimeSlot holds booking details

// POST: Submit Feedback
export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { sessionId, fromUserId, toUserId, rating, feedback, tags } = body;

        // Validation
        if (!sessionId || !fromUserId || !toUserId || !rating || !feedback) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if session exists (optional strict check)
        // const session = await TimeSlot.findById(sessionId);
        // if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

        // Check if feedback already exists
        const existing = await Feedback.findOne({
            session: sessionId,
            fromUser: fromUserId,
        });

        if (existing) {
            return NextResponse.json(
                { error: "Feedback already submitted for this session" },
                { status: 409 }
            );
        }

        // Create Feedback
        const newFeedback = await Feedback.create({
            session: sessionId,
            fromUser: fromUserId,
            toUser: toUserId,
            rating,
            feedback,
            tags: tags || [],
        });

        return NextResponse.json({ ok: true, feedback: newFeedback });
    } catch (err: any) {
        console.error("Feedback submit error:", err);
        return NextResponse.json(
            { error: err.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// GET: Fetch Feedback (filtered by user or session)
export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId"); // Who RECEIVED the feedback
        const authorId = searchParams.get("authorId"); // Who WROTE the feedback
        const sessionId = searchParams.get("sessionId");

        let query: any = {};

        if (sessionId) {
            query.session = sessionId;
        }
        if (userId) {
            query.toUser = userId;
        }
        if (authorId) {
            query.fromUser = authorId;
        }

        const feedbacks = await Feedback.find(query)
            .populate("fromUser", "full_name profile_photo job_title")
            .populate("session", "startTime endTime sessionOffering") // Get session details
            .sort({ createdAt: -1 });

        return NextResponse.json({ ok: true, feedbacks });
    } catch (err: any) {
        console.error("Feedback fetch error:", err);
        return NextResponse.json(
            { error: err.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
