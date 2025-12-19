import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Mentee from "@/models/Mentee";
import Mentor from "@/models/Mentor";
import Company from "@/models/Company";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  await connectDB();

  // ✅ unwrap params
  const { id } = await ctx.params;

  /* 1️⃣ جرّب menteeId مباشرة */
  const mentee = await Mentee.findById(id).lean();
  if (mentee) {
    return NextResponse.json({
      type: "mentee",
      menteeId: mentee._id.toString(),
    });
  }

  /* 2️⃣ جرّب userId */
  const user = await User.findById(id).select("role").lean();
  if (!user) {
    return NextResponse.json(
      { message: "Profile not found" },
      { status: 404 }
    );
  }

  if (user.role === "mentee") {
    const mentee = await Mentee.findOne({ user: id }).select("_id").lean();
    return NextResponse.json({
      type: "mentee",
      menteeId: mentee?._id.toString(),
    });
  }

  if (user.role === "mentor") {
    const mentor = await Mentor.findOne({ user: id }).select("_id").lean();
    return NextResponse.json({
      type: "mentor",
      mentorId: mentor?._id.toString(),
    });
  }

  if (user.role === "company") {
    const company = await Company.findOne({ user: id }).select("_id").lean();
    return NextResponse.json({
      type: "company",
      companyId: company?._id.toString(),
    });
  }

  return NextResponse.json(
    { message: "Profile not supported" },
    { status: 400 }
  );
}
