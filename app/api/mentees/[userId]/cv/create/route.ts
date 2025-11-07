import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Resume from "@/models/Resume";
import connectDB from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const isObjectId = (v?: string) => !!v && mongoose.Types.ObjectId.isValid(String(v));
const isPromise = (x: any) => !!x && typeof x.then === "function";

async function resolveParams(ctx: any) {
  const p = ctx?.params;
  return isPromise(p) ? await p : p;
}

// ---- PDF helper ----
function wrapHtml(html: string) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Resume</title>
<style>
  @page { size: A4; margin: 24mm 18mm; }
  html,body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  .resume-root{font-family:system-ui,Arial;color:#111;}
  *{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
</style>
</head><body>
  <div class="resume-root">${html}</div>
</body></html>`;
}


export async function POST(req: NextRequest, ctx: any) {
  try {
    await connectDB();

    const { userId } = await resolveParams(ctx);
    if (!isObjectId(userId)) {
      return NextResponse.json({ ok: false, error: "Invalid userId" }, { status: 400 });
    }

    const ct = req.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      return NextResponse.json({ ok: false, error: "Use application/json" }, { status: 415 });
    }

    const { html, parsed, role, menteeId } = await req.json();

    if (!html || typeof html !== "string") {
      return NextResponse.json({ ok: false, error: "Field 'html' is required" }, { status: 400 });
    }
    if (menteeId && !isObjectId(menteeId)) {
      return NextResponse.json({ ok: false, error: "Invalid menteeId" }, { status: 400 });
    }

    const doc = await Resume.create({
      user: userId,
      mentee: menteeId || undefined,
      parsed: parsed || {},
      html,
    });

    return NextResponse.json({ ok: true, resume: doc }, { status: 201 });
  } catch (e: any) {
    console.error("CV CREATE POST error:", e?.message || e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

