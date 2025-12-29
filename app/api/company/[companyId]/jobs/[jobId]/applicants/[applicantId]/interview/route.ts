import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import JobInterview from "@/models/JobInterview";
import AiInterview from "@/models/AiInterview";
import Mentee from "@/models/Mentee";
import User from "@/models/User";

const unwrapParams = async (ctx: any) => {
    const p = ctx?.params;
    return p && typeof p.then === "function" ? await p : p;
};

export async function GET(req: Request, ctx: any) {
    try {
        await connectDB();

        const params = await unwrapParams(ctx);
        const { companyId, jobId, applicantId } = params;

        // Fetch the job
        const job = await Job.findOne({ _id: jobId, companyId });
        if (!job) {
            return NextResponse.json(
                { ok: false, message: "Job not found" },
                { status: 404 }
            );
        }

        // Find the applicant
        const applicant = job.applicants.find(
            (app: any) => app._id.toString() === applicantId
        );

        if (!applicant) {
            return NextResponse.json(
                { ok: false, message: "Applicant not found" },
                { status: 404 }
            );
        }

        // Fetch the AI interview (try JobInterview first, then AiInterview for legacy)
        let interview = null;
        if (applicant.interviewId) {
            interview = await JobInterview.findById(applicant.interviewId).lean();
            if (!interview) {
                // Fallback for older records
                interview = await AiInterview.findById(applicant.interviewId).lean();
            }
        }

        // Fetch mentee details
        const mentee = await Mentee.findById(applicant.menteeId)
            .populate("user", "full_name email phoneNumber")
            .lean();

        return NextResponse.json({
            ok: true,
            applicant: {
                ...applicant.toObject(),
                mentee,
            },
            interview,
        });
    } catch (error) {
        console.error("Error fetching applicant interview:", error);
        return NextResponse.json(
            { ok: false, message: "Server error" },
            { status: 500 }
        );
    }
}
