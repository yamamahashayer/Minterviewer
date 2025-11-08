import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import Mentee from "@/models/Mentee";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isObjectId = (id?: string) =>
  !!id && mongoose.Types.ObjectId.isValid(String(id));

async function postToAffinda(file: File, apiKey: string) {
  const workspace = process.env.AFFINDA_WORKSPACE || "";
  const documentType = process.env.AFFINDA_DOCUMENT_TYPE || "";

  const upstream = new FormData();
  upstream.append("file", file, (file as any).name || "resume.pdf");
  upstream.append("wait", "true");
  if (workspace) upstream.append("workspace", workspace);
  if (documentType) upstream.append("document_type", documentType);

  const res = await fetch("https://api.affinda.com/v3/documents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    body: upstream,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Affinda ${res.status}: ${text}`);
  }

  return (await res.json()) as any;
}

export async function POST(req: NextRequest, ctx: any) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const parts = url.pathname.split("/");
    const menteeId = parts[3]; 
    console.log("🟢 CV UPLOAD route hit!");
    console.log("🧩 menteeId extracted from URL:", menteeId);

    if (!isObjectId(menteeId)) {
      return NextResponse.json({ ok: false, error: "Invalid menteeId" }, { status: 400 });
    }

    const ct = req.headers.get("content-type") || "";
    if (!ct.includes("multipart/form-data")) {
      return NextResponse.json({ ok: false, error: "Use multipart/form-data" }, { status: 415 });
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ ok: false, error: "No file uploaded" }, { status: 400 });
    }

    const AFFINDA_API_KEY = process.env.AFFINDA_API_KEY;
    if (!AFFINDA_API_KEY) {
      return NextResponse.json({ ok: false, error: "Missing AFFINDA_API_KEY" }, { status: 500 });
    }

    const menteeDoc = await Mentee.findById(menteeId).select("_id user").lean();
    if (!menteeDoc) {
      return NextResponse.json({ ok: false, error: "Mentee not found" }, { status: 404 });
    }

    const userId =
      menteeDoc.user && isObjectId(String(menteeDoc.user))
        ? new mongoose.Types.ObjectId(String(menteeDoc.user))
        : undefined;

    console.log("📤 Uploading file to Affinda...");
    const affindaJson = await postToAffinda(file, AFFINDA_API_KEY);

    const html =
      affindaJson?.data?.html ??
      affindaJson?.data?.redactedHtml ??
      affindaJson?.html ??
      affindaJson?.redactedHtml ??
      "";

    const resumeDoc = await Resume.create({
      user: userId,
      mentee: new mongoose.Types.ObjectId(menteeId),
      source: "affinda",
      parsed: affindaJson,
      html,
    });

    console.log("✅ Resume created:", resumeDoc._id);

    return NextResponse.json(
      {
        ok: true,
        resumeId: String(resumeDoc._id),
        affinda: affindaJson,
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("💥 CV UPLOAD error:", e?.message || e);
    const msg = e?.message || "Server error";
    const isNetwork = /Cannot reach Affinda|fetch failed|ENOTFOUND|ECONN|ECONNREFUSED|ETIMEDOUT/i.test(msg);
    return NextResponse.json({ ok: false, error: msg }, { status: isNetwork ? 502 : 500 });
  }
}
