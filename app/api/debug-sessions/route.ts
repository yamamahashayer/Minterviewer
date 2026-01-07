import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // Get sample sessions
        const sessions = await Session.find({}).limit(10);
        const sessionCount = await Session.countDocuments({});

        // Get distinct values
        const distinctStatuses = await Session.distinct('status');
        const distinctTypes = await Session.distinct('sessionType');
        const distinctTopics = await Session.distinct('topic');

        return NextResponse.json({
            totalCount: sessionCount,
            distinctStatuses,
            distinctTypes,
            distinctTopics,
            sampleSessions: sessions.map(s => ({
                id: s._id,
                status: s.status,
                sessionType: s.sessionType,
                topic: s.topic,
                scheduledTime: s.scheduledTime,
                price: s.price
            }))
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
