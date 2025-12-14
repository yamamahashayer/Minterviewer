import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose, { isValidObjectId } from "mongoose";
import dbConnect from "@/lib/mongodb.js";
import AiInterview from "@/models/AiInterview";
import User from "@/models/User";

type TokenPayload = JwtPayload & {
    id?: string;
    _id?: string;
};

export async function POST(req: NextRequest) {
    try {
        // Get token from Authorization header
        const auth = req.headers.get("authorization") || "";
        if (!auth.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Unauthorized - No token provided" },
                { status: 401 }
            );
        }

        const token = auth.slice(7);

        // Verify JWT token
        const secret = process.env.JWT_SECRET!;
        let payload: TokenPayload;

        try {
            payload = jwt.verify(token, secret) as TokenPayload;
        } catch {
            return NextResponse.json(
                { error: "Unauthorized - Invalid token" },
                { status: 401 }
            );
        }

        const userId = String(payload.id || payload._id || "");
        if (!userId || !isValidObjectId(userId)) {
            return NextResponse.json(
                { error: "Unauthorized - Invalid token payload" },
                { status: 401 }
            );
        }

        const userObjId = new mongoose.Types.ObjectId(userId);

        // Verify user exists
        await dbConnect();
        const user = await User.findById(userObjId);
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized - User not found" },
                { status: 401 }
            );
        }

        const { role, techstack, type } = await req.json();

        // Validate required fields
        if (!role || !techstack || !type) {
            return NextResponse.json(
                { error: "Missing required fields: role, techstack, type" },
                { status: 400 }
            );
        }

        // Create a new interview document
        const interview = await AiInterview.create({
            mentee: userObjId,
            role,
            techstack,
            type,
            finalized: false
        });

        return NextResponse.json({
            success: true,
            interviewId: interview._id.toString()
        });
    } catch (error) {
        console.error("Error creating interview:", error);
        return NextResponse.json(
            { error: "Failed to create interview", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}