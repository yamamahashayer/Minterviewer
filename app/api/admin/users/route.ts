
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const role = searchParams.get('role');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const query: any = {};
        if (search) {
            query.$or = [
                { full_name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (role && role !== 'all') {
            query.role = role;
        }

        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password_hash')
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(query)
        ]);

        return NextResponse.json({
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error: any) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        const { userId, isDeleted } = await req.json();

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { isDeleted: isDeleted },
            { new: true }
        ).select('-password_hash');

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);

    } catch (error: any) {
        console.error("Error updating user:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
