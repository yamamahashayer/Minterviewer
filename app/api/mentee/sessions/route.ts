import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TimeSlot from '@/models/TimeSlot';
import Session from '@/models/Session';
import Mentor from '@/models/Mentor';
import Mentee from '@/models/Mentee';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const inputId = searchParams.get('menteeId');

    if (!inputId) {
        return NextResponse.json({ error: 'Mentee ID required' }, { status: 400 });
    }

    try {
        await dbConnect();

        // Robust ID Resolution:
        // The inputId could be a MenteeID OR a UserID. 
        // We find the Mentee Profile to get both IDs.
        let menteeId = inputId;
        let userId = inputId;

        if (mongoose.isValidObjectId(inputId)) {
            const menteeProfile = await Mentee.findOne({
                $or: [
                    { _id: inputId }, // Input is Mentee ID
                    { user: inputId } // Input is User ID
                ]
            }).lean();

            if (menteeProfile) {
                // Cast to any to handle lean document types
                menteeId = (menteeProfile as any)._id.toString();
                if ((menteeProfile as any).user) {
                    userId = (menteeProfile as any).user.toString();
                }
                console.log(`[Sessions Debug] Resolved Profile: MenteeID=${menteeId}, UserID=${userId}`);
            } else {
                console.log(`[Sessions Debug] No Mentee profile found for ID: ${inputId}, searching directly.`);
            }
        }

        // Query TimeSlot (not Session) - TimeSlot has 'mentee' field that refs User
        // TimeSlot schema: { mentee: ref('User'), mentor: ref('Mentor'), startTime, status, ... }
        const query = {
            $or: [
                { mentee: userId }, // TimeSlot.mentee refs User
                { mentee: menteeId }, // In case it somehow refs Mentee
                ...(mongoose.isValidObjectId(userId) ? [{ mentee: new mongoose.Types.ObjectId(userId) }] : []),
                ...(mongoose.isValidObjectId(menteeId) ? [{ mentee: new mongoose.Types.ObjectId(menteeId) }] : [])
            ],
            status: { $in: ['booked', 'available'] } // Only show booked or available slots
        };

        let timeSlots = await TimeSlot.find(query)
            .populate({
                path: 'mentor',
                populate: { path: 'user', select: 'full_name' }
            })
            .sort({ startTime: 1 });

        console.log(`[Sessions Debug] Found ${timeSlots.length} TimeSlots.`);

        // FALLBACK: Name-Based Resolution if 0 found
        if (timeSlots.length === 0 && userId && mongoose.isValidObjectId(userId)) {
            try {
                const currentUser = await User.findById(userId).select('full_name').lean();
                if (currentUser && (currentUser as any).full_name) {
                    const fullName = (currentUser as any).full_name;
                    console.log(`[Sessions Debug] 0 found. Searching for ghost sessions for Name: "${fullName}"...`);

                    const usersWithSameName = await User.find({ full_name: fullName }).select('_id').lean();
                    const allUserIds = usersWithSameName.map(u => (u as any)._id);

                    const linkedMentees = await Mentee.find({ user: { $in: allUserIds } }).select('_id user').lean();
                    const allMenteeIds = linkedMentees.map(m => (m as any)._id);

                    const allPossibleIds = [...allUserIds, ...allMenteeIds];

                    if (allPossibleIds.length > 0) {
                        console.log(`[Sessions Debug] Found ${allPossibleIds.length} candidate IDs for this name. Re-querying TimeSlots...`);
                        timeSlots = await TimeSlot.find({
                            mentee: { $in: allPossibleIds },
                            status: { $in: ['booked', 'available'] }
                        })
                            .populate({
                                path: 'mentor',
                                populate: { path: 'user', select: 'full_name' }
                            })
                            .sort({ startTime: 1 });
                        console.log(`[Sessions Debug] Name-Based Search Found ${timeSlots.length} TimeSlots.`);
                    }
                }
            } catch (e) {
                console.error("Name-based fallback error:", e);
            }
        }

        const events = timeSlots.map(slot => {
            const validDate = slot.startTime ? new Date(slot.startTime) : new Date();

            return {
                id: slot._id,
                title: slot.notes || 'Mentorship Session',
                type: 'technical', // TimeSlot doesn't have type field
                date: validDate.toLocaleDateString('en-CA'),
                time: validDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                duration: (slot.duration || 60) + ' min',
                interviewer: (slot.mentor as any)?.user?.full_name || 'Mentor',
                interviewerId: (slot.mentor as any)?.user?._id,
                description: slot.notes || '',
                status: slot.status === 'booked' ? 'upcoming' : 'available',
                reminder: false,
                meetingLink: null // TimeSlot doesn't have meeting link
            };
        });

        return NextResponse.json({ success: true, events });
    } catch (error: any) {
        console.error('Error fetching mentee sessions:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
