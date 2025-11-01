import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET!;

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                full_name: user.full_name,
            },
            SECRET_KEY,
            { expiresIn: "7d" }
        );

        let redirectUrl = "/";
        switch (user.role) {
            case "mentor":
                redirectUrl = "/mentor/dashboard";
                break;
            case "mentee":
                redirectUrl = "/mentee";
                break;
            case "company":
                redirectUrl = "/company/dashboard";
                break;
            case "admin":
                redirectUrl = "/admin/dashboard";
                break;
            default:
                redirectUrl = "/";
        }

        // 7️⃣ Return token + user info + redirect path
        return NextResponse.json(
            {
                message: "Login successful",
                token,
                redirectUrl,
                user: {
                    id: user._id,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role,
                },
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error(
            "[SIGNIN_ERROR]",
            error instanceof Error ? error.message : String(error)
        );
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
