
import User from "@/models/User";
import Mentor from "@/models/Mentor";
import Mentee from "@/models/Mentee";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        const {
            full_name,
            email,
            password,
            role, // "mentor" or "mentee"
            profile_photo,
            linkedin_url,
            area_of_expertise,
            short_bio,
            phoneNumber,
            Country,
            // Mentor-specific fields
            yearsOfExperience,
            field,
            availabilities,
        } = await req.json();

        // Validate required fields
        if (!full_name || !email || !password || !role) {
            return NextResponse.json(
                { message: "Missing required fields: full_name, email, password, and role are required" },
                { status: 400 }
            );
        }

        // Validate role
        if (role !== "mentor" && role !== "mentee") {
            return NextResponse.json(
                { message: "Invalid role. Must be 'mentor' or 'mentee'" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "Email already in use" },
                { status: 400 }
            );
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create base user data
        const userData = {
            full_name,
            email,
            password_hash,
            role,
            profile_photo,
            linkedin_url,
            area_of_expertise,
            short_bio,
            phoneNumber,
            Country,
        };

        // Create the User document
        const newUser = new User(userData);
        await newUser.save();

        // Create role-specific document
        if (role === "mentor") {
            const mentorData = {
                user: newUser._id,
                totalEarnings: 0,
                totalSessions: 0,
                totalMentees: 0,
                feedback: [],
                rating: 0,
                yearsOfExperience: yearsOfExperience || 0,
                field: field || area_of_expertise,
                availabilities: availabilities || [],
            };

            const newMentor = new Mentor(mentorData);
            await newMentor.save();

            return NextResponse.json(
                {
                    message: "Mentor registered successfully!",
                    user: {
                        id: newUser._id,
                        email: newUser.email,
                        role: newUser.role,
                    },
                },
                { status: 201 }
            );
        } else if (role === "mentee") {
            const menteeData = {
                user: newUser._id,
                overall_score: 0,
                total_interviews: 0,
                points_earned: 0,
                joined_date: new Date(),
                active: true,
            };

            const newMentee = new Mentee(menteeData);
            await newMentee.save();

            return NextResponse.json(
                {
                    message: "Mentee registered successfully!",
                    user: {
                        id: newUser._id,
                        email: newUser.email,
                        role: newUser.role,
                    },
                },
                { status: 201 }
            );
        }
    } catch (err: unknown) {
        // Narrow unknown to an object with optional code and message
        const error = ((): { code?: number; message?: string } => {
            if (typeof err === "object" && err !== null) {
                return err as { code?: number; message?: string };
            }
            return { message: String(err) };
        })();

        console.error("[REGISTER_ERROR]", error);

        // Handle specific MongoDB errors
        if (error.code === 11000) {
            return NextResponse.json(
                { message: "Email already exists" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
