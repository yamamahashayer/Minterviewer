import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";
import User from "@/models/User";
import Mentor from "@/models/Mentor";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Ensure this path is correct for your project
import Feedback from "@/models/Feedback";

export async function GET(req: Request) {
    try {
        await dbConnect();

        // 1. Authenticate
        // NOTE: In a real app, use getServerSession(authOptions).
        // For now, getting userId from header or mock session if needed.
        // Assuming for now the request includes 'x-mentor-id' or we derive from session.
        // Let's use searchParams for dev or assume session.
        const url = new URL(req.url);
        const mockUserId = url.searchParams.get("userId"); // For testing

        // TODO: Replace with real auth
        if (!mockUserId) {
            // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Find Mentor Profile ID for this User
        // We need to look up the Mentor document associated with this userId
        // If we passed the Mentor User Table ID, we find the Mentor Doc.
        const user = await User.findById(mockUserId);
        if (!user || user.role !== 'mentor') {
            // If testing/dev, maybe look up Mentor directly if mockUserId is mentorId?
            // Let's assume passed ID is the User ID.
        }

        console.log(`[API] Fetching mentees for userId: ${mockUserId}`);
        const mentorDoc = await Mentor.findOne({ user: mockUserId });
        console.log(`[API] Found mentorDoc:`, mentorDoc ? mentorDoc._id : 'null');
        if (!mentorDoc) {
            return NextResponse.json({ error: "Mentor profile not found" }, { status: 404 });
        }

        // 3. Find all TimeSlots for this mentor that are 'booked' or 'completed'
        // We want unique mentees.
        const slots = await TimeSlot.find({
            mentor: mentorDoc._id,
            mentee: { $exists: true, $ne: null }
        }).populate('mentee', 'full_name profile_photo job_title email');

        // 4. Aggregate unique mentees and calc stats
        const menteeMap = new Map();

        for (const slot of slots) {
            if (!slot.mentee) continue;
            const menteeId = slot.mentee._id.toString();

            if (!menteeMap.has(menteeId)) {
                menteeMap.set(menteeId, {
                    id: menteeId,
                    name: slot.mentee.full_name,
                    role: slot.mentee.job_title || 'Mentee',
                    image: slot.mentee.profile_photo || '',
                    email: slot.mentee.email,
                    sessionsCount: 0,
                    lastSessionDate: null,
                    status: 'active', // Default
                    progress: 0, // Placeholder
                    aiConfidence: 0, // Placeholder
                    recentFeedback: []
                });
            }

            const menteeStats = menteeMap.get(menteeId);
            menteeStats.sessionsCount += 1;

            const slotDate = new Date(slot.startTime);
            if (!menteeStats.lastSessionDate || slotDate > menteeStats.lastSessionDate) {
                menteeStats.lastSessionDate = slotDate;
            }
        }

        // Fetch stats/feedback if needed (Optional Enhancement)

        const mentees = Array.from(menteeMap.values()).map(m => ({
            ...m,
            lastSession: m.lastSessionDate ? m.lastSessionDate.toLocaleDateString() : 'N/A'
        }));

        return NextResponse.json({ ok: true, mentees });

    } catch (err: any) {
        console.error("Error fetching mentees:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
