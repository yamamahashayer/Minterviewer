import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import JobInterview from "@/models/JobInterview";
import Job from "@/models/Job";
import Mentee from "@/models/Mentee";
import mongoose from "mongoose";

export async function POST(req: Request) {
    try {
        const { interviewId, scores, strengths, improvements, duration, questions, feedback } = await req.json();

        if (!interviewId) {
            return NextResponse.json(
                { ok: false, message: "Interview ID is required" },
                { status: 400 }
            );
        }

        await connectDB();

        // 1. Find the JobInterview record
        const interview = await JobInterview.findById(interviewId);
        if (!interview) {
            return NextResponse.json(
                { ok: false, message: "Interview not found" },
                { status: 404 }
            );
        }

        // 2. Update Interview Data
        interview.overallScore = scores.overallScore;
        interview.technicalScore = scores.technicalScore;
        interview.communicationScore = scores.communicationScore;
        interview.confidenceScore = scores.confidenceScore;
        interview.strengths = strengths;
        interview.improvements = improvements;
        interview.feedback = feedback; // Save the overall feedback summary
        interview.duration = duration;
        interview.completedAt = new Date();
        interview.status = "completed";

        // Save detailed questions data if provided
        if (questions && Array.isArray(questions)) {
            interview.questions = questions.map((q: any) => ({
                question: q.question,
                candidateAnswer: q.candidateAnswer || q.answer || "", // Capture answer
                transcript: q.transcript || q.candidateAnswer || "",
                feedback: q.feedback,
                score: q.score,
                duration: q.duration,
            }));
        }

        await interview.save();

        // 3. Update Job Application Status
        const job = await Job.findById(interview.jobId);
        if (job) {
            const applicantIndex = job.applicants.findIndex(
                (app: any) => app.menteeId.toString() === interview.menteeId.toString()
            );

            if (applicantIndex !== -1) {
                // Update existing applicant
                job.applicants[applicantIndex].status = "interview_completed";
                job.applicants[applicantIndex].interviewId = interview._id;
                job.applicants[applicantIndex].interviewCompletedAt = new Date();
                job.applicants[applicantIndex].evaluation = {
                    ...job.applicants[applicantIndex].evaluation,
                    interviewScore: scores.overallScore,
                };
            } else {
                // Create new applicant entry (fallback)
                job.applicants.push({
                    menteeId: interview.menteeId,
                    interviewId: interview._id,
                    status: "interview_completed",
                    interviewCompletedAt: new Date(),
                    evaluation: {
                        interviewScore: scores.overallScore,
                    },
                });
            }
            await job.save();
        }

        return NextResponse.json({
            ok: true,
            message: "Job interview saved successfully",
            applicationSubmitted: true,
        });
    } catch (error) {
        console.error("Error saving job interview:", error);
        return NextResponse.json(
            { ok: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
