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

        console.log("Approving company:", companyId);

        // Find the company
        const company = await Company.findById(companyId).populate('user');
        if (!company) {
            console.log("Company not found:", companyId);
            return NextResponse.json({ message: "Company not found" }, { status: 404 });
        }

        console.log("Found company:", company.name);

        // Update isVerified to true (approved)
        company.isVerified = true;
        if (company.approvalStatus !== undefined) {
            company.approvalStatus = 'approved';
        }
        company.approvedAt = new Date();
        await company.save();

        console.log("Company approved:", company.name);

        // Send notification to company user
        const origin = new URL(req.url).origin;
        await fetch(`${origin}/api/notifications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: company.user._id.toString(),
                title: "✅ Company Approved!",
                message: `Congratulations! Your company "${company.name}" has been approved. You can now post jobs and access all features.`,
                type: "system",
                redirectTo: "/company/jobs",
            }),
        });

        return NextResponse.json({
            message: "Company approved successfully",
            company
        });

    } catch (error: any) {
        console.error("Error approving company:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
