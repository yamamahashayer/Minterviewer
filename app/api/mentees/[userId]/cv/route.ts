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

// GET /api/mentees/:userId/cv

export async function GET(req: NextRequest, ctx: any) {
  try {
    await connectDB();

    const { userId } = await resolveParams(ctx);
    if (!isObjectId(userId)) {
      return NextResponse.json({ ok: false, error: "Invalid userId" }, { status: 400 });
    }

    const url = new URL(req.url);
    const format = (url.searchParams.get("format") || "").toLowerCase();
    const resumeId = url.searchParams.get("resumeId");
    const limit = Math.max(1, Math.min(50, Number(url.searchParams.get("limit") || 8)));

    // --------- PDF mode ----------
    if (format === "pdf") {
      let doc: any = null;
      if (resumeId) {
        if (!isObjectId(resumeId)) {
          return NextResponse.json({ ok: false, error: "Invalid resumeId" }, { status: 400 });
        }
        doc = await Resume.findOne({ _id: resumeId, user: userId }).lean();
      } else {
        doc = await Resume.findOne({ user: userId }).sort({ createdAt: -1 }).lean();
      }

      if (!doc?.html) {
        return NextResponse.json({ ok: false, error: "No resume HTML found for this user" }, { status: 404 });
      }

      const htmlDoc = wrapHtml(String(doc.html));

      const puppeteer = await import("puppeteer");
      const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.setContent(htmlDoc, { waitUntil: "networkidle0" });
      const pdf = await page.pdf({ format: "A4", printBackground: true });
      await browser.close();

      return new NextResponse(pdf, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="resume-${userId}.pdf"`,
        },
      });
    }


// --------- WORD (DOCX) mode ----------
if (format === "word" || format === "docx") {
  let doc: any = null;
  if (resumeId) {
    if (!isObjectId(resumeId)) {
      return NextResponse.json({ ok: false, error: "Invalid resumeId" }, { status: 400 });
    }
    doc = await Resume.findOne({ _id: resumeId, user: userId }).lean();
  } else {
    doc = await Resume.findOne({ user: userId }).sort({ createdAt: -1 }).lean();
  }

  if (!doc?.html) {
    return NextResponse.json({ ok: false, error: "No resume HTML found for this user" }, { status: 404 });
  }

  const htmlDoc = wrapHtml(String(doc.html));

  const { default: htmlToDocx } = await import("html-to-docx");
  const buffer = await htmlToDocx(htmlDoc, undefined, {
    font: "Arial",
    margin: { top: 720, right: 720, bottom: 720, left: 720 }, // 1 inch (twips)
  });

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="resume-${userId}.docx"`,
    },
  });
}

    // --------- JSON mode ----------
    const items = await Resume.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ ok: true, items });
  } catch (e: any) {
    console.error("CV GET error:", e?.message || e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

// POST /api/mentees/:userId/cv 
export async function POST(req: NextRequest, ctx: any) {
  try {
    await connectDB();
    const { userId } = await resolveParams(ctx);
    if (!isObjectId(userId)) {
      return NextResponse.json({ ok: false, error: "Invalid userId" }, { status: 400 });
    }

    const ct = req.headers.get("content-type") || "";

    if (ct.includes("multipart/form-data")) {
      const AFFINDA_API_KEY = process.env.AFFINDA_API_KEY;
      if (!AFFINDA_API_KEY) {
        return NextResponse.json({ ok: false, error: "Missing AFFINDA_API_KEY" }, { status: 500 });
      }

      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const role = (formData.get("role") as string) || "Software Engineer";
      const menteeId = formData.get("menteeId") as string | null;

      if (!file) {
        return NextResponse.json({ ok: false, error: "No file uploaded" }, { status: 400 });
      }
      if (menteeId && !isObjectId(menteeId)) {
        return NextResponse.json({ ok: false, error: "Invalid menteeId" }, { status: 400 });
      }

      const upstream = new FormData();
      upstream.append("file", file, (file as any).name || "resume");

      const affindaRes = await fetch("https://api.affinda.com/v3/resumes", {
        method: "POST",
        headers: { Authorization: `Bearer ${AFFINDA_API_KEY}` },
        body: upstream,
      });

      if (!affindaRes.ok) {
        const errText = await affindaRes.text();
        return NextResponse.json({ ok: false, error: `Affinda error: ${errText}` }, { status: 502 });
      }

      const parsed = await affindaRes.json();
      const html =
        parsed?.data?.html ||
        parsed?.data?.redactedHtml ||
        parsed?.html ||
        "";

      const saved = await Resume.create({
        user: userId,
        mentee: menteeId || undefined,
        role,
        source: "affinda",
        parsed,
        html,
      });

      return NextResponse.json({ ok: true, resume: saved }, { status: 201 });
    }

    if (!ct.includes("application/json")) {
      return NextResponse.json(
        { ok: false, error: "Unsupported content-type. Use multipart/form-data for files or application/json." },
        { status: 415 }
      );
    }

    const { html, parsed, role, source, menteeId } = await req.json();

    if (!html || typeof html !== "string") {
      return NextResponse.json({ ok: false, error: "Field 'html' is required" }, { status: 400 });
    }
    if (menteeId && !isObjectId(menteeId)) {
      return NextResponse.json({ ok: false, error: "Invalid menteeId" }, { status: 400 });
    }

    const doc = await Resume.create({
      user: userId,
      mentee: menteeId || undefined,
      role: role || "Software Engineer",
      source: source || "affinda",
      parsed: parsed || {},
      html,
    });

    return NextResponse.json({ ok: true, resume: doc }, { status: 201 });

  } catch (e: any) {
    console.error("CV POST error:", e?.message || e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}


/** PUT /api/mentees/:userId/cv (upsert) */
export async function PUT(req: NextRequest, ctx: any) {
  try {
    await connectDB();

    const { userId } = await resolveParams(ctx);
    if (!isObjectId(userId)) {
      return NextResponse.json({ ok: false, error: "Invalid userId" }, { status: 400 });
    }

    const { html, parsed, role, source, menteeId, resumeId } = await req.json();

    if (resumeId && !isObjectId(resumeId)) {
      return NextResponse.json({ ok: false, error: "Invalid resumeId" }, { status: 400 });
    }
    if (menteeId && !isObjectId(menteeId)) {
      return NextResponse.json({ ok: false, error: "Invalid menteeId" }, { status: 400 });
    }

    const filter = resumeId ? { _id: resumeId, user: userId } : { user: userId };

    const update: any = {};
    if (typeof html !== "undefined") update.html = html;
    if (typeof parsed !== "undefined") update.parsed = parsed;
    if (typeof role !== "undefined") update.role = role;
    if (typeof source !== "undefined") update.source = source;
    if (typeof menteeId !== "undefined") update.mentee = menteeId || undefined;

    const doc = await Resume.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    ).lean();

    return NextResponse.json({ ok: true, resume: doc });
  } catch (e: any) {
    console.error("CV PUT error:", e?.message || e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
