import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose, { isValidObjectId } from "mongoose";
import dbConnect from "@/lib/mongodb";
import AiInterview from "@/models/AiInterview";

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
                mentee: userObjId
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

        return NextResponse.json({
            success: true,
            interview
        });
    } catch (error) {
        console.error("Error saving interview result:", error);
        return NextResponse.json(
            { error: "Failed to save interview result", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}