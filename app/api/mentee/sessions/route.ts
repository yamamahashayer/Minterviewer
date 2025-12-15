import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TimeSlot from '@/models/TimeSlot';
import Session from '@/models/Session'; // Ensure models are registered
import Mentor from '@/models/Mentor';
import User from '@/models/User';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const menteeId = searchParams.get('menteeId');

    if (!menteeId) {
        return NextResponse.json({ error: 'Mentee ID required' }, { status: 400 });
    }

    try {
        await dbConnect();

        // Fetch time slots where 'mentee' equals the provided ID and status is 'booked'
        // Also populate the 'session' (for title/type) and 'mentor' (for name)
        const slots = await TimeSlot.find({ mentee: menteeId, status: 'booked' })
            .populate('session')
            .populate({
                path: 'mentor',
                populate: { path: 'user', select: 'full_name' }
            })
            .sort({ startTime: 1 });

        // Transform to frontend friendly format if needed, or send as is
        const events = slots.map(slot => ({
            id: slot._id,
            title: slot.session?.title || 'Mentorship Session',
            type: slot.session?.type || 'technical', // default type
            date: new Date(slot.startTime).toLocaleDateString('en-CA'), // YYYY-MM-DD
            time: new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            duration: (slot.duration || 60) + ' min',
            interviewer: slot.mentor?.user?.full_name || 'Mentor',
            interviewerId: slot.mentor?.user?._id, // Added for feedback
            description: slot.notes || slot.session?.description || '',
            status: slot.startTime < new Date() ? 'completed' : 'upcoming',
            reminder: false, // default
            meetingLink: slot.notes?.match(/https:\/\/meet\.jit\.si\/[^\s]+/) ? slot.notes.match(/https:\/\/meet\.jit\.si\/[^\s]+/)[0] : null
        }));

        return NextResponse.json({ success: true, events });
    } catch (error: any) {
        console.error('Error fetching mentee sessions:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
