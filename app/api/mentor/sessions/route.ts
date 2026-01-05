import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TimeSlot from '@/models/TimeSlot';
import Mentor from '@/models/Mentor';
import User from '@/models/User';
import { getUserFromToken } from '@/lib/auth-helper';

export async function GET(request: NextRequest) {
    try {
        console.log('[Sessions API] Request received (TimeSlot implementation)');

        // Auth check
        const authData = await getUserFromToken(request);
        if (!authData || authData.role !== 'mentor') {
            return NextResponse.json(
                { error: 'Unauthorized - Mentor authentication required' },
                { status: 401 }
            );
        }

        await dbConnect();

        // Get mentor profile
        console.log('[Sessions API] Finding mentor profile for user:', authData.id);
        const mentor = await Mentor.findOne({ user: authData.id }).lean();
        if (!mentor) {
            return NextResponse.json(
                { error: 'Mentor profile not found' },
                { status: 404 }
            );
        }

        const mentorId = mentor._id;
        const sessionOfferings = mentor.sessionOfferings || [];

        // Fetch all TimeSlots for this mentor
        // We typically want 'booked' slots for sessions, but maybe 'available' for calendar?
        // User asked for "sessions", so 'booked' is the priority.
        // Let's fetch all non-available to see history/requests, or just all.
        // To be safe and show everything relevant, let's fetch 'booked' and maybe 'blocked' if relevant.
        // Or simply fetch ALL for this mentor and filter in memory if volume is low, or query for existance of mentee?
        // TimeSlot.js has `mentee` field. If `mentee` is set, it's likely a relevant session.

        console.log('[Sessions API] Fetching TimeSlots for mentor:', mentorId);

        // Find slots that have a mentee assigned (implies booked/requested)
        const timeSlots = await TimeSlot.find({
            mentor: mentorId,
            mentee: { $exists: true, $ne: null }
        })
            .populate({
                path: 'mentee', // In TimeSlot, this ref is 'User'
                select: 'full_name profile_photo email'
            })
            .sort({ startTime: 1 })
            .lean();

        console.log(`[Sessions API] Found ${timeSlots.length} booked TimeSlots`);

        const now = new Date();

        // Group sessions
        const pendingRequests = [];
        const upcomingSessions = [];
        const pastSessions = [];

        for (const slot of timeSlots) {
            const s: any = slot;

            // Resolve Offering Details
            const offering = sessionOfferings.find((o: any) => o._id.toString() === s.sessionOffering?.toString());
            const topic = offering ? offering.title : 'Mentorship Session';
            const price = offering ? offering.price : 0;

            const menteeName = s.mentee?.full_name || 'Unknown Mentee';
            const menteePhoto = s.mentee?.profile_photo || '';
            const menteeId = s.mentee?._id || '';

            // Format data
            const formattedSession = {
                id: s._id,
                mentee: menteeName,
                menteeId: menteeId,
                avatar: menteePhoto,
                type: topic,
                date: new Date(s.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                time: `${new Date(s.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${new Date(s.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
                scheduledTime: s.startTime,
                status: s.status, // 'booked' usually
                message: s.notes || '',
                price: price / 100,
                submittedTime: s.createdAt,
                jitsiLink: "", // TimeSlot might not have this yet, or it's generated on fly
                feedback: false, // TimeSlot doesn't seem to have feedback boolean
                color: 'from-cyan-500 to-blue-500'
            };

            // Categorize based on time and status
            const endTime = new Date(s.endTime);
            const startTime = new Date(s.startTime);

            // If status is specific like 'pending' (TimeSlot enum was available/booked/blocked, assuming 'booked' covers both pending/confirmed for now unless I see otherwise)
            // For now, let's treat future 'booked' as upcoming, past 'booked' as past.
            // If there was a 'pending' mock data status, we might be missing a 'request' phase in TimeSlot?
            // User said "session on the time slot", so status likely maps to that.

            if (s.status === 'booked') {
                if (endTime < now) {
                    pastSessions.push({ ...formattedSession, status: 'completed' });
                } else {
                    upcomingSessions.push({ ...formattedSession, status: 'confirmed' });
                }
            } else if (s.status === 'blocked') {
                // Maybe ignore?
            } else {
                // Pending? If we find slots with status 'available' but have a mentee? Unlikely.
                // If the user system has "Pending Requests", they might be stored differently or as 'booked' but not 'confirmed' in another field.
                // TimeSlot.js only showed ['available', 'booked', 'blocked'].
                // Let's check if we missed any field? 
                // We will assume all 'booked' are confirmed for now, or check for pending requests separately if they exist elsewhere.
            }
        }

        // Sort
        upcomingSessions.sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
        pastSessions.sort((a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime());

        return NextResponse.json({
            success: true,
            data: {
                pending: pendingRequests, // Might be empty if TimeSlot doesn't distinguish
                upcoming: upcomingSessions,
                past: pastSessions
            }
        });

    } catch (error) {
        console.error('Error in Sessions API (TimeSlot):', error);
        return NextResponse.json(
            { error: 'Failed to fetch sessions', details: (error as Error).message },
            { status: 500 }
        );
    }
}
