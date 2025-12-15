import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import User from "@/models/User";
import Mentor from "@/models/Mentor";
import MentorFeedback from "@/models/MentorFeedback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(String(id ?? "").trim());

const cleanUser = (u) => {
  if (!u) return null;
  const { password_hash, resetPasswordToken, resetPasswordExpires, ...safe } =
    u;
  return safe;
};

/* ========================================================= */
/* ========================  GET  =========================== */
/* ========================================================= */
export async function GET(req, context) {
  try {
    const params = await context.params;
    const mentorId = params.mentorid;

    if (!isObjectId(mentorId)) {
      return NextResponse.json(
        { ok: false, message: "Invalid mentorId" },
        { status: 400 }
      );
    }

    await connectDB();

    const mentor = await Mentor.findById(mentorId).populate("user").lean();
    if (!mentor) {
      return NextResponse.json(
        { ok: false, message: "Mentor not found" },
        { status: 404 }
      );
    }

    const user = cleanUser(mentor.user);

    const reviews = await MentorFeedback.find({ mentor: mentorId }).lean();
    const avgRating = reviews.length
      ? Number(
          (
            reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0) /
            reviews.length
          ).toFixed(1)
        )
      : 0;

    const stats = {
      rating: avgRating,
      reviewsCount: reviews.length,
      menteesCount: mentor.menteesCount ?? 0,
      sessionsCount: mentor.sessionsCount ?? 0,
    };

    const frontProfile = {
      id: mentor._id.toString(),

      // USER fields
      full_name: user.full_name,
      email: user.email,
      profile_photo: user.profile_photo || null,
      linkedin_url: user.linkedin_url || "",
      github: user.github || "",
      short_bio: user.short_bio || "",
      phoneNumber: user.phoneNumber || "",
      Country: user.Country || "",
      area_of_expertise: user.area_of_expertise || [], // ARRAY ✔️
      created_at: user.created_at,

      // MENTOR fields
      yearsOfExperience: mentor.yearsOfExperience,
      hourlyRate: mentor.hourlyRate,
      stripeAccountId: mentor.stripeAccountId || "",
      focusAreas: mentor.focusAreas || [], // ARRAY ✔️
      availabilityType: mentor.availabilityType,
      languages: mentor.languages || [], // ARRAY ✔️
      sessionTypes: mentor.sessionTypes || [], // ARRAY ✔️
      certifications: mentor.certifications || [], // ARRAY ✔️
      achievements: mentor.achievements || [], // ARRAY ✔️

      social: {
        github: user.github || "",
        linkedin: user.linkedin_url || "",
      },

      level:
        mentor.yearsOfExperience >= 5
          ? 3
          : mentor.yearsOfExperience >= 3
          ? 2
          : 1,
    };

    return NextResponse.json(
      {
        ok: true,
        profile: frontProfile,
        stats,
        reviews,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET mentor profile error:", err);
    return NextResponse.json(
      { ok: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

/* ========================================================= */
/* ========================  PUT  =========================== */
/* ========================================================= */
export async function PUT(req, context) {
  try {
    const params = await context.params;
    const mentorId = params.mentorid;

    if (!isObjectId(mentorId)) {
      return NextResponse.json(
        { ok: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    await connectDB();
    const body = await req.json();
    const profile = body.profile || {};

    const mentorDoc = await Mentor.findById(mentorId).lean();
    if (!mentorDoc) {
      return NextResponse.json(
        { ok: false, message: "Mentor not found" },
        { status: 404 }
      );
    }

    const userSet = {};
    const mentorSet = {};

    // USER updates
    if (profile.full_name !== undefined) userSet.full_name = profile.full_name;
    if (profile.phoneNumber !== undefined)
      userSet.phoneNumber = profile.phoneNumber;
    if (profile.Country !== undefined) userSet.Country = profile.Country;
    if (profile.linkedin_url !== undefined)
      userSet.linkedin_url = profile.linkedin_url;
    if (profile.github !== undefined) userSet.github = profile.github;
    if (profile.short_bio !== undefined) userSet.short_bio = profile.short_bio;
    if (profile.profile_photo !== undefined)
      userSet.profile_photo = profile.profile_photo;

    if (Array.isArray(profile.area_of_expertise))
      userSet.area_of_expertise = profile.area_of_expertise; // ARRAY ✔️

    // MENTOR updates
    if (profile.yearsOfExperience != null)
      mentorSet.yearsOfExperience = Number(profile.yearsOfExperience);

    if (profile.hourlyRate != null)
      mentorSet.hourlyRate = Number(profile.hourlyRate);

    if (profile.stripeAccountId !== undefined)
      mentorSet.stripeAccountId = profile.stripeAccountId;

    if (Array.isArray(profile.focusAreas))
      mentorSet.focusAreas = profile.focusAreas; // ARRAY ✔️

    if (profile.availabilityType !== undefined)
      mentorSet.availabilityType = profile.availabilityType;

    if (Array.isArray(profile.languages))
      mentorSet.languages = profile.languages; // ARRAY ✔️

    if (Array.isArray(profile.sessionTypes))
      mentorSet.sessionTypes = profile.sessionTypes;

    if (Array.isArray(profile.certifications))
      mentorSet.certifications = profile.certifications;

    if (Array.isArray(profile.achievements))
      mentorSet.achievements = profile.achievements;

    // APPLY UPDATES
    if (Object.keys(userSet).length > 0)
      await User.findByIdAndUpdate(mentorDoc.user, { $set: userSet });

    if (Object.keys(mentorSet).length > 0)
      await Mentor.findByIdAndUpdate(mentorId, { $set: mentorSet });

    return NextResponse.json({ ok: true, message: "Updated successfully" });
  } catch (err) {
    console.error("PUT mentor profile error:", err);
    return NextResponse.json(
      { ok: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
