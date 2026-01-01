import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import Mentee from "@/models/Mentee";
import Activity from "@/models/Activity";
import puppeteer from "puppeteer";
import htmlDocx from "html-to-docx";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

const isValidObjectId = (v?: string) =>
  mongoose.Types.ObjectId.isValid(String(v || "").trim());

function wrapHtml(html: string) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Resume</title>
<style>
  @page { size: A4; margin: 24mm 18mm; }
  html,body{background:#fff;font-family:system-ui,Arial;color:#111;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  *{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
</style>
</head>
<body>
  ${html}
</body>
</html>`;
}

// ======= POST: Save resume =======
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // 🧩 extract menteeId manually from URL
    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const menteeId = segments[2];

    console.log("🟢 CV CREATE route hit!");
    console.log("🧩 menteeId extracted from URL:", menteeId);

    if (!isValidObjectId(menteeId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid menteeId" },
        { status: 400 }
      );
    }

    const menteeObjId = new mongoose.Types.ObjectId(menteeId);
    const { html, parsed } = await req.json();

    if (!html || typeof html !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing HTML content" },
        { status: 400 }
      );
    }

    const menteeDoc = await Mentee.findById(menteeObjId)
      .select("_id user")
      .lean();

    if (!menteeDoc) {
      return NextResponse.json(
        { ok: false, error: "Mentee not found" },
        { status: 404 }
      );
    }

    const userId =
      menteeDoc.user && isValidObjectId(String(menteeDoc.user))
        ? new mongoose.Types.ObjectId(String(menteeDoc.user))
        : undefined;

    const resume = await Resume.create({
      mentee: menteeObjId,
      user: userId,
      html,
      parsed: parsed || {},
      source: "builder",
    });

    /* ===== ACTIVITY LOG ===== */
    await Activity.create({
      ownerModel: "Mentee",
      owner: menteeObjId,
      type: "achievement",
      title: "Created a new CV",
    });

    console.log("✅ Resume created:", resume._id);

    return NextResponse.json({ ok: true, resume }, { status: 201 });
  } catch (err: any) {
    console.error("💥 CV CREATE error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}

// ======= GET: Export PDF / DOCX =======
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const format = url.searchParams.get("format") || "pdf";
    const resumeId = url.searchParams.get("resumeId");
    const menteeId = url.pathname.split("/")[3];

    console.log("📦 Export requested:", { format, resumeId, menteeId });

    if (!resumeId || !isValidObjectId(resumeId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid resumeId" },
        { status: 400 }
      );
    }

    await connectDB();

    const resume = await Resume.findById(resumeId).lean();
    if (!resume) {
      return NextResponse.json(
        { ok: false, error: "Resume not found" },
        { status: 404 }
      );
    }

    const html = wrapHtml(resume.html || "<p>No content</p>");

    // ========== PDF ==========
    if (format === "pdf") {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({ format: "A4" });
      await browser.close();

      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="resume-${resumeId}.pdf"`,
        },
      });
    }

    // ========== DOCX ==========
    if (format === "word" || format === "docx") {
      const docxBuffer = await htmlDocx(html);
      return new NextResponse(docxBuffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="resume-${resumeId}.docx"`,
        },
      });
    }

    return NextResponse.json(
      { ok: false, error: "Unsupported format" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("💥 CV EXPORT error:", err);
    return NextResponse.json(
      { ok: false, error: "Export failed" },
      { status: 500 }
    );
  }
}
