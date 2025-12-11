// app/api/mentors/time-slots/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";
import { getUserFromToken, getMentorFromUser } from "@/lib/auth-helper";

// DELETE /api/mentors/time-slots/[id] - Delete available time slot
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

        const timeSlot = await TimeSlot.findOne({ _id: params.id, mentor: mentor._id });
        if (!timeSlot) {
            return NextResponse.json({ error: "Time slot not found" }, { status: 404 });
        }

        // Can only delete available slots
        if (timeSlot.status !== "available") {
            return NextResponse.json({ error: "Cannot delete booked or blocked slots" }, { status: 400 });
        }

        await TimeSlot.deleteOne({ _id: params.id });

        return NextResponse.json({ message: "Time slot deleted successfully" });
    } catch (error) {
        console.error("Error deleting time slot:", error);
        return NextResponse.json({ error: "Failed to delete time slot" }, { status: 500 });
    }
}
