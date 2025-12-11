// app/api/mentors/time-slots/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";
import { getUserFromToken, getMentorFromUser } from "@/lib/auth-helper";

// GET /api/mentors/time-slots - List mentor's time slots
export async function GET(req: NextRequest) {
    try {
        const authUser = await getUserFromToken(req);
        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Find mentor profile
        const mentor = await getMentorFromUser(authUser.id);
        if (!mentor) {
            return NextResponse.json({ error: "Mentor profile not found" }, { status: 404 });
        }

        // Get query params
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status"); // available, booked, blocked
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const query: any = { mentor: mentor._id };

        if (status) {
            query.status = status;
        }

        if (startDate || endDate) {
            query.startTime = {};
            if (startDate) query.startTime.$gte = new Date(startDate);
            if (endDate) query.startTime.$lte = new Date(endDate);
        }

        const timeSlots = await TimeSlot.find(query)
            .populate("session", "status topic sessionType")
            .sort({ startTime: 1 });

        return NextResponse.json({ timeSlots });
    } catch (error) {
        console.error("Error fetching time slots:", error);
        return NextResponse.json({ error: "Failed to fetch time slots" }, { status: 500 });
    }
}

// POST /api/mentors/time-slots - Create new time slot
export async function POST(req: NextRequest) {
    try {
        const authUser = await getUserFromToken(req);
        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        console.log("[TimeSlot] Looking for mentor profile for user:", authUser.id);
        // Find mentor profile
        const mentor = await getMentorFromUser(authUser.id);
        if (!mentor) {
            console.error("[TimeSlot] No mentor profile found for user:", authUser.id);
            return NextResponse.json({ error: "Mentor profile not found. Please complete your mentor profile setup." }, { status: 404 });
        }

        console.log("[TimeSlot] Found mentor:", mentor._id);

        const { startTime, endTime, duration, sessionOffering, notes } = await req.json();
        console.log("[TimeSlot] Request data:", { startTime, endTime, duration, sessionOffering, notes });

        // Validation
        if (!startTime || !endTime || !duration || !sessionOffering) {
            console.error("[TimeSlot] Missing required fields");
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Verify sessionOffering exists in mentor's offerings
        const offering = mentor.sessionOfferings.id(sessionOffering);
        if (!offering || !offering.active) {
            console.error("[TimeSlot] Invalid or inactive session offering");
            return NextResponse.json({ error: "Invalid or inactive session offering" }, { status: 400 });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (start >= end) {
            return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
        }

        if (start < new Date()) {
            return NextResponse.json({ error: "Cannot create slots in the past" }, { status: 400 });
        }

        // Check for overlapping slots
        const overlapping = await TimeSlot.findOne({
            mentor: mentor._id,
            status: { $in: ["available", "booked"] },
            $or: [
                { startTime: { $lt: end }, endTime: { $gt: start } }
            ]
        });

        if (overlapping) {
            return NextResponse.json({ error: "Time slot overlaps with existing slot" }, { status: 400 });
        }

        // Create time slot
        const timeSlot = await TimeSlot.create({
            mentor: mentor._id,
            startTime: start,
            endTime: end,
            duration,
            sessionOffering,
            notes: notes || "",
            status: "available"
        });

        console.log("[TimeSlot] Created successfully:", timeSlot._id);
        return NextResponse.json({ timeSlot }, { status: 201 });
    } catch (error) {
        console.error("Error creating time slot:", error);
        return NextResponse.json({ error: "Failed to create time slot" }, { status: 500 });
    }
}
