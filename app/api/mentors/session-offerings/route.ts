// app/api/mentors/session-offerings/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Mentor from "@/models/Mentor";
import { getUserFromToken, getMentorFromUser } from "@/lib/auth-helper";

// GET /api/mentors/session-offerings - List session offerings
export async function GET(req: NextRequest) {
    try {
        const authUser = await getUserFromToken(req);
        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const mentor = await getMentorFromUser(authUser.id);
        if (!mentor) {
            return NextResponse.json({ error: "Mentor profile not found" }, { status: 404 });
        }

        return NextResponse.json({ sessionOfferings: mentor.sessionOfferings || [] });
    } catch (error) {
        console.error("Error fetching session offerings:", error);
        return NextResponse.json({ error: "Failed to fetch session offerings" }, { status: 500 });
    }
}

// POST /api/mentors/session-offerings - Create new offering
export async function POST(req: NextRequest) {
    try {
        const authUser = await getUserFromToken(req);
        if (!authUser) {
            console.log("[SessionOffering] Unauthorized - no user");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const mentor = await getMentorFromUser(authUser.id);
        if (!mentor) {
            console.log("[SessionOffering] Mentor not found for:", authUser.id);
            return NextResponse.json({ error: "Mentor profile not found" }, { status: 404 });
        }

        const body = await req.json();
        console.log("[SessionOffering] Creating with:", body);
        const { title, topic, sessionType, duration, price, description } = body;

        // Validation
        if (!title || !topic || !sessionType || !duration || price === undefined) {
            console.log("[SessionOffering] Missing fields");
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (duration <= 0 || price < 0) {
            console.log("[SessionOffering] Invalid values:", { duration, price });
            return NextResponse.json({ error: "Invalid duration or price" }, { status: 400 });
        }

        // Add new offering
        mentor.sessionOfferings.push({
            title,
            topic,
            sessionType,
            duration,
            price,
            description: description || "",
            active: true
        });

        await mentor.save();
        console.log("[SessionOffering] Success!");

        return NextResponse.json({
            sessionOffering: mentor.sessionOfferings[mentor.sessionOfferings.length - 1]
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating session offering:", error);
        return NextResponse.json({ error: "Failed to create session offering" }, { status: 500 });
    }
}
