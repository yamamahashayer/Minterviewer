// app/api/mentees/[menteeId]/profile/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Mentee from "@/models/Mentee";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ================= Helper Functions ================= */
async function resolveParams(ctx) {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
}

const isObjectId = (id) => /^[a-fA-F0-9]{24}$/i.test(String(id ?? "").trim());

const cleanUser = (u) => {
  if (!u) return null;
  const { password_hash, ...rest } = u;
  return rest;
};

async function safeUpdate(Model, filter, update) {
  try {
    return await Model.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
    }).lean();
  } catch (e) {
    console.warn(`[safeUpdate ${Model.modelName}]`, e.message);
    return await Model.findOne(filter).lean();
  }
}

/* ========================== GET ========================== */
export async function GET(req, ctx) {
  try {
    const p = await resolveParams(ctx);
    const menteeId = String(p?.menteeId ?? p?.menteeid ?? p?.id ?? "").trim();

    if (!isObjectId(menteeId)) {
      return NextResponse.json(
        { message: "Invalid menteeId", received: menteeId },
        { status: 400 }
      );
    }

    await connectDB();

    const mentee = await Mentee.findById(menteeId).lean();
    if (!mentee)
      return NextResponse.json(
        { message: "Mentee not found" },
        { status: 404 }
      );

    const user = mentee.user
      ? await User.findById(mentee.user).select("-password_hash").lean()
      : null;

    // Sync skills from AI interviews (adds old interview skills + new ones and persists)
    try {
      const AiInterview = (await import('@/models/AiInterview')).default;

      const aiInterviews = await AiInterview.find({
        $or: [
          { mentee: menteeId },
          { mentee: mentee.user } // In case User ID was used
        ]
      }).lean();

      if (aiInterviews && aiInterviews.length > 0) {
        // Extract and aggregate skills
        const skillsMap = new Map();

        aiInterviews.forEach(interview => {
          const skills = [];

          // Extract from techstack
          if (interview.techstack && typeof interview.techstack === 'string') {
            skills.push(...interview.techstack.split(',').map(s => s.trim()));
          }

          // Add type and role
          if (interview.type) skills.push(interview.type);
          if (interview.role) skills.push(interview.role);

          // Aggregate scores for each skill
          skills.forEach(skill => {
            if (skill) {
              if (!skillsMap.has(skill)) {
                skillsMap.set(skill, { scores: [], attempts: 0 });
              }
              const data = skillsMap.get(skill);
              if (interview.overallScore !== undefined && interview.overallScore !== null) {
                data.scores.push(interview.overallScore);
              }
              data.attempts++;
            }
          });
        });

        // Convert to skills array format
        const skillsArray = Array.from(skillsMap.entries())
          .map(([name, data]) => ({
            name,
            level: data.scores.length > 0
              ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
              : 0,
            samples: data.attempts,
            updated_at: new Date()
          }))
          .sort((a, b) => b.level - a.level); // Sort by level descending

        const stored = Array.isArray(mentee.skills) ? mentee.skills : [];
        const storedNames = new Set(stored.map(s => String(s?.name || '').toLowerCase()).filter(Boolean));
        const computedNames = new Set(skillsArray.map(s => String(s?.name || '').toLowerCase()).filter(Boolean));
        const shouldSync = stored.length === 0 || skillsArray.length > stored.length || [...computedNames].some(n => !storedNames.has(n));

        if (shouldSync) {
          // Update mentee with skills
          mentee.skills = skillsArray;

          // Persist synced skills so previous interviews are stored in Mentees collection
          await safeUpdate(
            Mentee,
            { _id: menteeId },
            { $set: { skills: skillsArray } }
          );
        }
      }
    } catch (err) {
      console.error('Error populating skills from AI interviews:', err);
      // Continue without skills if there's an error
    }

    return NextResponse.json(
      { user: cleanUser(user), mentee },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET mentee profile error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ========================== PUT ========================== */
export async function PUT(req, ctx) {
  try {
    const p = await resolveParams(ctx);
    const menteeId = String(p?.menteeId ?? p?.menteeid ?? p?.id ?? "").trim();

    if (!isObjectId(menteeId)) {
      return NextResponse.json(
        { message: "Invalid menteeId", received: menteeId },
        { status: 400 }
      );
    }

    let body = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }

    const payload = typeof body === "object" ? body.profile ?? body : {};
    const has = (k) => Object.prototype.hasOwnProperty.call(payload, k);

    /* ================= USER UPDATES ================= */
    const userSet = {};
    if (has("name")) userSet.full_name = payload.name;
    if (has("bio")) userSet.short_bio = payload.bio;
    if (has("phone")) userSet.phoneNumber = payload.phone;
    if (has("location")) userSet.Country = payload.location;
    if (has("profile_photo")) userSet.profile_photo = payload.profile_photo;

    /* ================= MENTEE UPDATES ================= */
    const menteeSet = {};
    if (has("name")) menteeSet.name = payload.name;
    if (has("phone")) menteeSet.phone = payload.phone;
    if (has("location")) menteeSet.location = payload.location;

    if (
      Object.keys(userSet).length === 0 &&
      Object.keys(menteeSet).length === 0
    ) {
      return NextResponse.json(
        { message: "Nothing to update" },
        { status: 400 }
      );
    }

    await connectDB();

    const menteeDoc = await Mentee.findById(menteeId).lean();
    if (!menteeDoc) {
      return NextResponse.json(
        { message: "Mentee not found" },
        { status: 404 }
      );
    }

    /* ================= APPLY UPDATES ================= */
    const newMentee = await safeUpdate(
      Mentee,
      { _id: menteeId },
      { $set: menteeSet }
    );

    let newUser = null;
    if (menteeDoc.user && Object.keys(userSet).length > 0) {
      newUser = await safeUpdate(
        User,
        { _id: menteeDoc.user },
        { $set: userSet }
      );
    }

    return NextResponse.json(
      {
        user: cleanUser(newUser),
        mentee: newMentee,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT mentee profile error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
