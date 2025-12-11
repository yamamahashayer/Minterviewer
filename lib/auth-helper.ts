// lib/auth-helper.ts
import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Mentor from "@/models/Mentor";

type TokenPayload = JwtPayload & {
    id?: string;
    _id?: string;
    email?: string;
    role?: string;
};

export async function getUserFromToken(req: NextRequest) {
    try {
        // Get token from authorization header
        const auth = req.headers.get("authorization") || "";
        console.log("[AUTH] Authorization header:", auth ? "Present" : "Missing");
        let token: string | null = null;

        if (auth.startsWith("Bearer ")) {
            token = auth.slice(7);
            console.log("[AUTH] Token extracted, length:", token.length);
        }

        if (!token) {
            console.log("[AUTH] No token found");
            return null;
        }

        // Verify JWT
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("[AUTH] JWT_SECRET not configured!");
            return null;
        }

        let payload: TokenPayload;

        try {
            payload = jwt.verify(token, secret) as TokenPayload;
            console.log("[AUTH] Token verified, user ID:", payload.id || payload._id);
        } catch (e) {
            console.error("[AUTH] Token verification failed:", e);
            return null;
        }

        // Get user ID
        const userId = String(payload.id || payload._id || "");
        if (!mongoose.isValidObjectId(userId)) {
            console.error("[AUTH] Invalid user ID:", userId);
            return null;
        }

        // Connect to DB
        await dbConnect();

        // Find user
        const user = await User.findById(userId).lean();
        if (!user) {
            console.error("[AUTH] User not found:", userId);
            return null;
        }

        console.log("[AUTH] User authenticated:", user.email, "Role:", user.role);
        return {
            id: userId,
            email: user.email,
            role: user.role,
            user
        };
    } catch (error) {
        console.error("[AUTH] Unexpected error:", error);
        return null;
    }
}

export async function getMentorFromUser(userId: string) {
    return await Mentor.findOne({ user: new mongoose.Types.ObjectId(userId) });
}
