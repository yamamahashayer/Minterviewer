import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Mentee from "@/models/Mentee";

// ---------- helpers ----------
async function resolveParams(ctx){ const p=ctx?.params; return (p && typeof p.then==="function")? await p : p; }
const isObjectId = (id)=> /^[a-fA-F0-9]{24}$/.test(String(id??"").trim());
const clean = (u)=>{ if(!u) return u; const { password_hash, ...rest } = u; return rest; };

async function safeFindOneAndUpdate(Model, filter, update, options){
  try {
    if (!update || (update.$set && Object.keys(update.$set).length===0)) 
      return await Model.findOne(filter).lean();
    return await Model.findOneAndUpdate(filter, update, { new:true, runValidators:true, ...options }).lean();
  } catch (e) {
    console.warn(`[safeUpdate ${Model.modelName}]`, e?.message);
    return await Model.findOne(filter).lean();
  }
}

// ========== GET ==========
export async function GET(req, ctx){
  try{
    const { userId } = await resolveParams(ctx) ?? {};
    if (!isObjectId(userId)) return NextResponse.json({ message:"Invalid userId" }, { status:400 });

    await connectDB();
    const _id = new mongoose.Types.ObjectId(userId);

    const user   = await User.findById(_id).select("-password_hash").lean();
    if (!user) return NextResponse.json({ message:"User not found" }, { status:404 });

    const mentee = await Mentee.findOne({ user:_id }).lean();

    return NextResponse.json({ user, mentee: mentee??null }, { status:200 });
  }catch(err){
    console.error("GET mentee profile error:", err);
    return NextResponse.json({ message:"Server error" }, { status:500 });
  }
}

// ========== PUT ==========
export async function PUT(req, ctx){
  try{
    const { userId } = await resolveParams(ctx) ?? {};
    if (!isObjectId(userId)) return NextResponse.json({ message:"Invalid userId" }, { status:400 });

    let body; 
    try { body = await req.json(); } 
    catch { return NextResponse.json({ message:"Invalid JSON body" }, { status:400 }); }

    const p = (body && typeof body === "object") ? (body.profile ?? body) : {};
    const has = (k)=> Object.prototype.hasOwnProperty.call(p, k);

    // -------- USER Updates --------
    const userSet = {};
    if (has("name"))      userSet.full_name = (p.name ?? "").trim();
    if (has("phone"))     userSet.phoneNumber = (p.phone ?? "").trim();
    if (has("location"))  userSet.Country = (p.location ?? "").trim();
    if (has("expertise")) userSet.area_of_expertise = (p.expertise ?? "").trim();
    if (has("bio"))       userSet.short_bio = (p.bio ?? "").trim(); // ✅ هنا صح

    // -------- MENTEE Updates --------
    const menteeSet = {};
    if (has("phone"))     menteeSet.phone = (p.phone ?? "").trim();
    if (has("location"))  menteeSet.location = (p.location ?? "").trim();
    if (has("name"))      menteeSet.name = (p.name ?? "").trim();
    if (has("expertise")) menteeSet.expertise = (p.expertise ?? "").trim();

    if (Object.keys(userSet).length===0 && Object.keys(menteeSet).length===0){
      return NextResponse.json({ message:"Nothing to update" }, { status:400 });
    }

    await connectDB();
    const _id = new mongoose.Types.ObjectId(userId);

    const [ userUpd, menteeUpd ] = await Promise.all([
      safeFindOneAndUpdate(User,   { _id }, { $set: userSet }),
      safeFindOneAndUpdate(Mentee, { user:_id }, { $set: menteeSet, $setOnInsert:{ user:_id } }, { upsert:true, setDefaultsOnInsert:true }),
    ]);

    const freshUser   = userUpd ?? await User.findById(_id).select("-password_hash").lean();
    const freshMentee = menteeUpd ?? await Mentee.findOne({ user:_id }).lean();

    return NextResponse.json({ user: clean(freshUser), mentee: freshMentee??null }, { status:200 });
  }catch(err){
    if (err?.code===11000 && err?.keyPattern?.email) {
      return NextResponse.json({ message:"Email already in use" }, { status:409 });
    }
    console.error("PUT mentee profile error:", err);
    return NextResponse.json({ message:"Server error" }, { status:500 });
  }
}
