import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TimeSlot from '@/models/TimeSlot';

export async function GET() {
    try {
        await dbConnect();
        // Fetch last 10 booked slots
        const slots = await TimeSlot.find({ status: 'booked' })
            .sort({ updatedAt: -1 })
            .limit(10);

        return NextResponse.json({
            count: slots.length,
            slots: slots.map(s => ({
                id: s._id,
                status: s.status,
                menteeId: s.mentee, // Check if this exists
                menteeFieldType: typeof s.mentee,
                updatedAt: s.updatedAt,
                notes: s.notes
            }))
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
