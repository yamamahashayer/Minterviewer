
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Session from "@/models/Session";
import AiInterview from "@/models/AiInterview";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // Payments Debug
        const paymentCount = await Payment.countDocuments({});
        const paymentStatuses = await Payment.find({}).distinct('status');
        const paymentSample = await Payment.find({}).limit(5);
        const completedPayments = await Payment.find({ status: 'completed' });

        // Sessions Debug
        const sessionCount = await Session.countDocuments({});
        const sessionStatuses = await Session.find({}).distinct('status');
        const sessionSample = await Session.find({}).limit(5);

        return NextResponse.json({
            payments: {
                count: paymentCount,
                statuses: paymentStatuses,
                sample: paymentSample,
                completedCount: completedPayments.length
            },
            sessions: {
                count: sessionCount,
                statuses: sessionStatuses,
                sample: sessionSample
            },
            aiInterviews: {
                count: await AiInterview.countDocuments({})
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
