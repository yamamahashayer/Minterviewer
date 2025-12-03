import { NextRequest, NextResponse } from "next/server";
import { uploadToDrive } from "../../../../../../lib/google/googleDrive";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";

export async function POST(req: NextRequest, ctx: any) {
  try {
    await connectDB();

    const p = await ctx.params;
    const menteeId = p?.menteeid;

    const form = await req.formData();
    const file = form.get("file") as File;

    console.log("📤 Uploading to Drive test...");

    const driveFile = await uploadToDrive(
      file,
      process.env.GOOGLE_DRIVE_FOLDER_ID!
    );

    console.log("📁 Done:", driveFile);

    return NextResponse.json({ ok: true, drive: driveFile });

  } catch (err) {
    console.error("❌ Upload Error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
