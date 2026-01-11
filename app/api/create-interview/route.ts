import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose, { isValidObjectId } from "mongoose";
import dbConnect from "@/lib/mongodb.js";

import AiInterview from "@/models/AiInterview";
import User from "@/models/User";
import Mentee from "@/models/Mentee"; // ✅ الإضافة الوحيدة

type TokenPayload = JwtPayload & {
  id?: string;
  _id?: string;
};

export async function POST(req: NextRequest) {
  try {
    // ================= AUTH =================

    const auth = req.headers.get("authorization") || "";
    if (!auth.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const token = auth.slice(7);

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

    // ================= DB =================

    await dbConnect();

    // Verify user exists
    const user = await User.findById(userObjId);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - User not found" },
        { status: 401 }
      );
    }

    // ================= GET MENTEE =================

    const mentee = await Mentee.findOne({ user: userObjId });
    if (!mentee) {
      return NextResponse.json(
        { error: "Mentee profile not found" },
        { status: 404 }
      );
    }

    // ================= BODY =================

    const { role, techstack, type } = await req.json();

    if (!role || !techstack || !type) {
      return NextResponse.json(
        { error: "Missing required fields: role, techstack, type" },
        { status: 400 }
      );
    }

    // ================= CREATE INTERVIEW =================

    const interview = await AiInterview.create({
      mentee: mentee._id, 
      role,
      techstack,
      type,
      finalized: false,
    });

    // ================= RESPONSE =================

    return NextResponse.json({
      success: true,
      interviewId: interview._id.toString(),
    });

  } catch (error) {
    console.error("Error creating interview:", error);
    return NextResponse.json(
      {
        error: "Failed to create interview",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
