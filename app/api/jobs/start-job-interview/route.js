import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import JobInterview from "@/models/JobInterview";
import Mentee from "@/models/Mentee";

export async function POST(req) {
    try {
        const { jobId, menteeId } = await req.json();

        if (!jobId || !menteeId) {
            return NextResponse.json(
                { ok: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        await connectDB();

        // 1. Fetch Job
        const job = await Job.findById(jobId).populate("companyId");
        if (!job) {
            return NextResponse.json(
                { ok: false, message: "Job not found" },
                { status: 404 }
            );
        }

        if (job.interviewType !== "ai") {
            return NextResponse.json(
                { ok: false, message: "This job does not require an AI interview" },
                { status: 400 }
            );
        }

        // Check if mentee has already started/completed an interview for this job
        const existingInterview = await JobInterview.findOne({
            jobId: job._id,
            menteeId: menteeId
        });

        if (existingInterview) {
            // Check the status of existing interview
            if (existingInterview.status === 'completed') {
                return NextResponse.json(
                    { ok: false, message: "You have already completed the interview for this job." },
                    { status: 400 }
                );
            } else if (existingInterview.status === 'started' || existingInterview.status === 'video_processing') {
                // Resume existing interview
                const jobContext = {
                    title: job.title,
                    description: job.description,
                    skills: job.skills,
                    level: job.level,
                    type: job.type,
                    aiFocus: job.aiFocus,
                    aiQuestions: job.aiQuestions,
                    questionCount: job.questionCount || 5,
                    company: {
                        name: job.companyId.name,
                        logo: job.companyId.logo,
                    },
                };

                return NextResponse.json({
                    ok: true,
                    interviewId: existingInterview._id,
                    jobContext,
                });
            }
            // If terminated, allow retake (create new interview below)
        }

        // 2. Create JobInterview Record
        const interview = await JobInterview.create({
            jobId: job._id,
            companyId: job.companyId._id,
            menteeId: menteeId,
            status: "started",
            jobTitle: job.title,
            jobLevel: job.level,
            questions: [], // Will be filled later or via generate endpoint
        });

        // 3. Prepare Context for UI
        const jobContext = {
            title: job.title,
            description: job.description,
            skills: job.skills,
            level: job.level,
            type: job.type,
            aiFocus: job.aiFocus,
            aiQuestions: job.aiQuestions,
            questionCount: job.questionCount || 5,
            company: {
                name: job.companyId.name,
                logo: job.companyId.logo,
            },
        };

        return NextResponse.json({
            ok: true,
            interviewId: interview._id,
            jobContext,
        });
    } catch (error) {
        console.error("Error starting job interview:", error);
        return NextResponse.json(
            { ok: false, message: "Server error" },
            { status: 500 }
        );
    }
}
