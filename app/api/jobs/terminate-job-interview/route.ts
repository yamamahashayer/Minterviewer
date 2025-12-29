import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import JobInterview from "@/models/JobInterview";

export async function POST(req: Request) {
    try {
        const { interviewId, reason } = await req.json();

        if (!interviewId || !reason) {
            return NextResponse.json(
                { ok: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        await connectDB();

        // Find the interview
        const interview = await JobInterview.findById(interviewId);

        if (!interview) {
            return NextResponse.json(
                { ok: false, message: "Interview not found" },
                { status: 404 }
            );
        }

        // Update interview status
        interview.status = "terminated";
        interview.terminatedReason = reason;
        interview.completedAt = new Date();

        // If terminated due to fullscreen violation, increment violation count
        if (reason === 'fullscreen_violation') {
            interview.fullScreenViolations = (interview.fullScreenViolations || 0) + 1;
            interview.violationTimestamps.push(new Date());
        }

        await interview.save();

        return NextResponse.json({
            ok: true,
            message: "Interview terminated successfully"
        });
    } catch (error) {
        console.error("Error terminating interview:", error);
        return NextResponse.json(
            { ok: false, message: "Server error" },
            { status: 500 }
        );
    }
}
