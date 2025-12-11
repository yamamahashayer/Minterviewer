// app/api/mentors/session-offerings/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Mentor from "@/models/Mentor";
import { getUserFromToken, getMentorFromUser } from "@/lib/auth-helper";

// PUT /api/mentors/session-offerings/[id] - Update offering
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const { title, topic, sessionType, duration, price, description, active } = await req.json();

        // Find and update offering
        const offering = mentor.sessionOfferings.id(params.id);
        if (!offering) {
            return NextResponse.json({ error: "Session offering not found" }, { status: 404 });
        }

        if (title) offering.title = title;
        if (topic) offering.topic = topic;
        if (sessionType) offering.sessionType = sessionType;
        if (duration !== undefined) offering.duration = duration;
        if (price !== undefined) offering.price = price;
        if (description !== undefined) offering.description = description;
        if (active !== undefined) offering.active = active;

        await mentor.save();

        return NextResponse.json({ sessionOffering: offering });
    } catch (error) {
        console.error("Error updating session offering:", error);
        return NextResponse.json({ error: "Failed to update session offering" }, { status: 500 });
    }
}

// DELETE /api/mentors/session-offerings/[id] - Deactivate offering
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const offering = mentor.sessionOfferings.id(params.id);
        if (!offering) {
            return NextResponse.json({ error: "Session offering not found" }, { status: 404 });
        }

        // Soft delete by setting active to false
        offering.active = false;
        await mentor.save();

        return NextResponse.json({ message: "Session offering deactivated successfully" });
    } catch (error) {
        console.error("Error deleting session offering:", error);
        return NextResponse.json({ error: "Failed to delete session offering" }, { status: 500 });
    }
}
