import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Company from "@/models/Company";

export const dynamic = 'force-dynamic';

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ companyId: string }> }
) {
    try {
        await connectDB();

        const { companyId } = await context.params;
        const { reason } = await req.json();

        if (!reason) {
            return NextResponse.json({ message: "Rejection reason is required" }, { status: 400 });
        }

        // Find the company
        const company = await Company.findById(companyId).populate('user');
        if (!company) {
            return NextResponse.json({ message: "Company not found" }, { status: 404 });
        }

        // Update approval status
        company.approvalStatus = 'rejected';
        company.rejectionReason = reason;
        company.rejectedAt = new Date();
        await company.save();

        // Send notification to company user
        const origin = new URL(req.url).origin;
        await fetch(`${origin}/api/notifications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: company.user._id.toString(),
                title: "❌ Company Registration Rejected",
                message: `Your company "${company.name}" registration was not approved. Reason: ${reason}`,
                type: "system",
                redirectTo: "/company/overview",
            }),
        });

        return NextResponse.json({
            message: "Company rejected",
            company
        });

    } catch (error: any) {
        console.error("Error rejecting company:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
