import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Company from "@/models/Company";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // Get all companies to debug
        const allCompanies = await Company.find({}).limit(10);

        return NextResponse.json({
            count: allCompanies.length,
            companies: allCompanies.map(c => ({
                id: c._id,
                name: c.name,
                approvalStatus: c.approvalStatus,
                isVerified: c.isVerified,
                createdAt: c.createdAt
            }))
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
