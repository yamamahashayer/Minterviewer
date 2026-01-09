import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose, { isValidObjectId } from "mongoose";
import dbConnect from "@/lib/mongodb";
import AiInterview from "@/models/AiInterview";
import Mentee from "@/models/Mentee";

function extractInterviewSkills(interview: any): string[] {
    const raw: string[] = [];

    if (interview?.techstack && typeof interview.techstack === "string") {
        raw.push(
            ...interview.techstack
                .split(",")
                .map((s: string) => s.trim())
        );
    }

    if (interview?.type) raw.push(String(interview.type).trim());
    if (interview?.role) raw.push(String(interview.role).trim());

    const seen = new Set<string>();
    const out: string[] = [];
    for (const s of raw) {
        const cleaned = String(s || "").trim();
        if (!cleaned) continue;
        const key = cleaned.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(cleaned);
    }
    return out;
}

function mergeSkills(
    existingSkills: Array<{ name?: string; level?: number; samples?: number; updated_at?: Date }> | undefined,
    newSkillNames: string[],
    score: number | null
) {
    const now = new Date();
    const existing = Array.isArray(existingSkills) ? existingSkills : [];

    const byKey = new Map<string, { name: string; level: number; samples: number; updated_at: Date }>();
    for (const s of existing) {
        const name = String(s?.name || "").trim();
        if (!name) continue;
        const key = name.toLowerCase();
        byKey.set(key, {
            name,
            level: Number.isFinite(s?.level as number) ? Number(s!.level) : 0,
            samples: Number.isFinite(s?.samples as number) ? Number(s!.samples) : 0,
            updated_at: (s?.updated_at ? new Date(s.updated_at) : now)
        });
    }

    for (const name of newSkillNames) {
        const key = name.toLowerCase();
        const prev = byKey.get(key);

        if (!prev) {
            byKey.set(key, {
                name,
                level: Number.isFinite(score as number) ? Math.round(score as number) : 0,
                samples: Number.isFinite(score as number) ? 1 : 0,
                updated_at: now
            });
            continue;
        }

        // Update using a running average based on samples.
        if (Number.isFinite(score as number)) {
            const prevSamples = Number.isFinite(prev.samples) ? prev.samples : 0;
            const prevLevel = Number.isFinite(prev.level) ? prev.level : 0;
            const nextSamples = prevSamples + 1;
            const nextLevel = Math.round(((prevLevel * prevSamples) + (score as number)) / nextSamples);
            prev.samples = nextSamples;
            prev.level = nextLevel;
        }

        prev.updated_at = now;
        byKey.set(key, prev);
    }

    return Array.from(byKey.values());
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        /* ========================= Token ========================= */
        let token: string | null = null;
        const auth = req.headers.get("authorization") || "";
        if (auth.startsWith("Bearer ")) token = auth.slice(7);

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        /* ========================= Verify JWT ========================= */
        const secret = process.env.JWT_SECRET!;
        let payload: JwtPayload & { id?: string; _id?: string };

        try {
            payload = jwt.verify(token, secret) as JwtPayload & { id?: string; _id?: string };
        } catch (e: any) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 401 }
            );
        }

        /* ========================= Get User ID ========================= */
        const userId = String(payload.id || payload._id || "");
        if (!isValidObjectId(userId)) {
            return NextResponse.json(
                { error: "Invalid token payload" },
                { status: 401 }
            );
        }

        const userObjId = new mongoose.Types.ObjectId(userId);

        // Fetch mentee profile (needed to update Mentee.skills and to support both UserID/MenteeID in AiInterview.mentee)
        let menteeProfile: any = await Mentee.findOne({ user: userObjId }).select("skills").lean();
        if (!menteeProfile) {
            const created = await Mentee.create({ user: userObjId });
            menteeProfile = { _id: created._id, skills: [] };
        }
        const allowedMenteeIds = [userObjId];
        if (menteeProfile?._id) {
            allowedMenteeIds.push(new mongoose.Types.ObjectId(String(menteeProfile._id)));
        }

        /* ========================= Parse Request Body ========================= */
        const {
            interviewId,
            overallScore,
            technicalScore,
            communicationScore,
            confidenceScore,
            duration,
            strengths,
            improvements
        } = await req.json();

        /* ========================= Validate Interview ID ========================= */
        if (!isValidObjectId(interviewId)) {
            return NextResponse.json(
                { error: "Invalid interview ID" },
                { status: 400 }
            );
        }

        /* ========================= Update Interview ========================= */
        const interview = await AiInterview.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(interviewId),
                mentee: { $in: allowedMenteeIds }
            },
            {
                $set: {
                    overallScore,
                    technicalScore,
                    communicationScore,
                    confidenceScore,
                    duration,
                    strengths,
                    improvements,
                    finalized: true
                }
            },
            { new: true }
        );

        if (!interview) {
            return NextResponse.json(
                { error: "Interview not found or unauthorized" },
                { status: 404 }
            );
        }

        // Persist skills into the Mentee collection based on ALL previous AI interviews
        // (so older interviews are backfilled automatically).
        if (menteeProfile?._id) {
            const allFinalized = await AiInterview.find({
                mentee: { $in: allowedMenteeIds }
            }).lean();

            let aggregatedSkills: Array<{ name: string; level: number; samples: number; updated_at: Date }> = [];
            for (const inv of allFinalized) {
                const score = typeof (inv as any).overallScore === "number" ? (inv as any).overallScore : null;
                const extracted = extractInterviewSkills(inv);
                if (extracted.length === 0) continue;
                aggregatedSkills = mergeSkills(aggregatedSkills, extracted, score);
            }

            await Mentee.updateOne(
                { _id: new mongoose.Types.ObjectId(String(menteeProfile._id)) },
                { $set: { skills: aggregatedSkills } }
            );
        }

        /* ========================= Handle Job Application ========================= */
        if (interview.isJobApplication && interview.jobId) {
            // Import Job model
            const Job = (await import("@/models/Job")).default;

            // Find the job
            const job = await Job.findById(interview.jobId);

            if (job) {
                // Check if applicant already exists
                const existingApplicantIndex = job.applicants.findIndex(
                    (app: any) => app.menteeId.toString() === userObjId.toString()
                );

                if (existingApplicantIndex >= 0) {
                    // Update existing applicant with interview results
                    job.applicants[existingApplicantIndex].interviewId = interview._id;
                    job.applicants[existingApplicantIndex].status = "interview_completed";
                    job.applicants[existingApplicantIndex].interviewCompletedAt = new Date();
                    job.applicants[existingApplicantIndex].evaluation = {
                        ...job.applicants[existingApplicantIndex].evaluation,
                        interviewScore: overallScore,
                    };
                } else {
                    // Create new applicant entry
                    job.applicants.push({
                        menteeId: userObjId,
                        interviewId: interview._id,
                        status: "interview_completed",
                        interviewCompletedAt: new Date(),
                        evaluation: {
                            interviewScore: overallScore,
                        },
                        createdAt: new Date(),
                    });
                }

                await job.save();
            }
        }

        return NextResponse.json({
            success: true,
            interview,
            applicationSubmitted: interview.isJobApplication
        });
    } catch (error) {
        console.error("Error saving interview result:", error);
        return NextResponse.json(
            { error: "Failed to save interview result", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}