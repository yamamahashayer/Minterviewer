import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Company from "@/models/Company";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status'); // pending, approved, rejected, all
        const search = searchParams.get('search') || '';

        let query: any = {};

        // Map status to isVerified field
        if (status === 'pending') {
            query.isVerified = false;
        } else if (status === 'approved') {
            query.isVerified = true;
        } else if (status === 'rejected') {
            // For rejected, we can use approvalStatus if it exists, otherwise skip
            query.approvalStatus = 'rejected';
        }
        // 'all' means no filter

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { workEmail: { $regex: search, $options: 'i' } },
                { industry: { $regex: search, $options: 'i' } }
            ];
        }

        const companies = await Company.find(query)
            .populate('user', 'full_name email')
            .sort({ createdAt: -1 })
            .limit(100);

        return NextResponse.json({ companies });

    } catch (error: any) {
        console.error("Error fetching companies:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
