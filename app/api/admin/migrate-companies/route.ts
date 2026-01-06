import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Company from "@/models/Company";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Update all companies that don't have approvalStatus
        const result = await Company.updateMany(
            { approvalStatus: { $exists: false } },
            {
                $set: {
                    approvalStatus: 'pending' // Set all existing companies to pending
                }
            }
        );

        // Also update companies where approvalStatus is null
        const result2 = await Company.updateMany(
            { approvalStatus: null },
            {
                $set: {
                    approvalStatus: 'pending'
                }
            }
        );

        return NextResponse.json({
            message: "Migration completed",
            modifiedCount: result.modifiedCount + result2.modifiedCount
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
