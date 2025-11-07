import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isObjectId = (id?: string) => !!id && mongoose.Types.ObjectId.isValid(String(id));

async function postToAffinda(file: File, apiKey: string) {
  const workspace = process.env.AFFINDA_WORKSPACE!;
  const documentType = process.env.AFFINDA_DOCUMENT_TYPE!;

  const upstream = new FormData();
  upstream.append("file", file, (file as any).name || "resume.pdf");
  upstream.append("wait", "true");
  upstream.append("workspace", workspace);
  upstream.append("document_type", documentType);

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

  return res.json();
}



export async function POST(req: NextRequest, ctx: any) {
  try {
    await connectDB();

    const params = await ctx.params; 
    const userId = params?.userId;
    if (!isObjectId(userId)) {
      return NextResponse.json({ ok: false, error: "Invalid userId" }, { status: 400 });
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

    const affinda = await postToAffinda(file, AFFINDA_API_KEY);

    const html =
      affinda?.data?.html ||
      affinda?.data?.redactedHtml ||
      affinda?.html ||
      "";

    const saved = await Resume.create({
      user: userId,
      source: "affinda",
      parsed: affinda,
      html,
    });

    return NextResponse.json({ ok: true, resume: saved }, { status: 201 });
  } catch (e: any) {
    const msg = e?.message || "Server error";
    const isNetwork = /Cannot reach Affinda|fetch failed|ENOTFOUND|ECONN/i.test(msg);
    return NextResponse.json({ ok: false, error: msg }, { status: isNetwork ? 502 : 500 });
  }
}
